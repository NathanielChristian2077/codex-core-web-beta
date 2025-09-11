import { Controller, Get, Param, Query } from "@nestjs/common";
import { GrafoService } from "./grafo.service";

@Controller('campanhas/:id/grafo')
export class GrafoController {
    constructor(private svc: GrafoService) {}
    @Get()
    view(@Param('id') campanhaId: string, @Query('expand') expand?: string) {
        return this.svc.view(campanhaId, expand);
    }
}