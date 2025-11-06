import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("123456", 10);

  const user = await prisma.user.upsert({
    where: { email: "mestre@ex.com" },
    update: {},
    create: { name: "Game Master", email: "mestre@ex.com", password, role: "GM" },
  });

  const campaign = await prisma.campaign.upsert({
    where: { id: "00000000-0000-0000-0000-000000000001" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000001",
      name: "Demo Campaign",
      userId: user.id,
    },
  });

  const ev0 = await prisma.event.upsert({
    where: { campaignId_title: { campaignId: campaign.id, title: "Event 0" } },
    update: {},
    create: { campaignId: campaign.id, title: "Event 0", description: "Beginning" },
  });

  await prisma.event.upsert({
    where: { campaignId_title: { campaignId: campaign.id, title: "Event 1" } },
    update: {},
    create: { campaignId: campaign.id, title: "Event 1", description: "The Door" },
  });

  const ch1 = await prisma.character.upsert({
    where: { campaignId_name: { campaignId: campaign.id, name: "Aria" } },
    update: {},
    create: { campaignId: campaign.id, name: "Aria", description: "Bad bard, good fighter" },
  });

  const loc1 = await prisma.location.upsert({
    where: { campaignId_name: { campaignId: campaign.id, name: "Raven Tavern" } },
    update: {},
    create: { campaignId: campaign.id, name: "Raven Tavern", description: '"Did someone say pop-corn?"' },
  });

  const obj1 = await prisma.objectModel.upsert({
    where: { campaignId_name: { campaignId: campaign.id, name: "Silver Ring" } },
    update: {},
    create: { campaignId: campaign.id, name: "Silver Ring", description: "A ring... made of silver" },
  });

  await prisma.relation.createMany({
    data: [
      { fromType: "CHARACTER", fromId: ch1.id, toType: "EVENT", toId: ev0.id, kind: "APPEARS" },
      { fromType: "OBJECT", fromId: obj1.id, toType: "EVENT", toId: ev0.id, kind: "APPEARS" },
      { fromType: "EVENT", fromId: ev0.id, toType: "LOCATION", toId: loc1.id, kind: "OCCURS_AT" },
    ],
    skipDuplicates: true,
  });

  console.log({ user: user.email, campaign: campaign.name });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
