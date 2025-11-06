import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../common/prisma.service';

export type CreateCharacterDto = {
  name: string;
  description?: string;
};

export type UpdateCharacterDto = Partial<CreateCharacterDto>;

@Injectable()
export class CharactersService {
  constructor(private readonly prisma: PrismaService) {}

  private async assertCampaignOwnership(campaignId: string, userId: string) {
    const camp = await this.prisma.campaign.findUnique({
      where: { id: campaignId },
      select: { id: true, userId: true },
    });
    if (!camp) throw new NotFoundException('Campaign not found');
    if (camp.userId !== userId) throw new ForbiddenException('Not permitted');
  }

  private async getCharacterWithCampaignOwner(characterId: string) {
    const ch = await this.prisma.character.findUnique({
      where: { id: characterId },
      include: {
        campaign: { select: { id: true, userId: true } },
      },
    });
    if (!ch) throw new NotFoundException('Character not found');
    return ch;
  }

  async listByCampaign(campaignId: string, userId: string) {
    await this.assertCampaignOwnership(campaignId, userId);
    return this.prisma.character.findMany({
      where: { campaignId },
      orderBy: [{ name: 'asc' }],
    });
  }

  async getOne(characterId: string, userId: string) {
    const ch = await this.getCharacterWithCampaignOwner(characterId);
    if (ch.campaign.userId !== userId) throw new ForbiddenException('Not permitted');
    const { campaign, ...rest } = ch;
    return rest;
  }

  async create(campaignId: string, userId: string, dto: CreateCharacterDto) {
    await this.assertCampaignOwnership(campaignId, userId);

    if (!dto?.name || !dto.name.trim()) {
      throw new BadRequestException('Name is required');
    }

    try {
      return await this.prisma.character.create({
        data: {
          campaignId,
          name: dto.name.trim(),
          description: dto.description?.trim() || null,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('A character with this name already exists in this campaign');
      }
      throw e;
    }
  }

  async update(characterId: string, userId: string, dto: UpdateCharacterDto) {
    const ch = await this.getCharacterWithCampaignOwner(characterId);
    if (ch.campaign.userId !== userId) throw new ForbiddenException('Not permitted');

    if (dto.name !== undefined && !dto.name.trim()) {
      throw new BadRequestException('Name cannot be empty');
    }

    try {
      return await this.prisma.character.update({
        where: { id: characterId },
        data: {
          name: dto.name?.trim(),
          description: dto.description?.trim() ?? undefined,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('A character with this name already exists in this campaign');
      }
      throw e;
    }
  }

  async remove(characterId: string, userId: string) {
    const ch = await this.getCharacterWithCampaignOwner(characterId);
    if (ch.campaign.userId !== userId) throw new ForbiddenException('Not permitted');

    await this.prisma.character.delete({ where: { id: characterId } });
    return { ok: true };
  }
}
