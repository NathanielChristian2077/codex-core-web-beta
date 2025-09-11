import { Module } from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";
import { GrafoController } from "./grafo.controller";
import { GrafoService } from "./grafo.service";

@Module({ controllers: [GrafoController], providers: [PrismaService, GrafoService] })
export class GrafoModule {}