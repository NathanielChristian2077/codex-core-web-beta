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
import { LocationsService } from './locations.service';

@UseGuards(AuthGuard)
@Controller()
export class LocationsController {
  constructor(private readonly svc: LocationsService) {}

  @Get('campaigns/:campaignId/locations')
  listByCampaign(
    @Param('campaignId', new ParseUUIDPipe()) campaignId: string,
    @Req() req: any,
  ) {
    return this.svc.listByCampaign(campaignId, req.user?.sub);
  }

  @Post('campaigns/:campaignId/locations')
  create(
    @Param('campaignId', new ParseUUIDPipe()) campaignId: string,
    @Body() dto: { name: string; description?: string },
    @Req() req: any,
  ) {
    return this.svc.create(campaignId, req.user?.sub, dto);
  }

  @Get('locations/:id')
  getOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req: any,
  ) {
    return this.svc.getOne(id, req.user?.sub);
  }

  @Put('locations/:id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: { name?: string; description?: string },
    @Req() req: any,
  ) {
    return this.svc.update(id, req.user?.sub, dto);
  }

  @Delete('locations/:id')
  remove(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req: any,
  ) {
    return this.svc.remove(id, req.user?.sub);
  }
}