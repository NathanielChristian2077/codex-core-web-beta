import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../common/prisma.service";

type CreateCampaignDto = { name: string; description?: string | null };
type UpdateCampaignDto = Partial<CreateCampaignDto>;

@Injectable()
export class CampaignsService {
  constructor(private readonly prisma: PrismaService) {}

  async listMine(userId: string) {
    return this.prisma.campaign.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        description: true,
        _count: { select: { events: true } },
      },
      orderBy: { name: "asc" },
    });
  }

  async getOne(id: string, userId: string) {
    const c = await this.prisma.campaign.findUnique({
      where: { id },
      select: { id: true, name: true, description: true, userId: true },
    });
    if (!c) throw new NotFoundException("Campaign not found");
    if (c.userId !== userId) throw new ForbiddenException("Not permitted");
    const { userId: _u, ...rest } = c;
    return rest;
  }

  async create(userId: string, dto: CreateCampaignDto) {
    if (!dto?.name || !dto.name.trim())
      throw new BadRequestException("Name is required");
    try {
      return await this.prisma.campaign.create({
        data: {
          userId,
          name: dto.name.trim(),
          description:
            dto.description !== undefined
              ? dto.description?.trim() || null
              : undefined,
        },
        select: { id: true, name: true, description: true },
      });
    } catch (e: any) {
      // no unique on name by design, but leaving pattern for consistency
      if (
        e instanceof (Prisma as any).PrismaClientKnownRequestError &&
        e.code === "P2002"
      ) {
        throw new ConflictException("A campaign with this name already exists");
      }
      throw e;
    }
  }

  async update(id: string, userId: string, dto: UpdateCampaignDto) {
    const c = await this.prisma.campaign.findUnique({
      where: { id },
      select: { userId: true },
    });
    if (!c) throw new NotFoundException("Campaign not found");
    if (c.userId !== userId) throw new ForbiddenException("Not permitted");

    if (dto.name !== undefined && !dto.name.trim()) {
      throw new BadRequestException("Name cannot be empty");
    }

    try {
      return await this.prisma.campaign.update({
        where: { id },
        data: {
          name: dto.name?.trim(),
          description:
            dto.description !== undefined
              ? dto.description?.trim() || null
              : undefined,
        },
        select: { id: true, name: true, description: true },
      });
    } catch (e: any) {
      if (
        e instanceof (Prisma as any).PrismaClientKnownRequestError &&
        e.code === "P2002"
      ) {
        throw new ConflictException("A campaign with this name already exists");
      }
      throw e;
    }
  }

  async remove(id: string, userId: string) {
    const c = await this.prisma.campaign.findUnique({
      where: { id },
      select: { userId: true },
    });
    if (!c) throw new NotFoundException("Campaign not found");
    if (c.userId !== userId) throw new ForbiddenException("Not permitted");
    await this.prisma.campaign.delete({ where: { id } });
    return { ok: true };
  }
}
