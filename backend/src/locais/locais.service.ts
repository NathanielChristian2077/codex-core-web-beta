import { Injectable, ForbiddenException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";

@Injectable()
export class LocaisService {
    constructor(private prisma: PrismaService) {}

    async assertOwner(campanhaId: string, userId: string) {
        const c = await this.prisma.campanha.findUnique({ where: { id: campanhaId } });
        if(!c) throw new NotFoundException('Campaign not found');
        if(c.usuarioId !== userId) throw new ForbiddenException('Not permitted');
    }

    list(campanhaId: string) {
        return this.prisma.local.findMany({ where: { campanhaId }, orderBy: { nome: 'asc' } });
    }

    async create(campanhaId: string, userId: string, data: { nome: string; descricao?: string }) {
        const p = await this.assertOwner(campanhaId, userId);
        return this.prisma.local.create({ data: { campanhaId, nome: data.nome, descricao: data.descricao } });
    }

    async remove(id: string, userId: string) {
        const p = await this.prisma.local.findUnique({ where: { id }, include: { campanha: true } });
        if(!p) throw new NotFoundException('Character not found');
        if(p.campanha.usuarioId !== userId) throw new ForbiddenException('Not permitted');
        return { ok: true };
    }
}