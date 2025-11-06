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

  // GET /campaigns/:campaignId/locations
  @Get('campaigns/:campaignId/locations')
  listByCampaign(
    @Param('campaignId', new ParseUUIDPipe()) campaignId: string,
    @Req() req: any,
  ) {
    const userId: string = req.user?.sub;
    return this.svc.listByCampaign(campaignId, userId);
  }

  // POST /campaigns/:campaignId/locations
  @Post('campaigns/:campaignId/locations')
  create(
    @Param('campaignId', new ParseUUIDPipe()) campaignId: string,
    @Body() dto: { name: string; description?: string },
    @Req() req: any,
  ) {
    const userId: string = req.user?.sub;
    return this.svc.create(campaignId, userId, dto);
  }

  // GET /locations/:id
  @Get('locations/:id')
  getOne(@Param('id', new ParseUUIDPipe()) id: string, @Req() req: any) {
    const userId: string = req.user?.sub;
    return this.svc.getOne(id, userId);
  }

  // PUT /locations/:id
  @Put('locations/:id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: { name?: string; description?: string },
    @Req() req: any,
  ) {
    const userId: string = req.user?.sub;
    return this.svc.update(id, userId, dto);
  }

  // DELETE /locations/:id
  @Delete('locations/:id')
  remove(@Param('id', new ParseUUIDPipe()) id: string, @Req() req: any) {
    const userId: string = req.user?.sub;
    return this.svc.remove(id, userId);
  }
}
