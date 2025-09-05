import { Body, Controller, Delete, Get, Headers, Param, Post } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ObjetosService } from "./objetos.service";

@Controller()
export class ObjetosController {
    constructor(private svc: ObjetosService, private jwt: JwtService) {}
    private userId(auth?: string) {
        const t = auth?.replace('Bearer ', '') ?? '';
        const p = t ? this.jwt.decode(t) as any : null;
        return p?.sub ?? '';
    }

    @Get('campanhas/:id/objetos')
    list(@Param('id') campanhaID: string) { return this.svc.list(campanhaID); }
    
    @Post('campanhas/:id/objetos')
    create(@Param('id') campanhaId: string, @Headers('authorization') auth: string, @Body() dto: { nome: string; descricao?: string }) {
        return this.svc.create(campanhaId, this.userId(auth), dto);
    }

    @Delete('objetos/:id')
    del(@Param('id') id: string, @Headers('authorization') auth: string) {
        return this.svc.remove(id, this.userId(auth));
    }
}