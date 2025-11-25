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
import { ObjectsService } from './objects.service';

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
export class ObjectsController {
  constructor(private readonly svc: ObjectsService) {}

  private getUserId(req: AuthedRequest): string {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }
    return userId;
  }

  @Get('campaigns/:campaignId/objects')
  listByCampaign(
    @Param('campaignId', new ParseUUIDPipe()) campaignId: string,
    @Req() req: AuthedRequest,
  ) {
    const userId = this.getUserId(req);
    return this.svc.listByCampaign(campaignId, userId);
  }

  @Post('campaigns/:campaignId/objects')
  create(
    @Param('campaignId', new ParseUUIDPipe()) campaignId: string,
    @Body() dto: { name: string; description?: string },
    @Req() req: AuthedRequest,
  ) {
    const userId = this.getUserId(req);
    return this.svc.create(campaignId, userId, dto);
  }

  @Get('objects/:id')
  getOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req: AuthedRequest,
  ) {
    const userId = this.getUserId(req);
    return this.svc.getOne(id, userId);
  }

  @Put('objects/:id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: { name?: string; description?: string },
    @Req() req: AuthedRequest,
  ) {
    const userId = this.getUserId(req);
    return this.svc.update(id, userId, dto);
  }

  @Delete('objects/:id')
  remove(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req: AuthedRequest,
  ) {
    const userId = this.getUserId(req);
    return this.svc.remove(id, userId);
  }
}
