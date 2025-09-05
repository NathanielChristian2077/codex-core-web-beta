import { Module } from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";
import { LocaisController } from "./locais.controller";
import { LocaisService } from "./locais.service";

@Module({ controllers: [LocaisController], providers: [PrismaService, LocaisService] })
export class LocaisModule {}