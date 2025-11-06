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

  // GET /campaigns/:campaignId/objects
  @Get('campaigns/:campaignId/objects')
  listByCampaign(
    @Param('campaignId', new ParseUUIDPipe()) campaignId: string,
    @Req() req: any,
  ) {
    const userId: string = req.user?.sub;
    return this.svc.listByCampaign(campaignId, userId);
  }

  // POST /campaigns/:campaignId/objects
  @Post('campaigns/:campaignId/objects')
  create(
    @Param('campaignId', new ParseUUIDPipe()) campaignId: string,
    @Body() dto: { name: string; description?: string },
    @Req() req: any,
  ) {
    const userId: string = req.user?.sub;
    return this.svc.create(campaignId, userId, dto);
  }

  // GET /objects/:id
  @Get('objects/:id')
  getOne(@Param('id', new ParseUUIDPipe()) id: string, @Req() req: any) {
    const userId: string = req.user?.sub;
    return this.svc.getOne(id, userId);
  }

  // PUT /objects/:id
  @Put('objects/:id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: { name?: string; description?: string },
    @Req() req: any,
  ) {
    const userId: string = req.user?.sub;
    return this.svc.update(id, userId, dto);
  }

  // DELETE /objects/:id
  @Delete('objects/:id')
  remove(@Param('id', new ParseUUIDPipe()) id: string, @Req() req: any) {
    const userId: string = req.user?.sub;
    return this.svc.remove(id, userId);
  }
}
