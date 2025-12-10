import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';

type LoginDto = {
  email: string;
  password: string;
};

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  private setAuthCookies(res: Response, accessToken: string) {
    const secure = process.env.NODE_ENV === 'production';

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure,
    });
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, user } = await this.auth.login(
      dto.email,
      dto.password,
    );

    this.setAuthCookies(res, accessToken);

    return user;
  }

  @Post('register')
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, user } = await this.auth.register(dto);

    this.setAuthCookies(res, accessToken);

    return user;
  }

  @UseGuards(AuthGuard)
  @Get('me')
  getMe(@Req() req: Request) {
    return req.user;
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('accessToken');
    res.clearCookie('XSRF-TOKEN');
    return { success: true };
  }
}
