import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../common/prisma.service";

@Injectable()
export class EventosService {
  constructor(private readonly prisma: PrismaService) {}

  async list(campanhaId: string) {
    const camp = await this.prisma.campanha.findUnique({
      where: { id: campanhaId },
    });
    if (!camp) throw new NotFoundException("Campaign not found");

    return this.prisma.evento.findMany({
      where: { campanhaId },
      orderBy: [{ ocorridoEm: "asc" }, { createdAt: "asc" }],
    });
  }

  private parseDateOrNull(s?: string): Date | null {
    if (!s) return null;
    const d = new Date(s);
    if (Number.isNaN(d.getTime()))
      throw new BadRequestException('Invalid date in "ocorridoEm"');
    return d;
  }

  async create(
    campanhaId: string,
    usuarioId: string,
    dto: { titulo: string; descricao?: string; ocorridoEm?: string }
  ) {
    if (!dto?.titulo || dto.titulo.trim().length < 1) {
      throw new BadRequestException("Title is required");
    }

    const camp = await this.prisma.campanha.findUnique({
      where: { id: campanhaId },
    });
    if (!camp) throw new NotFoundException("Campaign not found");
    if (camp.usuarioId !== usuarioId)
      throw new ForbiddenException("You are not allowed to modify this campaign");

    try {
      return await this.prisma.evento.create({
        data: {
          campanhaId,
          titulo: dto.titulo.trim(),
          descricao: dto.descricao?.trim() ?? null,
          ocorridoEm: this.parseDateOrNull(dto.ocorridoEm),
        },
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2002"
      ) {
        throw new ConflictException(
          "An event with this title already exists in this campaign"
        );
      }
      throw e;
    }
  }

  async remove(eventoId: string, usuarioId: string) {
    const ev = await this.prisma.evento.findUnique({
      where: { id: eventoId },
      include: { campanha: { select: { usuarioId: true } } },
    });
    if (!ev) throw new NotFoundException("Event not found");
    if (ev.campanha.usuarioId !== usuarioId)
      throw new ForbiddenException("You are not allowed to delete this event");
    await this.prisma.evento.delete({ where: { id: eventoId } });
    return { ok: true };
  }
}
