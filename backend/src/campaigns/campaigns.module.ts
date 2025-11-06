import { Module } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { CampaignsController } from './campaigns.controller';
import { CampaignsService } from './campaigns.service';

@Module({
  providers: [PrismaService, CampaignsService],
  controllers: [CampaignsController],
  exports: [CampaignsService],
})
export class CampaignsModule {}
