import { Module } from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";
import { ObjetosService } from "./objetos.service";
import { ObjetosController } from "./objetos.controller";

@Module({ controllers: [ObjetosController], providers: [PrismaService, ObjetosService] })
export class ObjetosModule {}