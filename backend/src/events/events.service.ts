import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { NodeType, Prisma, RelationType } from '@prisma/client';
import { PrismaService } from '../common/prisma.service';

type CreateEventDto = {
  title: string;
  description?: string;
};

type UpdateEventDto = Partial<CreateEventDto>;

const LINK_REGEX = /<<([ECLO]):([^>]+)>>/g;

const TYPE_MAP: Record<'E' | 'C' | 'L' | 'O', NodeType> = {
  E: NodeType.EVENT,
  C: NodeType.CHARACTER,
  L: NodeType.LOCATION,
  O: NodeType.OBJECT,
};

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  private async assertCampaignOwnership(campaignId: string, userId: string) {
    const camp = await this.prisma.campaign.findUnique({
      where: { id: campaignId },
      select: { id: true, userId: true },
    });
    if (!camp) throw new NotFoundException('Campaign not found');
    if (camp.userId !== userId) throw new ForbiddenException('Not permitted');
  }

  private async getEventWithOwner(eventId: string) {
    const ev = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: { campaign: { select: { id: true, userId: true } } },
    });
    if (!ev) throw new NotFoundException('Event not found');
    return ev;
  }

  /**
   * Lê a descrição do evento, encontra tokens `<<X:Name>>`
   * e sincroniza as Relations LINK correspondentes.
   */
  private async syncDescriptionLinksForEvent(event: {
    id: string;
    campaignId: string;
    description?: string | null;
  }) {
    const description = event.description ?? '';

    await this.prisma.relation.deleteMany({
      where: {
        fromType: NodeType.EVENT,
        fromId: event.id,
        kind: RelationType.LINK,
      },
    });

    if (!description) return;

    const tokens: { type: 'E' | 'C' | 'L' | 'O'; name: string }[] = [];
    let match: RegExpExecArray | null;

    while ((match = LINK_REGEX.exec(description)) !== null) {
      const [, t, rawName] = match;
      const type = t as 'E' | 'C' | 'L' | 'O';
      const name = rawName.trim();
      if (!name) continue;
      tokens.push({ type, name });
    }

    if (!tokens.length) return;

    const byType = {
      E: [] as string[],
      C: [] as string[],
      L: [] as string[],
      O: [] as string[],
    };

    for (const token of tokens) {
      byType[token.type].push(token.name);
    }

    const [events, chars, locs, objs] = await Promise.all([
      byType.E.length
        ? this.prisma.event.findMany({
            where: { campaignId: event.campaignId, title: { in: byType.E } },
          })
        : Promise.resolve([]),
      byType.C.length
        ? this.prisma.character.findMany({
            where: { campaignId: event.campaignId, name: { in: byType.C } },
          })
        : Promise.resolve([]),
      byType.L.length
        ? this.prisma.location.findMany({
            where: { campaignId: event.campaignId, name: { in: byType.L } },
          })
        : Promise.resolve([]),
      byType.O.length
        ? this.prisma.objectModel.findMany({
            where: { campaignId: event.campaignId, name: { in: byType.O } },
          })
        : Promise.resolve([]),
    ]);

    const map = {
      E: new Map(events.map((e) => [e.title, e.id])),
      C: new Map(chars.map((c) => [c.name, c.id])),
      L: new Map(locs.map((l) => [l.name, l.id])),
      O: new Map(objs.map((o) => [o.name, o.id])),
    };

    const data: {
      fromType: NodeType;
      fromId: string;
      toType: NodeType;
      toId: string;
      kind: RelationType;
    }[] = [];

    for (const token of tokens) {
      const toType = TYPE_MAP[token.type];
      const toId = map[token.type].get(token.name);
      if (!toId) continue;
      data.push({
        fromType: NodeType.EVENT,
        fromId: event.id,
        toType,
        toId,
        kind: RelationType.LINK,
      });
    }

    if (!data.length) return;

    await this.prisma.relation.createMany({
      data,
      skipDuplicates: true,
    });
  }

  async listByCampaign(campaignId: string, userId: string) {
    await this.assertCampaignOwnership(campaignId, userId);
    return this.prisma.event.findMany({
      where: { campaignId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async getOne(eventId: string, userId: string) {
    const ev = await this.getEventWithOwner(eventId);
    if (ev.campaign.userId !== userId) throw new ForbiddenException('Not permitted');
    const { campaign, ...rest } = ev;
    return rest;
  }

  async create(campaignId: string, userId: string, dto: CreateEventDto) {
    await this.assertCampaignOwnership(campaignId, userId);
    if (!dto?.title || !dto.title.trim()) {
      throw new BadRequestException('Title is required');
    }

    try {
      const created = await this.prisma.event.create({
        data: {
          campaignId,
          title: dto.title.trim(),
          description: dto.description?.trim() || null,
        },
      });

      await this.syncDescriptionLinksForEvent(created);

      return created;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException(
          'An event with this title already exists in this campaign',
        );
      }
      throw e;
    }
  }

  async update(eventId: string, userId: string, dto: UpdateEventDto) {
    const ev = await this.getEventWithOwner(eventId);
    if (ev.campaign.userId !== userId) throw new ForbiddenException('Not permitted');

    if (dto.title !== undefined && !dto.title.trim()) {
      throw new BadRequestException('Title cannot be empty');
    }

    try {
      const updated = await this.prisma.event.update({
        where: { id: eventId },
        data: {
          title: dto.title !== undefined ? dto.title.trim() : undefined,
          description:
            dto.description !== undefined
              ? dto.description.trim() || null
              : undefined,
        },
      });

      await this.syncDescriptionLinksForEvent(updated);

      return updated;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException(
          'An event with this title already exists in this campaign',
        );
      }
      throw e;
    }
  }

  async remove(eventId: string, userId: string) {
    const ev = await this.getEventWithOwner(eventId);
    if (ev.campaign.userId !== userId) throw new ForbiddenException('Not permitted');

    await this.prisma.relation.deleteMany({
      where: {
        OR: [
          { fromType: NodeType.EVENT, fromId: eventId },
          { toType: NodeType.EVENT, toId: eventId },
        ],
      },
    });

    await this.prisma.event.delete({ where: { id: eventId } });
    return { ok: true };
  }
}
