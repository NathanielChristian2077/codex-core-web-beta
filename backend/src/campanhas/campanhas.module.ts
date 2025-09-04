import { Module } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { CampanhasController } from './campanhas.controller';

@Module({ controllers: [CampanhasController], providers: [PrismaService] })
export class CampanhasModule {}
