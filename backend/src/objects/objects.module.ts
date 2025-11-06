import { Module } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { ObjectsController } from './objects.controller';
import { ObjectsService } from './objects.service';

@Module({
  providers: [PrismaService, ObjectsService],
  controllers: [ObjectsController],
  exports: [ObjectsService],
})
export class ObjectsModule {}
