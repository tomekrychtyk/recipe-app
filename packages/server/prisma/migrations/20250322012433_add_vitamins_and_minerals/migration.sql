/*
  Warnings:

  - You are about to drop the column `quantity` on the `MealIngredient` table. All the data in the column will be lost.
  - Added the required column `categoryId` to the `Ingredient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Ingredient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Meal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `amount` to the `MealIngredient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `MealIngredient` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "MealIngredient" DROP CONSTRAINT "MealIngredient_ingredientId_fkey";

-- DropForeignKey
ALTER TABLE "MealIngredient" DROP CONSTRAINT "MealIngredient_mealId_fkey";

-- DropIndex
DROP INDEX "Ingredient_name_key";

-- DropIndex
DROP INDEX "MealIngredient_mealId_ingredientId_key";

-- AlterTable
ALTER TABLE "Ingredient" ADD COLUMN     "biotin" DOUBLE PRECISION,
ADD COLUMN     "calcium" DOUBLE PRECISION,
ADD COLUMN     "categoryId" TEXT NOT NULL,
ADD COLUMN     "chromium" DOUBLE PRECISION,
ADD COLUMN     "copper" DOUBLE PRECISION,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "folate" DOUBLE PRECISION,
ADD COLUMN     "iodine" DOUBLE PRECISION,
ADD COLUMN     "iron" DOUBLE PRECISION,
ADD COLUMN     "magnesium" DOUBLE PRECISION,
ADD COLUMN     "manganese" DOUBLE PRECISION,
ADD COLUMN     "molybdenum" DOUBLE PRECISION,
ADD COLUMN     "niacin" DOUBLE PRECISION,
ADD COLUMN     "pantothenicAcid" DOUBLE PRECISION,
ADD COLUMN     "phosphorus" DOUBLE PRECISION,
ADD COLUMN     "potassium" DOUBLE PRECISION,
ADD COLUMN     "riboflavin" DOUBLE PRECISION,
ADD COLUMN     "selenium" DOUBLE PRECISION,
ADD COLUMN     "sodium" DOUBLE PRECISION,
ADD COLUMN     "thiamin" DOUBLE PRECISION,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "vitaminA" DOUBLE PRECISION,
ADD COLUMN     "vitaminB12" DOUBLE PRECISION,
ADD COLUMN     "vitaminB6" DOUBLE PRECISION,
ADD COLUMN     "vitaminC" DOUBLE PRECISION,
ADD COLUMN     "vitaminD" DOUBLE PRECISION,
ADD COLUMN     "vitaminE" DOUBLE PRECISION,
ADD COLUMN     "vitaminK" DOUBLE PRECISION,
ADD COLUMN     "zinc" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Meal" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "MealIngredient" DROP COLUMN "quantity",
ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "MealIngredient" ADD CONSTRAINT "MealIngredient_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "Meal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MealIngredient" ADD CONSTRAINT "MealIngredient_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "Ingredient"("id") ON DELETE CASCADE ON UPDATE CASCADE;
