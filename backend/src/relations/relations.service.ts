import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { NodeType, RelationType } from '@prisma/client';
import { PrismaService } from '../common/prisma.service';

type NodeRef = { type: NodeType; id: string };

@Injectable()
export class RelationsService {
  constructor(private readonly prisma: PrismaService) {}

  private async getCampaignId(ref: NodeRef): Promise<string | null> {
    switch (ref.type) {
      case 'EVENT':
        return (await this.prisma.event.findUnique({ where: { id: ref.id } }))?.campaignId ?? null;
      case 'CHARACTER':
        return (await this.prisma.character.findUnique({ where: { id: ref.id } }))?.campaignId ?? null;
      case 'LOCATION':
        return (await this.prisma.location.findUnique({ where: { id: ref.id } }))?.campaignId ?? null;
      case 'OBJECT':
        return (await this.prisma.objectModel.findUnique({ where: { id: ref.id } }))?.campaignId ?? null;
      default:
        return null;
    }
  }

  private async assertSameCampaignAndOwnership(a: NodeRef, b: NodeRef, userId: string) {
    const [campA, campB] = await Promise.all([this.getCampaignId(a), this.getCampaignId(b)]);
    if (!campA || !campB) throw new NotFoundException('Origin or destination not found');
    if (campA !== campB) throw new BadRequestException('Nodes belong to different campaigns');

    const camp = await this.prisma.campaign.findUnique({ where: { id: campA } });
    if (!camp) throw new NotFoundException('Campaign not found');
    if (camp.userId !== userId) throw new ForbiddenException('Not permitted');

    return camp.id;
  }

  async create(userId: string, from: NodeRef, to: NodeRef, kind: RelationType) {
    if (from.id === to.id && from.type === to.type) {
      throw new BadRequestException('Self relation is not allowed');
    }
    await this.assertSameCampaignAndOwnership(from, to, userId);

    return this.prisma.relation.create({
      data: {
        fromType: from.type,
        fromId: from.id,
        toType: to.type,
        toId: to.id,
        kind,
      },
    });
  }

  async listByNode(userId: string, node: NodeRef) {
    // validate ownership by checking the node's campaign
    const campaignId = await this.getCampaignId(node);
    if (!campaignId) throw new NotFoundException('Node not found');
    const camp = await this.prisma.campaign.findUnique({ where: { id: campaignId } });
    if (!camp) throw new NotFoundException('Campaign not found');
    if (camp.userId !== userId) throw new ForbiddenException('Not permitted');

    return this.prisma.relation.findMany({
      where: {
        OR: [
          { fromType: node.type, fromId: node.id },
          { toType: node.type, toId: node.id },
        ],
      },
    });
  }

  async remove(userId: string, relationId: string) {
    const rel = await this.prisma.relation.findUnique({ where: { id: relationId } });
    if (!rel) return { ok: true };

    // infer campaign via either side
    const node: NodeRef = { type: rel.fromType, id: rel.fromId };
    const campaignId = await this.getCampaignId(node);
    if (!campaignId) throw new NotFoundException('Campaign not found');
    const camp = await this.prisma.campaign.findUnique({ where: { id: campaignId } });
    if (!camp) throw new NotFoundException('Campaign not found');
    if (camp.userId !== userId) throw new ForbiddenException('Not permitted');

    await this.prisma.relation.delete({ where: { id: relationId } });
    return { ok: true };
  }
}
