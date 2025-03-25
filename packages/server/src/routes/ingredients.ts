import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import type { Ingredient } from "@food-recipe-app/common";
import { validateIngredient } from "../utils/validators";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { requireAdmin } from "../middleware/auth";

const router = Router();
const prisma = new PrismaClient();

// Public routes
router.get("/", async (_req, res) => {
  try {
    const ingredients = await prisma.ingredient.findMany({
      select: {
        id: true,
        name: true,
        categoryId: true,
        // Basic nutrients
        proteins: true,
        carbs: true,
        fats: true,
        calories: true,
        // Vitamins
        vitaminA: true,
        vitaminD: true,
        vitaminE: true,
        vitaminK: true,
        vitaminC: true,
        thiamin: true,
        riboflavin: true,
        niacin: true,
        pantothenicAcid: true,
        vitaminB6: true,
        biotin: true,
        folate: true,
        vitaminB12: true,
        // Minerals
        calcium: true,
        iron: true,
        magnesium: true,
        phosphorus: true,
        potassium: true,
        sodium: true,
        zinc: true,
        copper: true,
        manganese: true,
        selenium: true,
        chromium: true,
        molybdenum: true,
        iodine: true,
        // Timestamps
        createdAt: true,
        updatedAt: true,
      },
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

router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ errors: ["Invalid ingredient ID"] });
    }

    const ingredient = await prisma.ingredient.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        categoryId: true,
        // Basic nutrients
        proteins: true,
        carbs: true,
        fats: true,
        calories: true,
        // Vitamins
        vitaminA: true,
        vitaminD: true,
        vitaminE: true,
        vitaminK: true,
        vitaminC: true,
        thiamin: true,
        riboflavin: true,
        niacin: true,
        pantothenicAcid: true,
        vitaminB6: true,
        biotin: true,
        folate: true,
        vitaminB12: true,
        // Minerals
        calcium: true,
        iron: true,
        magnesium: true,
        phosphorus: true,
        potassium: true,
        sodium: true,
        zinc: true,
        copper: true,
        manganese: true,
        selenium: true,
        chromium: true,
        molybdenum: true,
        iodine: true,
        // Timestamps
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!ingredient) {
      return res.status(404).json({ errors: ["Ingredient not found"] });
    }

    res.json(ingredient);
  } catch (error) {
    console.error("Failed to fetch ingredient:", error);
    res.status(500).json({
      errors: ["Internal server error occurred while fetching ingredient"],
    });
  }
});

// Admin-only routes
router.post("/", requireAdmin, validateIngredient, async (req, res) => {
  try {
    const { name, categoryId, ...nutrients } = req.body;

    const ingredient = await prisma.ingredient.create({
      data: {
        name: name.trim(),
        categoryId,
        ...nutrients,
      },
    });

    res.status(201).json(ingredient);
  } catch (error) {
    console.error("Failed to create ingredient:", error);
    res.status(500).json({ errors: ["Failed to create ingredient"] });
  }
});

router.delete("/:id", requireAdmin, async (req, res) => {
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

router.put("/:id", requireAdmin, validateIngredient, async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ errors: ["Invalid ingredient ID"] });
    }

    const { name, categoryId, ...nutrients } = req.body;

    // Check if new name conflicts with existing ingredient (excluding current one)
    const existing = await prisma.ingredient.findFirst({
      where: {
        name: name.trim(),
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
      data: {
        name: name.trim(),
        categoryId,
        ...nutrients,
      },
      select: {
        id: true,
        name: true,
        categoryId: true,
        // Basic nutrients
        proteins: true,
        carbs: true,
        fats: true,
        calories: true,
        // Vitamins
        vitaminA: true,
        vitaminD: true,
        vitaminE: true,
        vitaminK: true,
        vitaminC: true,
        thiamin: true,
        riboflavin: true,
        niacin: true,
        pantothenicAcid: true,
        vitaminB6: true,
        biotin: true,
        folate: true,
        vitaminB12: true,
        // Minerals
        calcium: true,
        iron: true,
        magnesium: true,
        phosphorus: true,
        potassium: true,
        sodium: true,
        zinc: true,
        copper: true,
        manganese: true,
        selenium: true,
        chromium: true,
        molybdenum: true,
        iodine: true,
        // Timestamps
        createdAt: true,
        updatedAt: true,
      },
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
