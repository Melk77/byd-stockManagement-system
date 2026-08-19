const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("Melkamu@27", 10);

  await prisma.user.create({
    data: {
      name: "Admin",
      username: "admin",
      email: "tamirtsega11@gmail.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("Admin created");
}

main()
  .catch((error) => {
    console.error(error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
