import type { FoodCategory } from "./constants/categories";

export interface Ingredient {
  id: number;
  name: string;
  categoryId: string;

  // Basic nutrients
  proteins: number;
  carbs: number;
  fats: number;
  calories: number;

  // Vitamins
  vitaminA?: number | null;
  vitaminD?: number | null;
  vitaminE?: number | null;
  vitaminK?: number | null;
  vitaminC?: number | null;
  thiamin?: number | null;
  riboflavin?: number | null;
  niacin?: number | null;
  pantothenicAcid?: number | null;
  vitaminB6?: number | null;
  biotin?: number | null;
  folate?: number | null;
  vitaminB12?: number | null;

  // Minerals
  calcium?: number | null;
  iron?: number | null;
  magnesium?: number | null;
  phosphorus?: number | null;
  potassium?: number | null;
  sodium?: number | null;
  zinc?: number | null;
  copper?: number | null;
  manganese?: number | null;
  selenium?: number | null;
  chromium?: number | null;
  molybdenum?: number | null;
  iodine?: number | null;

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface MealIngredientInput {
  ingredientId: number;
  amount: number;
}

export interface MealIngredient extends MealIngredientInput {
  ingredient: Ingredient;
}

export interface Meal {
  id: number;
  name: string;
  description?: string;
  ingredients: MealIngredient[];
  totalNutrients: {
    proteins: number;
    carbs: number;
    fats: number;
    calories: number;
  };
}

export interface MealInput {
  name: string;
  description?: string;
  ingredients: MealIngredientInput[];
}

export interface NutrientsState {
  // Basic nutrients
  proteins: number;
  carbs: number;
  fats: number;
  calories: number;

  // Vitamins
  vitaminA: number | null;
  vitaminD: number | null;
  vitaminE: number | null;
  vitaminK: number | null;
  vitaminC: number | null;
  thiamin: number | null;
  riboflavin: number | null;
  niacin: number | null;
  pantothenicAcid: number | null;
  vitaminB6: number | null;
  biotin: number | null;
  folate: number | null;
  vitaminB12: number | null;

  // Minerals
  calcium: number | null;
  iron: number | null;
  magnesium: number | null;
  phosphorus: number | null;
  potassium: number | null;
  sodium: number | null;
  zinc: number | null;
  copper: number | null;
  manganese: number | null;
  selenium: number | null;
  chromium: number | null;
  molybdenum: number | null;
  iodine: number | null;
}

export type NutrientsAction =
  | {
      type: "SET_BASIC_NUTRIENT";
      field: "proteins" | "carbs" | "fats" | "calories";
      value: number;
    }
  | {
      type: "SET_VITAMIN";
      field: keyof Pick<
        NutrientsState,
        | "vitaminA"
        | "vitaminD"
        | "vitaminE"
        | "vitaminK"
        | "vitaminC"
        | "thiamin"
        | "riboflavin"
        | "niacin"
        | "pantothenicAcid"
        | "vitaminB6"
        | "biotin"
        | "folate"
        | "vitaminB12"
      >;
      value: number | null;
    }
  | {
      type: "SET_MINERAL";
      field: keyof Pick<
        NutrientsState,
        | "calcium"
        | "iron"
        | "magnesium"
        | "phosphorus"
        | "potassium"
        | "sodium"
        | "zinc"
        | "copper"
        | "manganese"
        | "selenium"
        | "chromium"
        | "molybdenum"
        | "iodine"
      >;
      value: number | null;
    }
  | { type: "RESET" };
