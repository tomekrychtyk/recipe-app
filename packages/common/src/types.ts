import type { FoodCategory } from "./constants/categories";

export interface Ingredient {
  id: number;
  name: string;
  categoryId: FoodCategory;
  proteins: number;
  carbs: number;
  fats: number;
  calories: number;
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
