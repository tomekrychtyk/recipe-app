import { Request, Response, NextFunction } from "express";
import { FOOD_CATEGORIES } from "@food-recipe-app/common/src/constants/categories";

export const validateIngredient = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, categoryId, proteins, carbs, fats, calories } = req.body;

  const errors: string[] = [];

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    errors.push("Name is required and must be a non-empty string");
  }

  if (!categoryId || !FOOD_CATEGORIES.some((cat) => cat.id === categoryId)) {
    errors.push("Valid category is required");
  }

  const validateNumber = (value: any, field: string) => {
    if (value === undefined || value === null) {
      errors.push(`${field} is required`);
    } else {
      const num = Number(value);
      if (isNaN(num) || num < 0) {
        errors.push(`${field} must be a non-negative number`);
      }
    }
  };

  validateNumber(proteins, "Proteins");
  validateNumber(carbs, "Carbs");
  validateNumber(fats, "Fats");
  validateNumber(calories, "Calories");

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
  const { name, description, ingredients } = req.body;

  const errors: string[] = [];

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    errors.push("Name is required and must be a non-empty string");
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
