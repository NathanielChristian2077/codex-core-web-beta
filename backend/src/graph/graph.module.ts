import { Module } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { GraphController } from './graph.controller';
import { GraphService } from './graph.service';

@Module({
  providers: [PrismaService, GraphService],
  controllers: [GraphController],
})
export class GraphModule {}
