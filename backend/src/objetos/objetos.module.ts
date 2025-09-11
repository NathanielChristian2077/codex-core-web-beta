import { Module } from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";
import { ObjetosService } from "./objetos.service";
import { ObjetosController } from "./objetos.controller";
import { AuthModule } from "../auth/auth.module";

@Module({
    imports: [AuthModule],
    controllers: [ObjetosController],
    providers: [PrismaService, ObjetosService] })
export class ObjetosModule {}