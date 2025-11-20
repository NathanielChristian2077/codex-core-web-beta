import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class GraphService {
  constructor(private readonly prisma: PrismaService) {}

  async campaignGraph(campaignId: string, userId: string) {
    const camp = await this.prisma.campaign.findUnique({ where: { id: campaignId } });
    if (!camp) throw new NotFoundException('Campaign not found');
    if (camp.userId !== userId) throw new ForbiddenException('Not permitted');

    const [events, characters, locations, objects] = await Promise.all([
      this.prisma.event.findMany({
        where: { campaignId },
        select: { id: true, title: true },
      }),
      this.prisma.character.findMany({
        where: { campaignId },
        select: { id: true, name: true },
      }),
      this.prisma.location.findMany({
        where: { campaignId },
        select: { id: true, name: true },
      }),
      this.prisma.objectModel.findMany({
        where: { campaignId },
        select: { id: true, name: true },
      }),
    ]);

    const eventIds = events.map(e => e.id);
    const charIds = characters.map(c => c.id);
    const locIds = locations.map(l => l.id);
    const objIds = objects.map(o => o.id);

    const allNodeIds = [...eventIds, ...charIds, ...locIds, ...objIds];

    const relations = await this.prisma.relation.findMany({
      where: {
        OR: [
          { fromId: { in: allNodeIds } },
          { toId: { in: allNodeIds } },
        ],
      },
    });

    const nodes = [
      ...events.map(e => ({ id: e.id, type: 'EVENT', label: e.title })),
      ...characters.map(c => ({ id: c.id, type: 'CHARACTER', label: c.name })),
      ...locations.map(l => ({ id: l.id, type: 'LOCATION', label: l.name })),
      ...objects.map(o => ({ id: o.id, type: 'OBJECT', label: o.name })),
    ];

    const edges = relations.map(r => ({
      id: r.id,
      from: { id: r.fromId, type: r.fromType },
      to: { id: r.toId, type: r.toType },
      kind: r.kind,
    }));

    return { nodes, edges };
  }
}
