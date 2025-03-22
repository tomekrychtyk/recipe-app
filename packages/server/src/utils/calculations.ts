import type { Meal } from "@food-recipe-app/common";

interface Ingredient {
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
}

interface IngredientWithAmount {
  ingredient: {
    proteins: number;
    carbs: number;
    fats: number;
    calories: number;
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
  };
  amount: number;
}

interface Nutrients {
  proteins: number;
  carbs: number;
  fats: number;
  calories: number;
}

export const calculateTotalNutrients = (
  ingredients: IngredientWithAmount[]
): Meal["totalNutrients"] => {
  return ingredients.reduce(
    (acc, { amount, ingredient }) => {
      const multiplier = amount / 100;
      return {
        proteins: acc.proteins + ingredient.proteins * multiplier,
        carbs: acc.carbs + ingredient.carbs * multiplier,
        fats: acc.fats + ingredient.fats * multiplier,
        calories: acc.calories + ingredient.calories * multiplier,

        vitaminA: acc.vitaminA + (ingredient.vitaminA ?? 0) * multiplier,
        vitaminD: acc.vitaminD + (ingredient.vitaminD ?? 0) * multiplier,
        vitaminE: acc.vitaminE + (ingredient.vitaminE ?? 0) * multiplier,
        vitaminK: acc.vitaminK + (ingredient.vitaminK ?? 0) * multiplier,
        vitaminC: acc.vitaminC + (ingredient.vitaminC ?? 0) * multiplier,
        thiamin: acc.thiamin + (ingredient.thiamin ?? 0) * multiplier,
        riboflavin: acc.riboflavin + (ingredient.riboflavin ?? 0) * multiplier,
        niacin: acc.niacin + (ingredient.niacin ?? 0) * multiplier,
        pantothenicAcid:
          acc.pantothenicAcid + (ingredient.pantothenicAcid ?? 0) * multiplier,
        vitaminB6: acc.vitaminB6 + (ingredient.vitaminB6 ?? 0) * multiplier,
        biotin: acc.biotin + (ingredient.biotin ?? 0) * multiplier,
        folate: acc.folate + (ingredient.folate ?? 0) * multiplier,
        vitaminB12: acc.vitaminB12 + (ingredient.vitaminB12 ?? 0) * multiplier,

        calcium: acc.calcium + (ingredient.calcium ?? 0) * multiplier,
        iron: acc.iron + (ingredient.iron ?? 0) * multiplier,
        magnesium: acc.magnesium + (ingredient.magnesium ?? 0) * multiplier,
        phosphorus: acc.phosphorus + (ingredient.phosphorus ?? 0) * multiplier,
        potassium: acc.potassium + (ingredient.potassium ?? 0) * multiplier,
        sodium: acc.sodium + (ingredient.sodium ?? 0) * multiplier,
        zinc: acc.zinc + (ingredient.zinc ?? 0) * multiplier,
        copper: acc.copper + (ingredient.copper ?? 0) * multiplier,
        manganese: acc.manganese + (ingredient.manganese ?? 0) * multiplier,
        selenium: acc.selenium + (ingredient.selenium ?? 0) * multiplier,
        chromium: acc.chromium + (ingredient.chromium ?? 0) * multiplier,
        molybdenum: acc.molybdenum + (ingredient.molybdenum ?? 0) * multiplier,
        iodine: acc.iodine + (ingredient.iodine ?? 0) * multiplier,
      };
    },
    {
      proteins: 0,
      carbs: 0,
      fats: 0,
      calories: 0,
      vitaminA: 0,
      vitaminD: 0,
      vitaminE: 0,
      vitaminK: 0,
      vitaminC: 0,
      thiamin: 0,
      riboflavin: 0,
      niacin: 0,
      pantothenicAcid: 0,
      vitaminB6: 0,
      biotin: 0,
      folate: 0,
      vitaminB12: 0,
      calcium: 0,
      iron: 0,
      magnesium: 0,
      phosphorus: 0,
      potassium: 0,
      sodium: 0,
      zinc: 0,
      copper: 0,
      manganese: 0,
      selenium: 0,
      chromium: 0,
      molybdenum: 0,
      iodine: 0,
    }
  );
};
