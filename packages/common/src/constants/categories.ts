export const FOOD_CATEGORIES = [
  { name: "Drób", id: "poultry" },
  { name: "Mięso Czerwone", id: "red-meat" },
  { name: "Ryby i Owoce Morza", id: "fish-seafood" },
  { name: "Mleko i Jaja", id: "dairy-eggs" },
  { name: "Warzywa", id: "vegetables" },
  { name: "Owoce", id: "fruits" },
  { name: "Makarony i Zboża", id: "grains" },
  { name: "Nasiona i Orzechy", id: "nuts-seeds" },
  { name: "Bakalie", id: "legumes" },
  { name: "Przyprawy", id: "herbs-spices" },
  { name: "Oleje i Tłuszcze", id: "oils-fats" },
  { name: "Napoje", id: "beverages" },
  { name: "Przekąski", id: "snacks" },
  { name: "Inne", id: "other" },
] as const;

export type FoodCategory = (typeof FOOD_CATEGORIES)[number]["id"];
