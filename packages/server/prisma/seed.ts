import { PrismaClient } from "@prisma/client";
import { seedData } from "./seed-data";

const prisma = new PrismaClient();

async function main() {
  await prisma.ingredient.deleteMany();
  await prisma.meal.deleteMany();
  await prisma.mealIngredient.deleteMany();

  for (const ingredient of seedData) {
    await prisma.ingredient.create({
      data: ingredient,
    });
  }

  console.log("Database has been seeded");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
