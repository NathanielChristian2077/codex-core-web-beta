import { Controller, Get, Param, ParseUUIDPipe, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { GraphService } from './graph.service';

@UseGuards(AuthGuard)
@Controller('campaigns/:campaignId/graph')
export class GraphController {
  constructor(private readonly svc: GraphService) {}

  @Get()
  getGraph(@Param('campaignId', new ParseUUIDPipe()) campaignId: string, @Req() req: any) {
    const userId: string = req.user?.sub;
    return this.svc.campaignGraph(campaignId, userId);
  }
}
