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
import { ObjectsService } from './objects.service';

@UseGuards(AuthGuard)
@Controller()
export class ObjectsController {
  constructor(private readonly svc: ObjectsService) {}

  @Get('campaigns/:campaignId/objects')
  listByCampaign(
    @Param('campaignId', new ParseUUIDPipe()) campaignId: string,
    @Req() req: any,
  ) {
    return this.svc.listByCampaign(campaignId, req.user?.sub);
  }

  @Post('campaigns/:campaignId/objects')
  create(
    @Param('campaignId', new ParseUUIDPipe()) campaignId: string,
    @Body() dto: { name: string; description?: string },
    @Req() req: any,
  ) {
    return this.svc.create(campaignId, req.user?.sub, dto);
  }

  @Get('objects/:id')
  getOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req: any,
  ) {
    return this.svc.getOne(id, req.user?.sub);
  }

  @Put('objects/:id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: { name?: string; description?: string },
    @Req() req: any,
  ) {
    return this.svc.update(id, req.user?.sub, dto);
  }

  @Delete('objects/:id')
  remove(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req: any,
  ) {
    return this.svc.remove(id, req.user?.sub);
  }
}
