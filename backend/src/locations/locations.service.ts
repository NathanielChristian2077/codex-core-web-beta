import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../common/prisma.service';

type CreateLocationDto = { name: string; description?: string };
type UpdateLocationDto = Partial<CreateLocationDto>;

@Injectable()
export class LocationsService {
  constructor(private readonly prisma: PrismaService) {}

  private async assertCampaignOwnership(campaignId: string, userId: string) {
    const camp = await this.prisma.campaign.findUnique({
      where: { id: campaignId },
      select: { id: true, userId: true },
    });
    if (!camp) throw new NotFoundException('Campaign not found');
    if (camp.userId !== userId) throw new ForbiddenException('Not permitted');
  }

  private async getWithOwner(locationId: string) {
    const loc = await this.prisma.location.findUnique({
      where: { id: locationId },
      include: { campaign: { select: { id: true, userId: true } } },
    });
    if (!loc) throw new NotFoundException('Location not found');
    return loc;
  }

  async listByCampaign(campaignId: string, userId: string) {
    await this.assertCampaignOwnership(campaignId, userId);
    return this.prisma.location.findMany({
      where: { campaignId },
      orderBy: { name: 'asc' },
    });
  }

  async getOne(locationId: string, userId: string) {
    const loc = await this.getWithOwner(locationId);
    if (loc.campaign.userId !== userId) throw new ForbiddenException('Not permitted');
    const { campaign, ...rest } = loc;
    return rest;
  }

  async create(campaignId: string, userId: string, dto: CreateLocationDto) {
    await this.assertCampaignOwnership(campaignId, userId);
    if (!dto?.name || !dto.name.trim()) throw new BadRequestException('Name is required');

    try {
      return await this.prisma.location.create({
        data: {
          campaignId,
          name: dto.name.trim(),
          description: dto.description?.trim() || null,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('A location with this name already exists in this campaign');
      }
      throw e;
    }
  }

  async update(locationId: string, userId: string, dto: UpdateLocationDto) {
    const loc = await this.getWithOwner(locationId);
    if (loc.campaign.userId !== userId) throw new ForbiddenException('Not permitted');
    if (dto.name !== undefined && !dto.name.trim()) {
      throw new BadRequestException('Name cannot be empty');
    }

    try {
      return await this.prisma.location.update({
        where: { id: locationId },
        data: {
          name: dto.name?.trim(),
          description: dto.description?.trim() ?? undefined,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('A location with this name already exists in this campaign');
      }
      throw e;
    }
  }

  async remove(locationId: string, userId: string) {
    const loc = await this.getWithOwner(locationId);
    if (loc.campaign.userId !== userId) throw new ForbiddenException('Not permitted');
    await this.prisma.location.delete({ where: { id: locationId } });
    return { ok: true };
  }
}
