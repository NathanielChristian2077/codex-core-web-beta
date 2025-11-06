import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../common/prisma.service';

type CreateObjectDto = { name: string; description?: string };
type UpdateObjectDto = Partial<CreateObjectDto>;

@Injectable()
export class ObjectsService {
  constructor(private readonly prisma: PrismaService) {}

  private async assertCampaignOwnership(campaignId: string, userId: string) {
    const camp = await this.prisma.campaign.findUnique({
      where: { id: campaignId },
      select: { id: true, userId: true },
    });
    if (!camp) throw new NotFoundException('Campaign not found');
    if (camp.userId !== userId) throw new ForbiddenException('Not permitted');
  }

  private async getWithOwner(objectId: string) {
    const obj = await this.prisma.objectModel.findUnique({
      where: { id: objectId },
      include: { campaign: { select: { id: true, userId: true } } },
    });
    if (!obj) throw new NotFoundException('Object not found');
    return obj;
  }

  async listByCampaign(campaignId: string, userId: string) {
    await this.assertCampaignOwnership(campaignId, userId);
    return this.prisma.objectModel.findMany({
      where: { campaignId },
      orderBy: { name: 'asc' },
    });
  }

  async getOne(objectId: string, userId: string) {
    const obj = await this.getWithOwner(objectId);
    if (obj.campaign.userId !== userId) throw new ForbiddenException('Not permitted');
    const { campaign, ...rest } = obj;
    return rest;
  }

  async create(campaignId: string, userId: string, dto: CreateObjectDto) {
    await this.assertCampaignOwnership(campaignId, userId);
    if (!dto?.name || !dto.name.trim()) throw new BadRequestException('Name is required');

    try {
      return await this.prisma.objectModel.create({
        data: {
          campaignId,
          name: dto.name.trim(),
          description: dto.description?.trim() || null,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('An object with this name already exists in this campaign');
      }
      throw e;
    }
  }

  async update(objectId: string, userId: string, dto: UpdateObjectDto) {
    const obj = await this.getWithOwner(objectId);
    if (obj.campaign.userId !== userId) throw new ForbiddenException('Not permitted');

    if (dto.name !== undefined && !dto.name.trim()) {
      throw new BadRequestException('Name cannot be empty');
    }

    try {
      return await this.prisma.objectModel.update({
        where: { id: objectId },
        data: {
          name: dto.name?.trim(),
          description: dto.description?.trim() ?? undefined,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('An object with this name already exists in this campaign');
      }
      throw e;
    }
  }

  async remove(objectId: string, userId: string) {
    const obj = await this.getWithOwner(objectId);
    if (obj.campaign.userId !== userId) throw new ForbiddenException('Not permitted');
    await this.prisma.objectModel.delete({ where: { id: objectId } });
    return { ok: true };
  }
}
