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
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { NodeType, RelationType } from '@prisma/client';
import { AuthGuard } from '../auth/auth.guard';
import { RelationsService } from './relations.service';

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
@Controller('relations')
export class RelationsController {
  constructor(private readonly svc: RelationsService) {}

  private getUserId(req: AuthedRequest): string {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }
    return userId;
  }

  // POST /relations
  @Post()
  create(
    @Body()
    body: {
      from: { type: NodeType; id: string };
      to: { type: NodeType; id: string };
      kind: RelationType;
    },
    @Req() req: AuthedRequest,
  ) {
    const userId = this.getUserId(req);
    return this.svc.create(userId, body.from, body.to, body.kind);
  }

  // GET /relations/by-node?type=EVENT&id=uuid
  @Get('by-node')
  listByNode(
    @Query('type') type: NodeType,
    @Query('id', new ParseUUIDPipe()) id: string,
    @Req() req: AuthedRequest,
  ) {
    const userId = this.getUserId(req);
    return this.svc.listByNode(userId, { type, id });
  }

  // DELETE /relations/:id
  @Delete(':id')
  remove(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req: AuthedRequest,
  ) {
    const userId = this.getUserId(req);
    return this.svc.remove(userId, id);
  }
}
