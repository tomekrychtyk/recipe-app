import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import type { Ingredient } from "@food-recipe-app/common";
import { validateIngredient } from "../utils/validators";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const router = Router();
const prisma = new PrismaClient();

router.get("/", async (_req, res) => {
  try {
    const ingredients = await prisma.ingredient.findMany({
      orderBy: {
        name: "asc",
      },
    });

    res.json(ingredients);
  } catch (error) {
    console.error("Failed to fetch ingredients:", error);
    res.status(500).json({
      errors: ["Internal server error occurred while fetching ingredients"],
    });
  }
});

router.post("/", validateIngredient, async (req, res) => {
  try {
    const ingredientData: Omit<Ingredient, "id"> = {
      name: req.body.name.trim(),
      categoryId: req.body.categoryId,
      proteins: Number(req.body.proteins),
      carbs: Number(req.body.carbs),
      fats: Number(req.body.fats),
      calories: Number(req.body.calories),
    };

    const existing = await prisma.ingredient.findUnique({
      where: { name: ingredientData.name },
    });

    if (existing) {
      return res.status(409).json({
        errors: ["An ingredient with this name already exists"],
      });
    }

    const ingredient = await prisma.ingredient.create({
      data: ingredientData,
    });

    res.status(201).json(ingredient);
  } catch (error) {
    console.error("Failed to create ingredient:", error);
    res.status(500).json({
      errors: ["Internal server error occurred while creating ingredient"],
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ errors: ["Invalid ingredient ID"] });
    }

    await prisma.ingredient.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Failed to delete ingredient:", error);
    res.status(500).json({
      errors: ["Internal server error occurred while deleting ingredient"],
    });
  }
});

router.put("/:id", validateIngredient, async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ errors: ["Invalid ingredient ID"] });
    }

    const ingredientData: Omit<Ingredient, "id"> = {
      name: req.body.name.trim(),
      categoryId: req.body.categoryId,
      proteins: Number(req.body.proteins),
      carbs: Number(req.body.carbs),
      fats: Number(req.body.fats),
      calories: Number(req.body.calories),
    };

    // Check if new name conflicts with existing ingredient (excluding current one)
    const existing = await prisma.ingredient.findFirst({
      where: {
        name: ingredientData.name,
        NOT: { id },
      },
    });

    if (existing) {
      return res.status(409).json({
        errors: ["An ingredient with this name already exists"],
      });
    }

    const ingredient = await prisma.ingredient.update({
      where: { id },
      data: ingredientData,
    });

    res.json(ingredient);
  } catch (error) {
    console.error("Failed to update ingredient:", error);
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      res.status(404).json({
        errors: ["Ingredient not found"],
      });
    } else {
      res.status(500).json({
        errors: ["Internal server error occurred while updating ingredient"],
      });
    }
  }
});

export default router;
