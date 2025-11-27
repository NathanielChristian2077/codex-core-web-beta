import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { GraphService } from './graph.service';

type AuthedRequest = {
  user?: {
    id: string;
    email: string;
    role?: string | null;
    name?: string | null;
    avatarUrl?: string | null;
  };
};

@UseGuards(AuthGuard)
@Controller('campaigns/:campaignId/graph')
export class GraphController {
  constructor(private readonly svc: GraphService) {}

  private getUserId(req: AuthedRequest): string {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }
    return userId;
  }

  @Get()
  getGraph(
    @Param('campaignId', new ParseUUIDPipe()) campaignId: string,
    @Req() req: AuthedRequest,
  ) {
    const userId = this.getUserId(req);
    return this.svc.campaignGraph(campaignId, userId);
  }

  @Post('resync-links')
  resyncLinks(
    @Param('campaignId', new ParseUUIDPipe()) campaignId: string,
    @Req() req: AuthedRequest,
  ) {
    const userId = this.getUserId(req);
    return this.svc.resyncCampaignLinks(campaignId, userId);
  }
}
