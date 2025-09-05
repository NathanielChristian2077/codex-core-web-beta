import { Module } from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";
import { PersonagensController } from './personagens.controller';
import { PersonagensService } from './personagens.service';

@Module({ controllers: [PersonagensController], providers: [PrismaService, PersonagensService] })
export class PersonagensModule {}