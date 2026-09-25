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
  await prisma.portfolioSetting.upsert({
    where: { key: "dashboardMetadataTitle" },
    update: { value: `${process.env.ADMIN_NAME} portfolio dashboard` },
    create: { key: "dashboardMetadataTitle", value: `${process.env.ADMIN_NAME} portfolio dashboard` }
  });
  await prisma.portfolioSetting.upsert({
    where: { key: "dashboardMetadataDescription" },
    update: { value: `Portfolio management dashboard of ${process.env.ADMIN_NAME}.` },
    create: { key: "dashboardMetadataDescription", value: `Portfolio management dashboard of ${process.env.ADMIN_NAME}.` }
  });

  console.log(`Portfolio seed complete for: ${email}`);
}

main().finally(() =>
  prisma.$disconnect()
);
