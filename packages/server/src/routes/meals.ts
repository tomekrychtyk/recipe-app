import { Router } from "express";
import { PrismaClient, type Prisma } from "@prisma/client";
import type { Meal, MealIngredient, Ingredient } from "@prisma/client";
import { validateMeal } from "../utils/validators";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { calculateTotalNutrients } from "../utils/calculations";
import multer from "multer";
import { uploadFile } from "../services/s3";

const router = Router();
const upload = multer();
const prisma = new PrismaClient();

type MealWithIngredients = Prisma.MealGetPayload<{
  include: {
    ingredients: {
      include: {
        ingredient: true;
      };
    };
    user: true;
  };
}>;

type MealIngredientWithIngredient = Prisma.MealIngredientGetPayload<{
  include: {
    ingredient: true;
  };
}>;

router.get("/", async (req, res) => {
  try {
    const { userId, publicOnly } = req.query;

    const meals = await prisma.meal.findMany({
      where:
        publicOnly === "true"
          ? { userId: null }
          : userId
            ? { userId: userId as string }
            : undefined,
      include: {
        ingredients: {
          include: {
            ingredient: true,
          },
        },
        user: true,
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
      userId: meal.userId,
      thumbnailUrl: meal.thumbnailUrl,
      ingredients: meal.ingredients.map((ing) => ({
        ingredientId: ing.ingredientId,
        amount: ing.amount,
        ingredient: ing.ingredient,
      })),
      totalNutrients: calculateTotalNutrients(meal.ingredients),
    }));

    res.json(mealsWithNutrients);
  } catch (error) {
    console.error("Failed to fetch meals. Full error:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    if (error && typeof error === "object" && "code" in error) {
      console.error("Prisma error code:", error.code);
    }
    res.status(500).json({
      errors: ["Internal server error occurred while fetching meals"],
      details: process.env.NODE_ENV === "development" ? error : undefined,
    });
  }
});

router.post("/", validateMeal, async (req, res) => {
  try {
    const { name, description, ingredients, userId, thumbnailUrl } = req.body;

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
        userId,
        thumbnailUrl,
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
      userId: meal.userId,
      thumbnailUrl: meal.thumbnailUrl,
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

    const meal = await prisma.$transaction(
      async (
        tx: Omit<
          PrismaClient,
          | "$connect"
          | "$disconnect"
          | "$on"
          | "$transaction"
          | "$use"
          | "$extends"
        >
      ) => {
        await tx.mealIngredient.deleteMany({
          where: { mealId: id },
        });

        return tx.meal.update({
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
      }
    );

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

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }

    const url = await uploadFile(req.file.buffer, req.file.mimetype);
    res.json({ url });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ error: "Failed to upload file" });
  }
});

export default router;
