import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { NodoTipo, Prisma, RelTipo } from "@prisma/client";
import { PrismaService } from "../common/prisma.service";

type NodeRef = { tipo: NodoTipo; id: string };

@Injectable()
export class RelacoesService {
  constructor(private prisma: PrismaService) {}

  private async getCampanhaId(ref: NodeRef): Promise<string> {
    switch (ref.tipo) {
      case "EVENTO":
        return (
          (await this.prisma.evento.findUnique({ where: { id: ref.id } }))
            ?.campanhaId ?? ""
        );
      case "PERSONAGEM":
        return (
          (await this.prisma.personagem.findUnique({ where: { id: ref.id } }))
            ?.campanhaId ?? ""
        );
      case "LOCAL":
        return (
          (await this.prisma.local.findUnique({ where: { id: ref.id } }))
            ?.campanhaId ?? ""
        );
      case "OBJETO":
        return (
          (await this.prisma.objeto.findUnique({ where: { id: ref.id } }))
            ?.campanhaId ?? ""
        );
    }
  }

  async create(
    userId: string,
    origem: NodeRef,
    destino: NodeRef,
    tipo: RelTipo
  ) {
    if (origem.id === destino.id && origem.tipo === destino.tipo) {
      throw new BadRequestException(
        "It's not possible to create a self-relationship"
      );
    }

    const [campO, campD] = await Promise.all([
      this.getCampanhaId(origem),
      this.getCampanhaId(destino),
    ]);
    if (!campO || !campD)
      throw new NotFoundException("Origin or destination not found");
    if (campO !== campD)
      throw new BadRequestException(
        "Different campaign nodes can not be related"
      );

    const camp = await this.prisma.campanha.findUnique({
      where: { id: campO },
    });
    if (!camp || camp.usuarioId !== userId)
      throw new ForbiddenException("Not permitted");

    try {
      return this.prisma.relacao.create({
        data: {
          origemTipo: origem.tipo,
          origemId: origem.id,
          destinoTipo: destino.tipo,
          destinoId: destino.id,
          tipo,
        },
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2002"
      ) {
        const existing = await this.prisma.relacao.findFirst({
          where: {
            origemTipo: origem.tipo,
            origemId: origem.id,
            destinoTipo: destino.tipo,
            destinoId: destino.id,
            tipo,
          },
        });
        if (existing) return existing;
        throw new ConflictException("Relation already exists.");
      }
      throw e;
    }
  }

  async listByNode(node: NodeRef) {
    return this.prisma.relacao.findMany({
      where: {
        OR: [
          { origemTipo: node.tipo, origemId: node.id },
          { destinoTipo: node.tipo, destinoId: node.id },
        ],
      },
      orderBy: { createdAt: "asc" },
    });
  }

  async remove(origem: NodeRef, destino: NodeRef, tipo: RelTipo) {
    const rel = await this.prisma.relacao.findFirst({
      where: {
        origemTipo: origem.tipo,
        origemId: origem.id,
        destinoTipo: destino.tipo,
        destinoId: destino.id,
        tipo,
      },
    });
    if (!rel) throw new NotFoundException("Relation not found.");
    await this.prisma.relacao.delete({ where: { id: rel.id } });
    return { ok: true };
  }
}
