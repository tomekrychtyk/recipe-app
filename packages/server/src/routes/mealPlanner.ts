import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// Get planned meals
router.get("/", async (req: Request, res: Response) => {
  try {
    const { userId, date } = req.query;

    if (!userId) {
      return res.status(400).json({ errors: ["User ID is required"] });
    }

    const plannedMeals = await prisma.plannedMeal.findMany({
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
      orderBy: [{ date: "asc" }, { time: "asc" }],
    });

    res.json(plannedMeals);
  } catch (error) {
    console.error("Failed to fetch planned meals:", error);
    res.status(500).json({
      errors: ["Internal server error occurred while fetching planned meals"],
    });
  }
});

// Add planned meal
router.post("/", async (req: Request, res: Response) => {
  try {
    const { userId, date, time, name, mealId, ingredients } = req.body;

    if (!userId || !date || !time || !name) {
      return res.status(400).json({
        errors: ["User ID, date, time, and name are required"],
      });
    }

    const plannedMeal = await prisma.plannedMeal.create({
      data: {
        userId,
        date: new Date(date),
        time: new Date(`1970-01-01T${time}`),
        name,
        mealId,
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

    res.status(201).json(plannedMeal);
  } catch (error) {
    console.error("Failed to create planned meal:", error);
    res.status(500).json({
      errors: ["Internal server error occurred while creating planned meal"],
    });
  }
});

// Delete planned meal
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ errors: ["Invalid planned meal ID"] });
    }

    await prisma.plannedMeal.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Failed to delete planned meal:", error);
    res.status(500).json({
      errors: ["Internal server error occurred while deleting planned meal"],
    });
  }
});

// Add planned meal to food diary
router.post("/:id/add-to-diary", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ errors: ["Invalid planned meal ID"] });
    }

    // Find the planned meal
    const plannedMeal = await prisma.plannedMeal.findUnique({
      where: { id },
      include: {
        ingredients: true,
      },
    });

    if (!plannedMeal) {
      return res.status(404).json({ errors: ["Planned meal not found"] });
    }

    // Create a food diary entry from the planned meal
    const diaryEntry = await prisma.foodDiaryEntry.create({
      data: {
        userId: plannedMeal.userId,
        date: new Date(), // Today's date
        time: plannedMeal.time,
        name: plannedMeal.name,
        mealId: plannedMeal.mealId,
        ingredients: {
          create: plannedMeal.ingredients.map((ing) => ({
            ingredientId: ing.ingredientId,
            amount: ing.amount,
          })),
        },
      },
    });

    res.status(201).json(diaryEntry);
  } catch (error) {
    console.error("Failed to add planned meal to diary:", error);
    res.status(500).json({
      errors: ["Internal server error occurred while adding to food diary"],
    });
  }
});

export default router;
