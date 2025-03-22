interface Ingredient {
  proteins: number;
  carbs: number;
  fats: number;
  calories: number;
}

interface IngredientWithAmount {
  amount: number;
  ingredient: Ingredient;
}

interface Nutrients {
  proteins: number;
  carbs: number;
  fats: number;
  calories: number;
}

export function calculateTotalNutrients(
  ingredients: IngredientWithAmount[]
): Nutrients {
  return ingredients.reduce(
    (acc, { amount, ingredient }) => {
      const multiplier = amount / 100;
      return {
        proteins: acc.proteins + ingredient.proteins * multiplier,
        carbs: acc.carbs + ingredient.carbs * multiplier,
        fats: acc.fats + ingredient.fats * multiplier,
        calories: acc.calories + ingredient.calories * multiplier,
      };
    },
    { proteins: 0, carbs: 0, fats: 0, calories: 0 }
  );
}
