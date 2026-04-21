import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("admin123", 12);
  await prisma.user.upsert({
    where: { email: "admin@campusbook.local" },
    update: {
      passwordHash,
      role: UserRole.ADMIN,
      name: "系统管理员",
      major: "教务",
      grade: "—",
    },
    create: {
      name: "系统管理员",
      email: "admin@campusbook.local",
      passwordHash,
      role: UserRole.ADMIN,
      major: "教务",
      grade: "—",
    },
  });
  console.log("Seeded admin: admin@campusbook.local / admin123");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
