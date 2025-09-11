import { Module } from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";
import { RelacoesController } from "./relacoes.controller";
import { RelacoesService } from "./relacoes.service";
import { AuthModule } from "../auth/auth.module";

@Module({ 
    imports: [AuthModule],
    controllers: [RelacoesController],
    providers: [PrismaService, RelacoesService] })
export class RelacoesModule {}