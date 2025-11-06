import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../common/prisma.service';

type CreateEventDto = {
  title: string;
  description?: string;
  occurredAt?: string;
};

type UpdateEventDto = Partial<CreateEventDto>;

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

  private parseDateOrNull(s?: string): Date | null {
    if (!s) return null;
    const d = new Date(s);
    if (Number.isNaN(d.getTime())) {
      throw new BadRequestException('Invalid ISO date in "occurredAt"');
    }
    return d;
  }

  async listByCampaign(campaignId: string, userId: string) {
    await this.assertCampaignOwnership(campaignId, userId);
    return this.prisma.event.findMany({
      where: { campaignId },
      orderBy: [{ occurredAt: 'asc' }, { createdAt: 'asc' }],
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
      return await this.prisma.event.create({
        data: {
          campaignId,
          title: dto.title.trim(),
          description: dto.description?.trim() || null,
          occurredAt: this.parseDateOrNull(dto.occurredAt),
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        // unique(campaignId, title)
        throw new ConflictException('An event with this title already exists in this campaign');
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
      return await this.prisma.event.update({
        where: { id: eventId },
        data: {
          title: dto.title?.trim(),
          description: dto.description?.trim() ?? undefined,
          occurredAt:
            dto.occurredAt !== undefined ? this.parseDateOrNull(dto.occurredAt) : undefined,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('An event with this title already exists in this campaign');
      }
      throw e;
    }
  }

  async remove(eventId: string, userId: string) {
    const ev = await this.getEventWithOwner(eventId);
    if (ev.campaign.userId !== userId) throw new ForbiddenException('Not permitted');
    await this.prisma.event.delete({ where: { id: eventId } });
    return { ok: true };
  }
}
