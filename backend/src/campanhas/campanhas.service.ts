import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class CampanhasService {
  constructor(private readonly prisma: PrismaService) {}

  listMine(userId: string) {
    return this.prisma.campanha.findMany({
      where: { usuarioId: userId },
      select: { id: true, nome: true, descricao: true, _count: { select: { eventos: true } } },
      orderBy: { nome: 'asc' },
    });
  }

  async getById(id: string) {
    const camp = await this.prisma.campanha.findUnique({
      where: { id },
      select: { id: true, nome: true, descricao: true, usuarioId: true },
    });
    if (!camp) throw new NotFoundException('Campaign not found');
    return camp;
  }

  async listEventos(campanhaId: string) {
    await this.getById(campanhaId);
    return this.prisma.evento.findMany({
      where: { campanhaId },
      orderBy: [{ ocorridoEm: 'asc' }, { createdAt: 'asc' }],
    });
  }
}
