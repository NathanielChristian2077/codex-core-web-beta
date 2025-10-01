import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module"; // para ter JwtService
import { PrismaService } from "../common/prisma.service";
import { EventosController } from "./eventos.controller";
import { EventosService } from "./eventos.service";

@Module({
  imports: [AuthModule],
  controllers: [EventosController],
  providers: [PrismaService, EventosService],
})
export class EventosModule {}
