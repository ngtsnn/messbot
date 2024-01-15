// prisma/seed.ts

import { PrismaClient } from '@prisma/client';

const client = new PrismaClient();

const main = async () => {
  await client.$disconnect();
};

main();
