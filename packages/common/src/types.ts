import type { MealCategory } from "./constants/categories";

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

export interface Ingredient {
  id: number;
  name: string;
  categoryId: string;

  // Basic nutrients
  proteins: number; // g
  carbs: number; // g
  fats: number; // g
  calories: number; // kcal

  // Vitamins
  vitaminA?: number; // mcg
  vitaminD?: number; // mcg
  vitaminE?: number; // mg
  vitaminK?: number; // mcg
  vitaminC?: number; // mg
  thiamin?: number; // mg
  riboflavin?: number; // mg
  niacin?: number; // mg
  pantothenicAcid?: number; // mg
  vitaminB6?: number; // mg
  biotin?: number; // mcg
  folate?: number; // mcg
  vitaminB12?: number; // mcg

  // Minerals
  calcium?: number; // mg
  iron?: number; // mg
  magnesium?: number; // mg
  phosphorus?: number; // mg
  potassium?: number; // mg
  sodium?: number; // mg
  zinc?: number; // mg
  copper?: number; // mg
  manganese?: number; // mg
  selenium?: number; // mcg
  chromium?: number; // mcg
  molybdenum?: number; // mcg
  iodine?: number; // mcg

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
  categoryId: MealCategory;
  description?: string;
  thumbnailUrl?: string;
  totalNutrients: {
    // Basic nutrients
    proteins: number;
    carbs: number;
    fats: number;
    calories: number;

    // Vitamins
    vitaminA: number;
    vitaminD: number;
    vitaminE: number;
    vitaminK: number;
    vitaminC: number;
    thiamin: number;
    riboflavin: number;
    niacin: number;
    pantothenicAcid: number;
    vitaminB6: number;
    biotin: number;
    folate: number;
    vitaminB12: number;

    // Minerals
    calcium: number;
    iron: number;
    magnesium: number;
    phosphorus: number;
    potassium: number;
    sodium: number;
    zinc: number;
    copper: number;
    manganese: number;
    selenium: number;
    chromium: number;
    molybdenum: number;
    iodine: number;
  };
  ingredients: MealIngredient[];
  createdAt: string;
  updatedAt: string;
}

export interface MealInput {
  name: string;
  description?: string;
  ingredients: MealIngredientInput[];
  categoryId: MealCategory;
  userId?: string;
  thumbnailUrl?: string;
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

export interface FoodDiaryIngredient {
  ingredientId: number;
  ingredient: Ingredient;
  amount: number;
}

export interface FoodDiaryEntry {
  id: number;
  userId: string;
  date: string;
  time: string;
  name: string;
  mealId?: number;
  meal?: Meal;
  ingredients: FoodDiaryIngredient[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateFoodDiaryEntryInput {
  userId: string;
  date: string;
  time: string;
  name: string;
  mealId?: number;
  ingredients: Array<{
    ingredientId: number;
    amount: number;
  }>;
}

export interface ShoppingList {
  id: number;
  userId: string;
  name: string;
  items: ShoppingListItem[];
  createdAt: string;
  updatedAt: string;
}

export interface ShoppingListItem {
  id: number;
  shoppingListId: number;
  ingredientId: number;
  ingredient: Ingredient;
  amount: number;
  isDone: boolean;
}
