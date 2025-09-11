import { Module } from "@nestjs/common";
import { AuthModule } from './auth/auth.module';
import { CampanhasModule } from './campanhas/campanhas.module';
import { EventosModule } from './eventos/eventos.module';
import { PersonagensModule } from "./personagens/personagens.module";
import { LocaisModule } from "./locais/locais.module";
import { ObjetosModule } from "./objetos/objetos.module";
import { RelacoesModule } from "./relacoes/relacoes.module";
import { GrafoModule } from "./grafo/grafo.module";

@Module({
    imports: [AuthModule, CampanhasModule, EventosModule, PersonagensModule, LocaisModule, ObjetosModule, RelacoesModule, GrafoModule],
})
export class AppModule {}