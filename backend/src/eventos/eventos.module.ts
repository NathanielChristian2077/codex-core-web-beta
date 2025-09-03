import { Module } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { EventosController } from './eventos.controller';

@Module({ controllers: [EventosController], providers: [PrismaService] })
export class EventosModule {}
