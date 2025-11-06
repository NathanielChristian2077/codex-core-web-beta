import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseUUIDPipe,
    Post,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { NodeType, RelationType } from '@prisma/client';
import { AuthGuard } from '../auth/auth.guard';
import { RelationsService } from './relations.service';

@UseGuards(AuthGuard)
@Controller('relations')
export class RelationsController {
  constructor(private readonly svc: RelationsService) {}

  // POST /relations
  @Post()
  create(
    @Body()
    body: {
      from: { type: NodeType; id: string };
      to: { type: NodeType; id: string };
      kind: RelationType;
    },
    @Req() req: any,
  ) {
    const userId: string = req.user?.sub;
    return this.svc.create(userId, body.from, body.to, body.kind);
  }

  // GET /relations/by-node?type=EVENT&id=uuid
  @Get('by-node')
  listByNode(
    @Query('type') type: NodeType,
    @Query('id', new ParseUUIDPipe()) id: string,
    @Req() req: any,
  ) {
    const userId: string = req.user?.sub;
    return this.svc.listByNode(userId, { type, id });
  }

  // DELETE /relations/:id
  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string, @Req() req: any) {
    const userId: string = req.user?.sub;
    return this.svc.remove(userId, id);
  }
}
