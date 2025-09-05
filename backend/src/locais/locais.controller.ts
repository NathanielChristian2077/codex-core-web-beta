import { Body, Controller, Delete, Get, Headers, Param, Post } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { LocaisService } from "./locais.service";

@Controller()
export class LocaisController {
    constructor(private svc: LocaisService, private jwt: JwtService) {}
    private userId(auth?: string) {
        const t = auth?.replace('Bearer ', '') ?? '';
        const p = t ? this.jwt.decode(t) as any : null;
        return p?.sub ?? '';
    }

    @Get('campanhas/:id/locais')
    list(@Param('id') campanhaID: string) { return this.svc.list(campanhaID); }
    
    @Post('campanhas/:id/locais')
    create(@Param('id') campanhaId: string, @Headers('authorization') auth: string, @Body() dto: { nome: string; descricao?: string }) {
        return this.svc.create(campanhaId, this.userId(auth), dto);
    }

    @Delete('locais/:id')
    del(@Param('id') id: string, @Headers('authorization') auth: string) {
        return this.svc.remove(id, this.userId(auth));
    }
}