import type { Ingredient, Meal } from "@food-recipe-app/common";

export type EntryType = "ingredients" | "public_meals" | "my_meals";

export interface IngredientWithQuantity {
  ingredient: Ingredient;
  amount: number;
}

export interface FoodDiaryEntry {
  time: Date | null;
  name: string;
  type: EntryType;
  selectedMeal: Meal | null;
  ingredients: IngredientWithQuantity[];
}

export interface FoodDiaryEntryResponse {
  id: number;
  date: string;
  time: string;
  name: string;
  ingredients: Array<{
    ingredientId: number;
    ingredient: Ingredient;
    amount: number;
  }>;
}

export interface NutritionalSummary {
  proteins: number;
  carbs: number;
  fats: number;
  calories: number;
}

export interface DetailedNutrition {
  vitaminA?: number;
  vitaminD?: number;
  vitaminE?: number;
  vitaminK?: number;
  vitaminC?: number;
  thiamin?: number;
  riboflavin?: number;
  niacin?: number;
  pantothenicAcid?: number;
  vitaminB6?: number;
  biotin?: number;
  folate?: number;
  vitaminB12?: number;
  calcium?: number;
  iron?: number;
  magnesium?: number;
  phosphorus?: number;
  potassium?: number;
  sodium?: number;
  zinc?: number;
  copper?: number;
  manganese?: number;
  selenium?: number;
  chromium?: number;
  molybdenum?: number;
  iodine?: number;
}
