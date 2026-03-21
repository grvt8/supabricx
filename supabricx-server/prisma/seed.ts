import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.$queryRaw`SELECT 1`;
}

main()
  .catch((err) => {
    process.stderr.write(String(err));
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
