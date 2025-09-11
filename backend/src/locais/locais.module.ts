import { Module } from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";
import { LocaisController } from "./locais.controller";
import { LocaisService } from "./locais.service";
import { AuthModule } from "../auth/auth.module";

@Module({
    imports: [AuthModule],
    controllers: [LocaisController],
    providers: [PrismaService, LocaisService] })
export class LocaisModule {}