import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@example.com";
  const password = process.env.ADMIN_PASSWORD || "ChangeMe123!";
  const rounds = Number(process.env.BCRYPT_SALT_ROUNDS || 12);
  const passwordHash = await bcrypt.hash(password, rounds);

  await prisma.admin.upsert({
    where: { email },
    update: { name: process.env.ADMIN_NAME || "Portfolio Admin" },
    create: { email, name: process.env.ADMIN_NAME || "Portfolio Admin", passwordHash }
  });

  console.log(`Admin ready: ${email}`);
}

main().finally(() =>
  prisma.$disconnect()
);
