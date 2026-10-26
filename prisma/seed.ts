import bcrypt from "bcrypt";
import prisma from "../src/config/prisma";

const main = async () => {
  const passwordHash = await bcrypt.hash("Password123!", 10);

  await prisma.user.upsert({
    where: { email: "bailleur@test.com" },
    update: {},
    create: {
      nom: "Bailleur Test",
      email: "bailleur@test.com",
      telephone: "690000001",
      passwordHash,
      role: "BAILLEUR",
    },
  });

  await prisma.user.upsert({
    where: { email: "locataire@test.com" },
    update: {},
    create: {
      nom: "Locataire Test",
      email: "locataire@test.com",
      telephone: "690000002",
      passwordHash,
      role: "LOCATAIRE",
    },
  });

  console.log("Seed done");
};

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());