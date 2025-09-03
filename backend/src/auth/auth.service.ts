import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";
import { JwtService } from "@nestjs/jwt";
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}
  async login(email: string, senha: string) {
    const user = await this.prisma.usuario.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Credenciais inválidas');
    const ok = await bcrypt.compare(senha, user.senhaHash);
    if (!ok) throw new UnauthorizedException('Credenciais inválidas');
    const token = await this.jwt.signAsync({ sub: user.id, papel: user.papel, email: user.email });
    return { accessToken: token };
  }
}