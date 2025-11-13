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
import { CharactersService, CreateCharacterDto, UpdateCharacterDto } from './characters.service';

@UseGuards(AuthGuard)
@Controller()
export class CharactersController {
  constructor(private readonly svc: CharactersService) {}

  @Get('campaigns/:campaignId/characters')
  listByCampaign(
    @Param('campaignId', new ParseUUIDPipe()) campaignId: string,
    @Req() req: any,
  ) {
    return this.svc.listByCampaign(campaignId, req.user?.sub);
  }

  @Post('campaigns/:campaignId/characters')
  create(
    @Param('campaignId', new ParseUUIDPipe()) campaignId: string,
    @Body() dto: CreateCharacterDto,
    @Req() req: any,
  ) {
    return this.svc.create(campaignId, req.user?.sub, dto);
  }

  @Get('characters/:id')
  getOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req: any,
  ) {
    return this.svc.getOne(id, req.user?.sub);
  }

  @Put('characters/:id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateCharacterDto,
    @Req() req: any,
  ) {
    return this.svc.update(id, req.user?.sub, dto);
  }

  @Delete('characters/:id')
  remove(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req: any,
  ) {
    return this.svc.remove(id, req.user?.sub);
  }
}