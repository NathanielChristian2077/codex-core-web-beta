import { Module } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { LocationsController } from './locations.controller';
import { LocationsService } from './locations.service';

@Module({
  providers: [PrismaService, LocationsService],
  controllers: [LocationsController],
  exports: [LocationsService],
})
export class LocationsModule {}
