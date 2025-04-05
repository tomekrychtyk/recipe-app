-- Create planned_meals table
CREATE TABLE "planned_meals" (
  "id" SERIAL PRIMARY KEY,
  "userId" UUID NOT NULL,
  "date" DATE NOT NULL,
  "time" TIME NOT NULL,
  "name" TEXT NOT NULL,
  "mealId" INTEGER,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE,
  FOREIGN KEY ("mealId") REFERENCES "Meal"("id") ON DELETE SET NULL
);

-- Create planned_meal_ingredients table
CREATE TABLE "planned_meal_ingredients" (
  "id" SERIAL PRIMARY KEY,
  "plannedMealId" INTEGER NOT NULL,
  "ingredientId" INTEGER NOT NULL,
  "amount" DOUBLE PRECISION NOT NULL,
  FOREIGN KEY ("plannedMealId") REFERENCES "planned_meals"("id") ON DELETE CASCADE,
  FOREIGN KEY ("ingredientId") REFERENCES "Ingredient"("id") ON DELETE CASCADE
);

-- Update the prisma schema_migrations table to acknowledge this migration
INSERT INTO "_prisma_migrations" (
  "id", 
  "checksum", 
  "finished_at", 
  "migration_name", 
  "logs", 
  "rolled_back_at", 
  "started_at", 
  "applied_steps_count"
)
VALUES (
  'manual_20250327_add_meal_planner',
  '9fe0a0ea0e12c1e8c7fbaaa2e9cbfa0c9af9d2e9577f3e08a5d7c768e8e6a2a9',
  CURRENT_TIMESTAMP,
  '20250327_add_meal_planner',
  NULL,
  NULL,
  CURRENT_TIMESTAMP,
  1
); 