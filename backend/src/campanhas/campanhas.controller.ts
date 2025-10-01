import { Controller, Get, Headers, Param } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CampanhasService } from './campanhas.service';

@Controller('campanhas')
export class CampanhasController {
  constructor(private readonly svc: CampanhasService, private readonly jwt: JwtService) {}

  private userIdFromAuth(auth?: string) {
    const token = auth?.replace('Bearer ', '') ?? '';
    const payload = token ? (this.jwt.decode(token) as any) : null;
    return payload?.sub ?? '';
  }

  @Get()
  listMine(@Headers('authorization') auth?: string) {
    const userId = this.userIdFromAuth(auth);
    return this.svc.listMine(userId);
  }

  @Get(':id/eventos')
  listEventos(@Param('id') id: string) {
    return this.svc.listEventos(id);
  }
}
