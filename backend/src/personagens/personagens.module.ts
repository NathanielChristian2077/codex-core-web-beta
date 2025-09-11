import { Module } from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";
import { PersonagensController } from './personagens.controller';
import { PersonagensService } from './personagens.service';
import { AuthModule } from "../auth/auth.module";

@Module({
    imports: [AuthModule], 
    controllers: [PersonagensController],
    providers: [PrismaService, PersonagensService] })
export class PersonagensModule {}