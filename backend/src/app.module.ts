import { Module } from "@nestjs/common";
import { AuthModule } from './auth/auth.module';
import { CampanhasModule } from './campanhas/campanhas.module';
import { EventosModule } from './eventos/eventos.module';

@Module({
    imports: [AuthModule, CampanhasModule, EventosModule],
})
export class AppModule {}