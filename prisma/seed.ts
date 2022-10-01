import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.table.deleteMany();
  await prisma.userProfile.deleteMany();
  await prisma.player.deleteMany();

  await prisma.userProfile.createMany({
    data: [
      {
        id: 'U_1',
        name: 'John',
        email: 'john@gmail.com',
      },
      {
        id: 'U_2',
        name: 'Bob',
        email: 'bob@gmail.com',
      },
    ],
  });

  await prisma.table.create({
    data: {
      id: 'T_1',
      name: 'First Table',
      players: {
        create: [
          { userId: 'U_1', role: 'ADMIN' },
          { userId: 'U_2', role: 'PLAYER' },
        ],
      },
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
