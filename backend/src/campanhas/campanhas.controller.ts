import { Controller, Get, Param } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Controller('campanhas')
export class CampanhasController {
  constructor(private prisma: PrismaService) {}
  @Get(':id/eventos')
  listEventos(@Param('id') id: string) {
    return this.prisma.evento.findMany({
      where: { campanhaId: id },
      orderBy: [{ ocorridoEm: 'asc' }, { createdAt: 'asc' }]
    });
  }
}
