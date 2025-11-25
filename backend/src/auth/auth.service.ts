import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../common/prisma.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid email or password');

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new UnauthorizedException('Invalid email or password');

    return user;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name ?? null,
      avatarUrl: (user as any).avatarUrl ?? null,
    };

    const accessToken = await this.jwt.signAsync(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name ?? null,
        avatarUrl: (user as any).avatarUrl ?? null,
      },
    };
  }

  async register(dto: RegisterDto) {
    const { email, password } = dto;

    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }

    const existing = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      throw new ConflictException('Email already in use');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const defaultName =
      email.includes('@') ? email.split('@')[0] : email;

    const user = await this.prisma.user.create({
      data: {
        email,
        password: passwordHash,
        role: 'GM', // default for Codex Core 1.0
        name: defaultName,
        // avatarUrl: null,
      },
    });

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name ?? null,
      avatarUrl: (user as any).avatarUrl ?? null,
    };

    const accessToken = await this.jwt.signAsync(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name ?? null,
        avatarUrl: (user as any).avatarUrl ?? null,
      },
    };
  }
}
