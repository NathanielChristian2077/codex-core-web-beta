import { Injectable } from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";
import { NodoTipo } from "@prisma/client";

@Injectable()
export class GrafoService {
    constructor (private prisma: PrismaService) {}
    
    async view(campanhaId: string, expand?: string) {
        let central: { tipo: NodoTipo, id: string } | null = null;
        if (expand) {
            const [prefix, id] = expand.split(':');
            const mapa: Record<string, NodoTipo> = { e: 'EVENTO', p: 'PERSONAGEM', l: 'LOCAL', o: 'OBJETO' };
            central = { tipo: mapa[prefix], id } as any;
        } else {
            const ev = await this.prisma.evento.findFirst({ where: { campanhaId }, orderBy: { createdAt: 'asc' } });
            if (ev) {
                central = { tipo: 'EVENTO', id: ev.id };
            }
        }
        
        if (!central) return { nodes: [], edges: [] };

        const rels = await this.prisma.relacao.findMany({
            where: {
                OR: [
                    { origemTipo: central.tipo, origemId: central.id },
                    { destinoTipo: central.tipo, destinoId: central.id }
                ]
            }
        });

        const nodeSet = new Map<string, { id: string; tipo: NodoTipo; label: string }>();

        async function addNode(tipo: NodoTipo, id: string, prisma: PrismaService) {
            if (nodeSet.has(`${tipo}:${id}`)) return;
            let label = id.slice(0, 6);
            if (tipo === 'EVENTO') { label = (await prisma.evento.findUnique({ where: { id } }))?.titulo ?? label; } 
            if (tipo === 'PERSONAGEM') { label = (await prisma.personagem.findUnique({ where: { id } }))?.nome ?? label; } 
            if (tipo === 'LOCAL') { label = (await prisma.local.findUnique({ where: { id } }))?.nome ?? label; }
            if (tipo === 'OBJETO') { label = (await prisma.objeto.findUnique({ where: { id } }))?.nome ?? label; }
            nodeSet.set(`${tipo}:${id}`, { id, tipo, label });
        }

        await addNode(central.tipo, central.id, this.prisma);
        for (const r of rels) {
            await addNode(r.origemTipo, r.origemId, this.prisma);
            await addNode(r.destinoTipo, r.destinoId, this.prisma);
        }

        return {
            nodes: Array.from(nodeSet.values()),
            edges: rels.map(r => ({ from: `${r.origemTipo}:${r.origemId}`, to: `${r.destinoTipo}:${r.destinoId}`, tipo: r.tipo }))
        };
    }
}