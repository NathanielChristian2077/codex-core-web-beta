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
import { CampaignsService } from './campaigns.service';

@UseGuards(AuthGuard)
@Controller('campaigns')
export class CampaignsController {
  constructor(private readonly svc: CampaignsService) {}

  @Get()
  listMine(@Req() req: any) {
    const userId: string = req.user?.sub;
    return this.svc.listMine(userId);
  }

  @Get(':id')
  getOne(@Param('id', new ParseUUIDPipe()) id: string, @Req() req: any) {
    const userId: string = req.user?.sub;
    return this.svc.getOne(id, userId);
  }

  @Post()
  create(@Body() dto: { name: string; description?: string | null }, @Req() req: any) {
    const userId: string = req.user?.sub;
    return this.svc.create(userId, dto);
  }

  @Put(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: { name?: string; description?: string | null },
    @Req() req: any,
  ) {
    const userId: string = req.user?.sub;
    return this.svc.update(id, userId, dto);
  }

  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string, @Req() req: any) {
    const userId: string = req.user?.sub;
    return this.svc.remove(id, userId);
  }
}
