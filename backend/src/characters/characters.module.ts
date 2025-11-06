import { Module } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { CharactersController } from './characters.controller';
import { CharactersService } from './characters.service';

@Module({
  providers: [PrismaService, CharactersService],
  controllers: [CharactersController],
  exports: [CharactersService],
})
export class CharactersModule {}
