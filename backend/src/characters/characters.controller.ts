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
import {
  CharactersService,
  CreateCharacterDto,
  UpdateCharacterDto,
} from './characters.service';

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
export class CharactersController {
  constructor(private readonly svc: CharactersService) {}

  private getUserId(req: AuthedRequest): string {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }
    return userId;
  }

  @Get('campaigns/:campaignId/characters')
  listByCampaign(
    @Param('campaignId', new ParseUUIDPipe()) campaignId: string,
    @Req() req: AuthedRequest,
  ) {
    const userId = this.getUserId(req);
    return this.svc.listByCampaign(campaignId, userId);
  }

  @Post('campaigns/:campaignId/characters')
  create(
    @Param('campaignId', new ParseUUIDPipe()) campaignId: string,
    @Body() dto: CreateCharacterDto,
    @Req() req: AuthedRequest,
  ) {
    const userId = this.getUserId(req);
    return this.svc.create(campaignId, userId, dto);
  }

  @Get('characters/:id')
  getOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req: AuthedRequest,
  ) {
    const userId = this.getUserId(req);
    return this.svc.getOne(id, userId);
  }

  @Put('characters/:id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateCharacterDto,
    @Req() req: AuthedRequest,
  ) {
    const userId = this.getUserId(req);
    return this.svc.update(id, userId, dto);
  }

  @Delete('characters/:id')
  remove(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req: AuthedRequest,
  ) {
    const userId = this.getUserId(req);
    return this.svc.remove(id, userId);
  }
}
