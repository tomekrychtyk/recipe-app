import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { validateFoodDiaryEntry } from "../utils/validators";

const router = Router();
const prisma = new PrismaClient();

// Get food diary entries
router.get("/", async (req: Request, res: Response) => {
  try {
    const { userId, date } = req.query;

    if (!userId) {
      return res.status(400).json({ errors: ["User ID is required"] });
    }

    const entries = await prisma.foodDiaryEntry.findMany({
      where: {
        userId: userId as string,
        ...(date ? { date: new Date(date as string) } : {}),
      },
      include: {
        meal: {
          include: {
            ingredients: {
              include: {
                ingredient: true,
              },
            },
          },
        },
        ingredients: {
          include: {
            ingredient: true,
          },
        },
      },
      orderBy: [{ date: "desc" }, { time: "desc" }],
    });

    res.json(entries);
  } catch (error) {
    console.error("Failed to fetch food diary entries:", error);
    res.status(500).json({
      errors: [
        "Internal server error occurred while fetching food diary entries",
      ],
    });
  }
});

// Add food diary entry
router.post(
  "/",
  validateFoodDiaryEntry,
  async (req: Request, res: Response) => {
    try {
      const { date, time, name, mealId, ingredients } = req.body;

      const entry = await prisma.foodDiaryEntry.create({
        data: {
          date: new Date(date),
          time: new Date(`1970-01-01T${time}`),
          name,
          mealId,
          userId: req.body.userId,
          ingredients: {
            create: ingredients.map(
              (ing: { ingredientId: number; amount: number }) => ({
                ingredientId: ing.ingredientId,
                amount: ing.amount,
              })
            ),
          },
        },
        include: {
          meal: {
            include: {
              ingredients: {
                include: {
                  ingredient: true,
                },
              },
            },
          },
          ingredients: {
            include: {
              ingredient: true,
            },
          },
        },
      });

      res.status(201).json(entry);
    } catch (error) {
      console.error("Failed to create food diary entry:", error);
      res.status(500).json({
        errors: [
          "Internal server error occurred while creating food diary entry",
        ],
      });
    }
  }
);

// Delete food diary entry
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ errors: ["Invalid entry ID"] });
    }

    await prisma.foodDiaryEntry.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Failed to delete food diary entry:", error);
    res.status(500).json({
      errors: [
        "Internal server error occurred while deleting food diary entry",
      ],
    });
  }
});

export default router;
