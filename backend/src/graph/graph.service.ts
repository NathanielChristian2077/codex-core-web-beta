import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { NodeType, RelationType } from '@prisma/client';
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

    private readonly LINK_REGEX = /<<([ECLO]):([^>]+)>>/g;
  private readonly TYPE_MAP: Record<'E' | 'C' | 'L' | 'O', NodeType> = {
    E: NodeType.EVENT,
    C: NodeType.CHARACTER,
    L: NodeType.LOCATION,
    O: NodeType.OBJECT,
  };

  private extractTokens(description: string) {
    const tokens: { type: 'E' | 'C' | 'L' | 'O'; name: string }[] = [];
    let match: RegExpExecArray | null;
    this.LINK_REGEX.lastIndex = 0;

    while ((match = this.LINK_REGEX.exec(description)) !== null) {
      const [, t, raw] = match;
      const type = t as 'E' | 'C' | 'L' | 'O';
      const name = raw.trim();
      if (!name) continue;
      tokens.push({ type, name });
    }

    return tokens;
  }

  private async rebuildLinksForEntity(
    fromType: NodeType,
    entity: { id: string; campaignId: string; description: string | null }
  ) {
    const desc = entity.description ?? '';

    await this.prisma.relation.deleteMany({
      where: {
        fromType,
        fromId: entity.id,
        kind: RelationType.LINK,
      },
    });

    if (!desc) return;

    const tokens = this.extractTokens(desc);
    if (!tokens.length) return;

    const byType = { E: [] as string[], C: [] as string[], L: [] as string[], O: [] as string[] };
    for (const t of tokens) byType[t.type].push(t.name);

    const [events, chars, locs, objs] = await Promise.all([
      byType.E.length
        ? this.prisma.event.findMany({
            where: { campaignId: entity.campaignId, title: { in: byType.E } },
          })
        : [],
      byType.C.length
        ? this.prisma.character.findMany({
            where: { campaignId: entity.campaignId, name: { in: byType.C } },
          })
        : [],
      byType.L.length
        ? this.prisma.location.findMany({
            where: { campaignId: entity.campaignId, name: { in: byType.L } },
          })
        : [],
      byType.O.length
        ? this.prisma.objectModel.findMany({
            where: { campaignId: entity.campaignId, name: { in: byType.O } },
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
          fromType,
          fromId: entity.id,
          toType: this.TYPE_MAP[t.type],
          toId,
          kind: RelationType.LINK,
          campaignId: entity.campaignId, // se tiver esse campo no model
        };
      })
      .filter(Boolean) as any[];

    if (data.length) {
      await this.prisma.relation.createMany({
        data,
        skipDuplicates: true,
      });
    }
  }

  async resyncCampaignLinks(campaignId: string, userId: string) {
    const camp = await this.prisma.campaign.findUnique({
      where: { id: campaignId },
      select: { id: true, userId: true },
    });
    if (!camp) throw new NotFoundException('Campaign not found');
    if (camp.userId !== userId) throw new ForbiddenException('Not permitted');

    const [events, characters, locations, objects] = await Promise.all([
      this.prisma.event.findMany({
        where: { campaignId },
        select: { id: true, campaignId: true, description: true },
      }),
      this.prisma.character.findMany({
        where: { campaignId },
        select: { id: true, campaignId: true, description: true },
      }),
      this.prisma.location.findMany({
        where: { campaignId },
        select: { id: true, campaignId: true, description: true },
      }),
      this.prisma.objectModel.findMany({
        where: { campaignId },
        select: { id: true, campaignId: true, description: true },
      }),
    ]);

    await this.prisma.relation.deleteMany({
      where: {
        kind: RelationType.LINK,
      },
    });

    for (const ev of events) {
      await this.rebuildLinksForEntity(NodeType.EVENT, ev);
    }
    for (const ch of characters) {
      await this.rebuildLinksForEntity(NodeType.CHARACTER, ch);
    }
    for (const loc of locations) {
      await this.rebuildLinksForEntity(NodeType.LOCATION, loc);
    }
    for (const obj of objects) {
      await this.rebuildLinksForEntity(NodeType.OBJECT, obj);
    }

    return { ok: true };
  }
}
