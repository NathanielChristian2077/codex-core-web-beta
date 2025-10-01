import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaService } from '../common/prisma.service';
import { CampanhasController } from './campanhas.controller';
import { CampanhasService } from './campanhas.service';

@Module({
  imports: [AuthModule],
  controllers: [CampanhasController],
  providers: [PrismaService, CampanhasService],
  exports: [CampanhasService],
})
export class CampanhasModule {}
