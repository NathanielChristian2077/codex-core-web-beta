import { Body, Controller, Get, Headers, Post, Query } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { RelacoesService } from "./relacoes.service";
import { NodoTipo, RelTipo } from "@prisma/client";

@Controller('relacoes')
export class RelacoesController {
    constructor(private svc: RelacoesService, private jwt: JwtService) {}
    private userId(auth?: string) {
        const t = auth?.replace('Bearer', '') ?? '';
        const p = t ? this.jwt.decode(t) as any : null;
        return p?.sub ?? '';
    }

    @Post()
    create(@Headers('authorization') auth: string, @Body() body: { origem: {
            tipo: NodoTipo;
            id: string;
        };
        destino: {
            tipo: NodoTipo;
            id: string;
        };
        tipo: RelTipo 
    }) {
        return this.svc.create(this.userId(auth), body.origem, body.destino, body.tipo);
    }

    @Get()
    list(@Query('tipo') tipo: NodoTipo, @Query('id') id: string) {
        return this.svc.listByNode({ tipo, id });
    }
}