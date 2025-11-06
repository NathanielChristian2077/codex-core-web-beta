import { Module } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { RelationsController } from './relations.controller';
import { RelationsService } from './relations.service';

@Module({
  providers: [PrismaService, RelationsService],
  controllers: [RelationsController],
  exports: [RelationsService],
})
export class RelationsModule {}
