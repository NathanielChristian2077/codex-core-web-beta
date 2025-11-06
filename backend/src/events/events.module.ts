import { Module } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';

@Module({
  providers: [PrismaService, EventsService],
  controllers: [EventsController],
  exports: [EventsService],
})
export class EventsModule {}
