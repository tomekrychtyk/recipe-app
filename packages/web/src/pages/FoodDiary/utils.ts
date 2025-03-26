import type {
  FoodDiaryEntryResponse,
  NutritionalSummary,
  DetailedNutrition,
} from "./types";
import { VITAMINS_RDA, MINERALS_RDA } from "@food-recipe-app/common";

export const formatTime = (timeString: string) => {
  // PostgreSQL returns time as "HH:mm:ss.ms+00"
  const match = timeString.match(/(\d{2}):(\d{2})/);
  if (match) {
    const [, hours, minutes] = match;
    return `${hours}:${minutes}`;
  }
  return timeString;
};

export const sortEntriesByTime = (entries: FoodDiaryEntryResponse[]) => {
  return [...entries].sort((a, b) => a.time.localeCompare(b.time));
};

export const calculateDailyNutrition = (
  entries: FoodDiaryEntryResponse[]
): NutritionalSummary => {
  const summary = entries.reduce(
    (acc, entry) => {
      entry.ingredients.forEach((ing) => {
        // Calculate nutrition based on amount (converting from 100g base)
        const multiplier = ing.amount / 100;
        acc.proteins += (ing.ingredient.proteins || 0) * multiplier;
        acc.carbs += (ing.ingredient.carbs || 0) * multiplier;
        acc.fats += (ing.ingredient.fats || 0) * multiplier;
        acc.calories += (ing.ingredient.calories || 0) * multiplier;
      });
      return acc;
    },
    {
      proteins: 0,
      carbs: 0,
      fats: 0,
      calories: 0,
    }
  );

  // Round to 1 decimal place
  return {
    proteins: Math.round(summary.proteins * 10) / 10,
    carbs: Math.round(summary.carbs * 10) / 10,
    fats: Math.round(summary.fats * 10) / 10,
    calories: Math.round(summary.calories),
  };
};

export const calculateDetailedNutrition = (
  entries: FoodDiaryEntryResponse[]
): DetailedNutrition => {
  const nutrition: DetailedNutrition = {};

  entries.forEach((entry) => {
    entry.ingredients.forEach((ingredient) => {
      const multiplier = ingredient.amount / 100;
      Object.entries(ingredient.ingredient).forEach(([key, value]) => {
        if (
          (key in VITAMINS_RDA || key in MINERALS_RDA) &&
          typeof value === "number"
        ) {
          const nutrientKey = key as keyof DetailedNutrition;
          nutrition[nutrientKey] =
            (nutrition[nutrientKey] || 0) + value * multiplier;
        }
      });
    });
  });

  // Round all values to 1 decimal place
  return Object.fromEntries(
    Object.entries(nutrition).map(([key, value]) => [
      key,
      Math.round(value * 10) / 10,
    ])
  ) as DetailedNutrition;
};

export const calculateEntryNutrition = (
  ingredients: Array<{ ingredient: any; amount: number }>
): NutritionalSummary => {
  const summary = ingredients.reduce(
    (acc, ing) => {
      const multiplier = ing.amount / 100;
      acc.proteins += (ing.ingredient.proteins || 0) * multiplier;
      acc.carbs += (ing.ingredient.carbs || 0) * multiplier;
      acc.fats += (ing.ingredient.fats || 0) * multiplier;
      acc.calories += (ing.ingredient.calories || 0) * multiplier;
      return acc;
    },
    { proteins: 0, carbs: 0, fats: 0, calories: 0 }
  );

  return {
    proteins: Math.round(summary.proteins * 10) / 10,
    carbs: Math.round(summary.carbs * 10) / 10,
    fats: Math.round(summary.fats * 10) / 10,
    calories: Math.round(summary.calories),
  };
};
