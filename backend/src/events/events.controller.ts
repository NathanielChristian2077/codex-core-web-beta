import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { EventsService } from './events.service';

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
@Controller()
export class EventsController {
  constructor(private readonly svc: EventsService) {}

  private getUserId(req: AuthedRequest): string {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }
    return userId;
  }

  @Get('campaigns/:campaignId/events')
  listByCampaign(
    @Param('campaignId', new ParseUUIDPipe()) campaignId: string,
    @Req() req: AuthedRequest,
  ) {
    const userId = this.getUserId(req);
    return this.svc.listByCampaign(campaignId, userId);
  }

  @Post('campaigns/:campaignId/events')
  create(
    @Param('campaignId', new ParseUUIDPipe()) campaignId: string,
    @Body() dto: { title: string; description?: string },
    @Req() req: AuthedRequest,
  ) {
    const userId = this.getUserId(req);
    return this.svc.create(campaignId, userId, dto);
  }

  @Get('events/:id')
  getOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req: AuthedRequest,
  ) {
    const userId = this.getUserId(req);
    return this.svc.getOne(id, userId);
  }

  @Put('events/:id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: { title?: string; description?: string },
    @Req() req: AuthedRequest,
  ) {
    const userId = this.getUserId(req);
    return this.svc.update(id, userId, dto);
  }

  @Delete('events/:id')
  remove(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req: AuthedRequest,
  ) {
    const userId = this.getUserId(req);
    return this.svc.remove(id, userId);
  }
}
