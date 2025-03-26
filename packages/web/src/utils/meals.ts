import {
  FOOD_CATEGORIES,
  MEAL_CATEGORIES,
} from "@food-recipe-app/common/src/constants/categories";

export const getCategoryColor = (
  categoryId: string
):
  | "default"
  | "primary"
  | "secondary"
  | "error"
  | "info"
  | "success"
  | "warning" => {
  const colors: Record<string, any> = {
    vegetables: "success",
    fruits: "error",
    "dairy-eggs": "info",
    poultry: "warning",
    "fish-seafood": "primary",
    "red-meat": "error",
    grains: "warning",
    "nuts-seeds": "success",
  };
  return colors[categoryId] || "default";
};

export const getCategoryName = (categoryId: string) => {
  return (
    FOOD_CATEGORIES.find((cat) => cat.id === categoryId)?.name || categoryId
  );
};

export const getMealCategoryName = (categoryId: string) => {
  return (
    MEAL_CATEGORIES.find((cat) => cat.id === categoryId)?.name || categoryId
  );
};
