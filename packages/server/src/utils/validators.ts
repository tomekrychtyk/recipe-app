import { Request, Response, NextFunction } from "express";

export const validateIngredient = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, categoryId, ...nutrients } = req.body;

  const errors: string[] = [];

  // Basic validation
  if (!name || typeof name !== "string" || name.trim().length === 0) {
    errors.push("Name is required and must be a non-empty string");
  }

  if (!categoryId || typeof categoryId !== "string") {
    errors.push("Category ID is required and must be a string");
  }

  // Basic nutrients validation (required)
  ["proteins", "carbs", "fats", "calories"].forEach((field) => {
    if (typeof nutrients[field] !== "number" || nutrients[field] < 0) {
      errors.push(`${field} must be a non-negative number`);
    }
  });

  // Optional nutrients validation (vitamins and minerals)
  const optionalNutrients = [
    "vitaminA",
    "vitaminD",
    "vitaminE",
    "vitaminK",
    "vitaminC",
    "thiamin",
    "riboflavin",
    "niacin",
    "pantothenicAcid",
    "vitaminB6",
    "biotin",
    "folate",
    "vitaminB12",
    "calcium",
    "iron",
    "magnesium",
    "phosphorus",
    "potassium",
    "sodium",
    "zinc",
    "copper",
    "manganese",
    "selenium",
    "chromium",
    "molybdenum",
    "iodine",
  ];

  optionalNutrients.forEach((field) => {
    if (field in nutrients && nutrients[field] !== null) {
      if (typeof nutrients[field] !== "number" || nutrients[field] < 0) {
        errors.push(`${field} must be a non-negative number when provided`);
      }
    }
  });

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

export const validateMeal = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, description, ingredients, categoryId } = req.body;

  const errors: string[] = [];

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    errors.push("Name is required and must be a non-empty string");
  }

  if (!categoryId || !["breakfast", "dinner", "snack"].includes(categoryId)) {
    errors.push("Valid category ID (breakfast, dinner, snack) is required");
  }

  if (description && typeof description !== "string") {
    errors.push("Description must be a string");
  }

  if (!Array.isArray(ingredients) || ingredients.length === 0) {
    errors.push("At least one ingredient is required");
  } else {
    ingredients.forEach((ing, index) => {
      if (!ing.ingredientId || typeof ing.ingredientId !== "number") {
        errors.push(
          `Ingredient at position ${index + 1} must have a valid ingredientId`
        );
      }
      if (!ing.amount || typeof ing.amount !== "number" || ing.amount <= 0) {
        errors.push(
          `Ingredient at position ${index + 1} must have a valid amount greater than 0`
        );
      }
    });
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

export const validateFoodDiaryEntry = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { date, time, name, ingredients } = req.body;
  const errors: string[] = [];

  if (!date || !isValidDate(date)) {
    errors.push("Valid date is required (YYYY-MM-DD format)");
  }

  if (!time || !isValidTime(time)) {
    errors.push("Valid time is required (HH:mm:ss format)");
  }

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    errors.push("Name is required and must be a non-empty string");
  }

  if (!Array.isArray(ingredients) || ingredients.length === 0) {
    errors.push("At least one ingredient is required");
  } else {
    ingredients.forEach((ing, index) => {
      if (!ing.ingredientId || typeof ing.ingredientId !== "number") {
        errors.push(
          `Ingredient at position ${index + 1} must have a valid ingredientId`
        );
      }
      if (!ing.amount || typeof ing.amount !== "number" || ing.amount <= 0) {
        errors.push(
          `Ingredient at position ${index + 1} must have a valid amount greater than 0`
        );
      }
    });
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

function isValidDate(dateString: string) {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

function isValidTime(timeString: string) {
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
  return timeRegex.test(timeString);
}
