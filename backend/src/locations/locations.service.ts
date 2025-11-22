// locations.service
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { NodeType, Prisma, RelationType } from "@prisma/client";
import { PrismaService } from "../common/prisma.service";

const LINK_REGEX = /<<([ECLO]):([^>]+)>>/g;
const TYPE_MAP: Record<"E" | "C" | "L" | "O", NodeType> = {
  E: NodeType.EVENT,
  C: NodeType.CHARACTER,
  L: NodeType.LOCATION,
  O: NodeType.OBJECT,
};

type CreateLocationDto = {
  name: string;
  description?: string;
  imageUrl?: string | null;
};

type UpdateLocationDto = Partial<CreateLocationDto>;

@Injectable()
export class LocationsService {
  constructor(private readonly prisma: PrismaService) {}

  private async assertCampaignOwnership(campaignId: string, userId: string) {
    const camp = await this.prisma.campaign.findUnique({
      where: { id: campaignId },
      select: { id: true, userId: true },
    });
    if (!camp) throw new NotFoundException("Campaign not found");
    if (camp.userId !== userId) throw new ForbiddenException("Not permitted");
  }

  private async getLocationWithOwner(id: string) {
    const loc = await this.prisma.location.findUnique({
      where: { id },
      include: { campaign: { select: { id: true, userId: true } } },
    });
    if (!loc) throw new NotFoundException("Location not found");
    return loc;
  }

  private async syncDescriptionLinks(location: {
    id: string;
    campaignId: string;
    description?: string | null;
  }) {
    const desc = location.description ?? "";

    await this.prisma.relation.deleteMany({
      where: {
        fromType: NodeType.LOCATION,
        fromId: location.id,
        kind: RelationType.LINK,
      },
    });

    if (!desc) return;

    const tokens: { type: "E" | "C" | "L" | "O"; name: string }[] = [];
    let match: RegExpExecArray | null;
    LINK_REGEX.lastIndex = 0;

    while ((match = LINK_REGEX.exec(desc)) !== null) {
      const [, t, raw] = match;
      const type = t as "E" | "C" | "L" | "O";
      const name = raw.trim();
      if (!name) continue;
      tokens.push({ type, name });
    }

    if (!tokens.length) return;

    const byType = { E: [], C: [], L: [], O: [] } as Record<
      "E" | "C" | "L" | "O",
      string[]
    >;
    for (const t of tokens) byType[t.type].push(t.name);

    const [events, chars, locs, objs] = await Promise.all([
      byType.E.length
        ? this.prisma.event.findMany({
            where: { campaignId: location.campaignId, title: { in: byType.E } },
          })
        : [],
      byType.C.length
        ? this.prisma.character.findMany({
            where: { campaignId: location.campaignId, name: { in: byType.C } },
          })
        : [],
      byType.L.length
        ? this.prisma.location.findMany({
            where: { campaignId: location.campaignId, name: { in: byType.L } },
          })
        : [],
      byType.O.length
        ? this.prisma.objectModel.findMany({
            where: { campaignId: location.campaignId, name: { in: byType.O } },
          })
        : [],
    ]);

    const map = {
      E: new Map(events.map((e) => [e.title, e.id])),
      C: new Map(chars.map((c) => [c.name, c.id])),
      L: new Map(locs.map((l) => [l.name, l.id])),
      O: new Map(objs.map((o) => [o.name, o.id])),
    };

    const data = tokens
      .map((t) => {
        const toId = map[t.type].get(t.name);
        if (!toId) return null;
        return {
          fromType: NodeType.LOCATION,
          fromId: location.id,
          toType: TYPE_MAP[t.type],
          toId,
          kind: RelationType.LINK,
        };
      })
      .filter(Boolean) as any[];

    if (data.length)
      await this.prisma.relation.createMany({ data, skipDuplicates: true });
  }

  async listByCampaign(campaignId: string, userId: string) {
    await this.assertCampaignOwnership(campaignId, userId);
    return this.prisma.location.findMany({
      where: { campaignId },
      orderBy: [{ name: "asc" }],
    });
  }

  async getOne(id: string, userId: string) {
    const loc = await this.getLocationWithOwner(id);
    if (loc.campaign.userId !== userId)
      throw new ForbiddenException("Not permitted");
    const { campaign, ...rest } = loc;
    return rest;
  }

  async create(campaignId: string, userId: string, dto: CreateLocationDto) {
    await this.assertCampaignOwnership(campaignId, userId);

    if (!dto?.name || !dto.name.trim())
      throw new BadRequestException("Name is required");

    try {
      const created = await this.prisma.location.create({
        data: {
          campaignId,
          name: dto.name.trim(),
          description:
            dto.description !== undefined
              ? dto.description?.trim() || null
              : undefined,
          imageUrl:
            dto.imageUrl !== undefined
              ? dto.imageUrl?.trim() || null
              : undefined,
        },
      });

      await this.syncDescriptionLinks(created);
      return created;
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2002"
      )
        throw new ConflictException(
          "A location with this name already exists in this campaign"
        );
      throw e;
    }
  }

  async update(id: string, userId: string, dto: UpdateLocationDto) {
    const loc = await this.getLocationWithOwner(id);
    if (loc.campaign.userId !== userId)
      throw new ForbiddenException("Not permitted");

    if (dto.name !== undefined && !dto.name.trim())
      throw new BadRequestException("Name cannot be empty");

    try {
      const updated = await this.prisma.location.update({
        where: { id },
        data: {
          name: dto.name?.trim(),
          description:
            dto.description !== undefined
              ? dto.description?.trim() || null
              : undefined,
          imageUrl:
            dto.imageUrl !== undefined
              ? dto.imageUrl?.trim() || null
              : undefined,
        },
      });

      await this.syncDescriptionLinks(updated);
      return updated;
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2002"
      )
        throw new ConflictException(
          "A location with this name already exists in this campaign"
        );
      throw e;
    }
  }

  async remove(id: string, userId: string) {
    const loc = await this.getLocationWithOwner(id);
    if (loc.campaign.userId !== userId)
      throw new ForbiddenException("Not permitted");

    await this.prisma.relation.deleteMany({
      where: {
        OR: [
          { fromType: NodeType.LOCATION, fromId: id },
          { toType: NodeType.LOCATION, toId: id },
        ],
      },
    });

    await this.prisma.location.delete({ where: { id } });
    return { ok: true };
  }
}
