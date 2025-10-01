import { Body, Controller, Delete, Get, Headers, Param, Post } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EventosService } from './eventos.service';

@Controller()
export class EventosController {
  constructor(private readonly svc: EventosService, private readonly jwt: JwtService) {}

  private userIdFromAuth(auth?: string) {
    const token = auth?.replace('Bearer ', '') ?? '';
    const payload = token ? (this.jwt.decode(token) as any) : null;
    return payload?.sub ?? '';
  }

  @Get('campanhas/:id/eventos')
  list(@Param('id') campanhaId: string) {
    return this.svc.list(campanhaId);
  }

  @Post('campanhas/:id/eventos')
  create(
    @Param('id') campanhaId: string,
    @Headers('authorization') auth: string,
    @Body() dto: { titulo: string; descricao?: string; ocorridoEm?: string },
  ) {
    const userId = this.userIdFromAuth(auth);
    return this.svc.create(campanhaId, userId, dto);
  }

  @Delete('eventos/:eventoId')
  remove(@Param('eventoId') eventoId: string, @Headers('authorization') auth: string) {
    const userId = this.userIdFromAuth(auth);
    return this.svc.remove(eventoId, userId);
  }
}
