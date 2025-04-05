import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// Get all shopping lists for a user
router.get("/", async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ errors: ["User ID is required"] });
    }

    const shoppingLists = await prisma.shoppingList.findMany({
      where: {
        userId: userId as string,
      },
      include: {
        items: {
          include: {
            ingredient: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(shoppingLists);
  } catch (error) {
    console.error("Failed to fetch shopping lists:", error);
    res.status(500).json({
      errors: ["Internal server error occurred while fetching shopping lists"],
    });
  }
});

// Get a single shopping list by ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ errors: ["Invalid shopping list ID"] });
    }

    const shoppingList = await prisma.shoppingList.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            ingredient: true,
          },
        },
      },
    });

    if (!shoppingList) {
      return res.status(404).json({ errors: ["Shopping list not found"] });
    }

    res.json(shoppingList);
  } catch (error) {
    console.error("Failed to fetch shopping list:", error);
    res.status(500).json({
      errors: ["Internal server error occurred while fetching shopping list"],
    });
  }
});

// Create a new shopping list
router.post("/", async (req: Request, res: Response) => {
  try {
    const { userId, name, items } = req.body;

    if (!userId || !name) {
      return res.status(400).json({
        errors: ["User ID and name are required"],
      });
    }

    const shoppingList = await prisma.shoppingList.create({
      data: {
        userId,
        name,
        items: {
          create:
            items?.map((item: { ingredientId: number; amount: number }) => ({
              ingredientId: item.ingredientId,
              amount: item.amount,
              isDone: false,
            })) || [],
        },
      },
      include: {
        items: {
          include: {
            ingredient: true,
          },
        },
      },
    });

    res.status(201).json(shoppingList);
  } catch (error) {
    console.error("Failed to create shopping list:", error);
    res.status(500).json({
      errors: ["Internal server error occurred while creating shopping list"],
    });
  }
});

// Update a shopping list
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { name } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({ errors: ["Invalid shopping list ID"] });
    }

    const updatedShoppingList = await prisma.shoppingList.update({
      where: { id },
      data: {
        name,
      },
      include: {
        items: {
          include: {
            ingredient: true,
          },
        },
      },
    });

    res.json(updatedShoppingList);
  } catch (error) {
    console.error("Failed to update shopping list:", error);
    res.status(500).json({
      errors: ["Internal server error occurred while updating shopping list"],
    });
  }
});

// Delete a shopping list
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ errors: ["Invalid shopping list ID"] });
    }

    await prisma.shoppingList.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Failed to delete shopping list:", error);
    res.status(500).json({
      errors: ["Internal server error occurred while deleting shopping list"],
    });
  }
});

// Add items to a shopping list
router.post("/:id/items", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { items } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({ errors: ["Invalid shopping list ID"] });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ errors: ["Items array is required"] });
    }

    const updatedShoppingList = await prisma.shoppingList.update({
      where: { id },
      data: {
        items: {
          createMany: {
            data: items.map(
              (item: { ingredientId: number; amount: number }) => ({
                ingredientId: item.ingredientId,
                amount: item.amount,
                isDone: false,
              })
            ),
          },
        },
      },
      include: {
        items: {
          include: {
            ingredient: true,
          },
        },
      },
    });

    res.json(updatedShoppingList);
  } catch (error) {
    console.error("Failed to add items to shopping list:", error);
    res.status(500).json({
      errors: [
        "Internal server error occurred while adding items to shopping list",
      ],
    });
  }
});

// Update an item's status (mark as done/undone)
router.patch("/items/:itemId", async (req: Request, res: Response) => {
  try {
    const itemId = parseInt(req.params.itemId);
    const { isDone } = req.body;

    if (isNaN(itemId)) {
      return res
        .status(400)
        .json({ errors: ["Invalid shopping list item ID"] });
    }

    if (typeof isDone !== "boolean") {
      return res.status(400).json({ errors: ["isDone status is required"] });
    }

    const updatedItem = await prisma.shoppingListItem.update({
      where: { id: itemId },
      data: {
        isDone,
      },
      include: {
        ingredient: true,
      },
    });

    res.json(updatedItem);
  } catch (error) {
    console.error("Failed to update shopping list item status:", error);
    res.status(500).json({
      errors: ["Internal server error occurred while updating item status"],
    });
  }
});

// Delete an item from a shopping list
router.delete("/items/:itemId", async (req: Request, res: Response) => {
  try {
    const itemId = parseInt(req.params.itemId);

    if (isNaN(itemId)) {
      return res
        .status(400)
        .json({ errors: ["Invalid shopping list item ID"] });
    }

    await prisma.shoppingListItem.delete({
      where: { id: itemId },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Failed to delete shopping list item:", error);
    res.status(500).json({
      errors: ["Internal server error occurred while deleting item"],
    });
  }
});

// Generate a shopping list from planned meals
router.post("/generate-from-planned", async (req: Request, res: Response) => {
  try {
    const { userId, name, startDate, endDate } = req.body;

    if (!userId || !name || !startDate || !endDate) {
      return res.status(400).json({
        errors: ["User ID, name, start date, and end date are required"],
      });
    }

    // Get all planned meals within the date range
    const plannedMeals = await prisma.plannedMeal.findMany({
      where: {
        userId,
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      include: {
        ingredients: true,
      },
    });

    if (plannedMeals.length === 0) {
      return res.status(404).json({
        errors: ["No planned meals found for the specified date range"],
      });
    }

    // Aggregate ingredients from all planned meals
    const ingredientMap = new Map<
      number,
      { ingredientId: number; amount: number }
    >();

    plannedMeals.forEach((meal) => {
      meal.ingredients.forEach((ingredient) => {
        if (ingredientMap.has(ingredient.ingredientId)) {
          const existing = ingredientMap.get(ingredient.ingredientId)!;
          existing.amount += ingredient.amount;
        } else {
          ingredientMap.set(ingredient.ingredientId, {
            ingredientId: ingredient.ingredientId,
            amount: ingredient.amount,
          });
        }
      });
    });

    // Create a new shopping list with the aggregated ingredients
    const shoppingList = await prisma.shoppingList.create({
      data: {
        userId,
        name,
        items: {
          create: Array.from(ingredientMap.values()),
        },
      },
      include: {
        items: {
          include: {
            ingredient: true,
          },
        },
      },
    });

    res.status(201).json(shoppingList);
  } catch (error) {
    console.error(
      "Failed to generate shopping list from planned meals:",
      error
    );
    res.status(500).json({
      errors: ["Internal server error occurred while generating shopping list"],
    });
  }
});

export default router;
