import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

async function main() {
  const senhaHash = await bcrypt.hash("123456", 10);

  const user = await prisma.usuario.upsert({
    where: { email: "mestre@ex.com" },
    update: {},
    create: { nome: "Mestre", email: "mestre@ex.com", senhaHash, papel: "MESTRE" },
  });

  const camp = await prisma.campanha.upsert({
    where: { id: "00000000-0000-0000-0000-000000000001" },
    update: {},
    create: { id: "00000000-0000-0000-0000-000000000001", nome: "Campanha Demo", usuarioId: user.id },
  });

  const ev0 = await prisma.evento.upsert({
    where: { campanhaId_titulo: { campanhaId: camp.id, titulo: "Evento 0" } },
    update: {},
    create: { campanhaId: camp.id, titulo: "Evento 0", descricao: "Inicio" },
  });

  await prisma.evento.upsert({
    where: { campanhaId_titulo: { campanhaId: camp.id, titulo: "Evento 1" } },
    update: {},
    create: { campanhaId: camp.id, titulo: "Evento 1", descricao: "A Porta" },
  });

  const p1 = await prisma.personagem.upsert({
    where: { campanhaId_nome: { campanhaId: camp.id, nome: "Aria" } },
    update: {},
    create: { campanhaId: camp.id, nome: "Aria", descricao: "Barda ruim, fighter boa" },
  });

  const l1 = await prisma.local.upsert({
    where: { campanhaId_nome: { campanhaId: camp.id, nome: "Taverna do Corvo" } },
    update: {},
    create: { campanhaId: camp.id, nome: "Taverna do Corvo", descricao: '"Alguém falou em pi-po-ca?"' },
  });

  const o1 = await prisma.objeto.upsert({
    where: { campanhaId_nome: { campanhaId: camp.id, nome: "Anel de Prata" } },
    update: {},
    create: { campanhaId: camp.id, nome: "Anel de Prata", descricao: "Anel... de prata" },
  });

  await prisma.relacao.createMany({
    data: [
      { origemTipo: "PERSONAGEM", origemId: p1.id, destinoTipo: "EVENTO", destinoId: ev0.id, tipo: "APARECE" },
      { origemTipo: "OBJETO", origemId: o1.id, destinoTipo: "EVENTO", destinoId: ev0.id, tipo: "APARECE" },
      { origemTipo: "EVENTO", origemId: ev0.id, destinoTipo: "LOCAL", destinoId: l1.id, tipo: "OCORRE_EM" },
    ],
    skipDuplicates: true,
  });

  console.log({ user: user.email, campaign: camp.nome });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
