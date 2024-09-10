import { PrismaClient } from '@prisma/client';
import typeSeed from './seed/typeSeed';

const prisma = new PrismaClient();

async function main() {
  await typeSeed();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
