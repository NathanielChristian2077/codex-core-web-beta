import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt';
const prisma = new PrismaClient();

async function main() {
    const senhaHash = await bcrypt.hash('123456', 10);

    const user = await prisma.usuario.upsert({
        where: { email: 'mestre@ex.com' },
        update: {},
        create: { nome: 'Mestre', email: 'mestre@ex.com', senhaHash, papel: 'MESTRE' }
    });

    const camp = await prisma.campanha.upsert({
        where: {
            id: '00000000-0000-0000-0000-000000000001',
        },
        update: {},
        create: { id: '00000000-0000-0000-0000-000000000001', nome: 'Campanha Demo', usuarioId: user.id }
    });

    await prisma.evento.createMany({
        data: [
            { campanhaId: camp.id, titulo: 'Evento 0', descricao: 'Inicio' },
            { campanhaId: camp.id, titulo: 'Evento 1', descricao: 'A Porta' }
        ],
        skipDuplicates: true
    })

    const p1 = await prisma.personagem.create({
        data: { campanhaId: camp.id, nome: 'Aria', descricao: 'Barda ruim, fighter boa' }
    })

    const l1 = await prisma.local.create({
        data: { campanhaId: camp.id, nome: 'Taverna do Corvo', descricao: '"Alguém falou em pi-po-ca?"' }
    })

    const o1 = await prisma.objeto.create({
        data: { campanhaId: camp.id, nome: 'Anel de Prata', descricao: 'Anel... de prata' }
    })

    const ev0 = await prisma.evento.findFirst({ where: { campanhaId: camp.id, titulo: 'Evento 0' } });

    if (ev0) {
        await prisma.relacao.createMany({
            data: [
                { origemTipo: 'PERSONAGEM', origemId: p1.id, destinoTipo: 'EVENTO', destinoId: ev0.id, tipo: 'APARECE' },
                { origemTipo: 'OBJETO', origemId: o1.id, destinoTipo: 'EVENTO', destinoId: ev0.id, tipo: 'APARECE' },
                { origemTipo: 'EVENTO', origemId: ev0.id, destinoTipo: 'LOCAL', destinoId: l1.id, tipo: 'OCORRE_EM' }
            ],
            skipDuplicates: true
        })
    }

    console.log({ user: user.email, campanha: camp.nome });
}

main().finally(() => prisma.$disconnect());