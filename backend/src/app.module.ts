import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CampaignsModule } from './campaigns/campaigns.module';
import { CharactersModule } from './characters/characters.module';
import { EventsModule } from './events/events.module';
import { GraphModule } from './graph/graph.module';
import { LocationsModule } from './locations/locations.module';
import { ObjectsModule } from './objects/objects.module';
import { RelationsModule } from './relations/relations.module';

@Module({
  imports: [
    AuthModule,
    CampaignsModule,
    EventsModule,
    CharactersModule,
    LocationsModule,
    ObjectsModule,
    RelationsModule,
    GraphModule,
  ],
})
export class AppModule {}
