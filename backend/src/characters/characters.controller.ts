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

  // GET /campaigns/:campaignId/characters
  @Get('campaigns/:campaignId/characters')
  listByCampaign(
    @Param('campaignId', new ParseUUIDPipe()) campaignId: string,
    @Req() req: any,
  ) {
    const userId: string = req.user?.sub;
    return this.svc.listByCampaign(campaignId, userId);
  }

  // POST /campaigns/:campaignId/characters
  @Post('campaigns/:campaignId/characters')
  create(
    @Param('campaignId', new ParseUUIDPipe()) campaignId: string,
    @Body() dto: CreateCharacterDto,
    @Req() req: any,
  ) {
    const userId: string = req.user?.sub;
    return this.svc.create(campaignId, userId, dto);
  }

  // GET /characters/:id
  @Get('characters/:id')
  getOne(@Param('id', new ParseUUIDPipe()) id: string, @Req() req: any) {
    const userId: string = req.user?.sub;
    return this.svc.getOne(id, userId);
  }

  // PUT /characters/:id
  @Put('characters/:id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateCharacterDto,
    @Req() req: any,
  ) {
    const userId: string = req.user?.sub;
    return this.svc.update(id, userId, dto);
  }

  // DELETE /characters/:id
  @Delete('characters/:id')
  remove(@Param('id', new ParseUUIDPipe()) id: string, @Req() req: any) {
    const userId: string = req.user?.sub;
    return this.svc.remove(id, userId);
  }
}
