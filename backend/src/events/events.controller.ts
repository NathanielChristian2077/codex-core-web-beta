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
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { EventsService } from './events.service';

@UseGuards(AuthGuard)
@Controller()
export class EventsController {
  constructor(private readonly svc: EventsService) {}

  // GET /campaigns/:campaignId/events
  @Get('campaigns/:campaignId/events')
  listByCampaign(
    @Param('campaignId', new ParseUUIDPipe()) campaignId: string,
    @Req() req: any,
  ) {
    const userId: string = req.user?.sub;
    return this.svc.listByCampaign(campaignId, userId);
  }

  // POST /campaigns/:campaignId/events
  @Post('campaigns/:campaignId/events')
  create(
    @Param('campaignId', new ParseUUIDPipe()) campaignId: string,
    @Body() dto: { title: string; description?: string; occurredAt?: string },
    @Req() req: any,
  ) {
    const userId: string = req.user?.sub;
    return this.svc.create(campaignId, userId, dto);
  }

  // GET /events/:id
  @Get('events/:id')
  getOne(@Param('id', new ParseUUIDPipe()) id: string, @Req() req: any) {
    const userId: string = req.user?.sub;
    return this.svc.getOne(id, userId);
  }

  // PUT /events/:id
  @Put('events/:id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: { title?: string; description?: string; occurredAt?: string },
    @Req() req: any,
  ) {
    const userId: string = req.user?.sub;
    return this.svc.update(id, userId, dto);
  }

  // DELETE /events/:id
  @Delete('events/:id')
  remove(@Param('id', new ParseUUIDPipe()) id: string, @Req() req: any) {
    const userId: string = req.user?.sub;
    return this.svc.remove(id, userId);
  }
}
