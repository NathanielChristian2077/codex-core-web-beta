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

    console.log({ user: user.email, campanha: camp.nome });
}

main().finally(() => prisma.$disconnect());