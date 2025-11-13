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

  @Get('campaigns/:campaignId/events')
  listByCampaign(
    @Param('campaignId', new ParseUUIDPipe()) campaignId: string,
    @Req() req: any,
  ) {
    return this.svc.listByCampaign(campaignId, req.user?.sub);
  }

  @Post('campaigns/:campaignId/events')
  create(
    @Param('campaignId', new ParseUUIDPipe()) campaignId: string,
    @Body() dto: { title: string; description?: string },
    @Req() req: any,
  ) {
    return this.svc.create(campaignId, req.user?.sub, dto);
  }

  @Get('events/:id')
  getOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req: any,
  ) {
    return this.svc.getOne(id, req.user?.sub);
  }

  @Put('events/:id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: { title?: string; description?: string },
    @Req() req: any,
  ) {
    return this.svc.update(id, req.user?.sub, dto);
  }

  @Delete('events/:id')
  remove(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req: any,
  ) {
    return this.svc.remove(id, req.user?.sub);
  }
}
