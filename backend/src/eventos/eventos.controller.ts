import { Body, Controller, Param, Post } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Controller('campanhas/:id/eventos')
export class EventosController {
  constructor(private prisma: PrismaService) {}
  @Post()
  create(@Param('id') campanhaId: string, @Body() dto: { titulo: string; descricao?: string; ocorridoEm?: string }) {
    return this.prisma.evento.create({
      data: { campanhaId, titulo: dto.titulo, descricao: dto.descricao, ocorridoEm: dto.ocorridoEm ? new Date(dto.ocorridoEm) : null }
    });
  }
}
