import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import type { Meal, MealIngredient } from "@food-recipe-app/common";
import { validateMeal } from "../utils/validators";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { calculateTotalNutrients } from "../utils/calculations";

const router = Router();
const prisma = new PrismaClient();

router.get("/", async (_req, res) => {
  try {
    const meals = await prisma.meal.findMany({
      include: {
        ingredients: {
          include: {
            ingredient: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    const mealsWithNutrients = meals.map((meal) => ({
      id: meal.id,
      name: meal.name,
      categoryId: meal.categoryId,
      description: meal.description,
      ingredients: meal.ingredients.map((ing) => ({
        ingredientId: ing.ingredientId,
        amount: ing.amount,
      })),
      totalNutrients: calculateTotalNutrients(meal.ingredients),
    }));

    res.json(mealsWithNutrients);
  } catch (error) {
    console.error("Failed to fetch meals:", error);
    res.status(500).json({
      errors: ["Internal server error occurred while fetching meals"],
    });
  }
});

router.post("/", validateMeal, async (req, res) => {
  try {
    const { name, description, ingredients } = req.body;

    const ingredientIds = ingredients.map(
      (i: MealIngredient) => i.ingredientId
    );
    const existingIngredients = await prisma.ingredient.findMany({
      where: {
        id: {
          in: ingredientIds,
        },
      },
    });

    if (existingIngredients.length !== ingredientIds.length) {
      return res.status(400).json({
        errors: ["One or more ingredients do not exist"],
      });
    }

    const meal = await prisma.meal.create({
      data: {
        name: name.trim(),
        description: description?.trim(),
        categoryId: req.body.categoryId,
        ingredients: {
          create: ingredients.map((ing: MealIngredient) => ({
            amount: ing.amount,
            ingredientId: ing.ingredientId,
          })),
        },
      },
      include: {
        ingredients: {
          include: {
            ingredient: true,
          },
        },
      },
    });

    const totalNutrients = calculateTotalNutrients(meal.ingredients);

    res.status(201).json({
      id: meal.id,
      name: meal.name,
      description: meal.description,
      ingredients: meal.ingredients.map((ing) => ({
        ingredientId: ing.ingredientId,
        amount: ing.amount,
      })),
      totalNutrients,
    });
  } catch (error) {
    console.error("Failed to create meal:", error);
    res.status(500).json({
      errors: ["Internal server error occurred while creating meal"],
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ errors: ["Invalid meal ID"] });
    }

    await prisma.meal.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Failed to delete meal:", error);
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      res.status(404).json({ errors: ["Meal not found"] });
    } else {
      res.status(500).json({
        errors: ["Internal server error occurred while deleting meal"],
      });
    }
  }
});

// Update a meal
router.put("/:id", validateMeal, async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ errors: ["Invalid meal ID"] });
    }

    const { name, description, ingredients, categoryId } = req.body;

    const ingredientIds = ingredients.map(
      (i: MealIngredient) => i.ingredientId
    );
    const existingIngredients = await prisma.ingredient.findMany({
      where: {
        id: {
          in: ingredientIds,
        },
      },
    });

    if (existingIngredients.length !== ingredientIds.length) {
      return res.status(400).json({
        errors: ["One or more ingredients do not exist"],
      });
    }

    const meal = await prisma.$transaction(async (prisma) => {
      await prisma.mealIngredient.deleteMany({
        where: { mealId: id },
      });

      return prisma.meal.update({
        where: { id },
        data: {
          name: name.trim(),
          description: description?.trim(),
          categoryId,
          ingredients: {
            create: ingredients.map((ing: MealIngredient) => ({
              amount: ing.amount,
              ingredientId: ing.ingredientId,
            })),
          },
        },
        include: {
          ingredients: {
            include: {
              ingredient: true,
            },
          },
        },
      });
    });

    const totalNutrients = calculateTotalNutrients(meal.ingredients);

    res.json({
      id: meal.id,
      name: meal.name,
      description: meal.description,
      ingredients: meal.ingredients.map((ing) => ({
        ingredientId: ing.ingredientId,
        quantity: ing.amount,
      })),
      totalNutrients,
    });
  } catch (error) {
    console.error("Failed to update meal:", error);
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      res.status(404).json({ errors: ["Meal not found"] });
    } else {
      res.status(500).json({
        errors: ["Internal server error occurred while updating meal"],
      });
    }
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ errors: ["Invalid meal ID"] });
    }

    const meal = await prisma.meal.findUnique({
      where: { id },
      include: {
        ingredients: {
          include: {
            ingredient: true,
          },
        },
      },
    });

    if (!meal) {
      return res.status(404).json({ errors: ["Meal not found"] });
    }

    const totalNutrients = calculateTotalNutrients(meal.ingredients);

    res.json({
      id: meal.id,
      name: meal.name,
      description: meal.description,
      ingredients: meal.ingredients.map((ing) => ({
        ingredientId: ing.ingredientId,
        amount: ing.amount,
        ingredient: ing.ingredient,
      })),
      totalNutrients,
    });
  } catch (error) {
    console.error("Failed to fetch meal:", error);
    res.status(500).json({
      errors: ["Internal server error occurred while fetching meal"],
    });
  }
});

export default router;
