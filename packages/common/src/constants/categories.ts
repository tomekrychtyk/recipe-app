export const FOOD_CATEGORIES = [
  { name: "Poultry", id: "poultry" },
  { name: "Red Meat", id: "red-meat" },
  { name: "Fish & Seafood", id: "fish-seafood" },
  { name: "Dairy & Eggs", id: "dairy-eggs" },
  { name: "Vegetables", id: "vegetables" },
  { name: "Fruits", id: "fruits" },
  { name: "Grains & Cereals", id: "grains" },
  { name: "Nuts & Seeds", id: "nuts-seeds" },
  { name: "Legumes", id: "legumes" },
  { name: "Herbs & Spices", id: "herbs-spices" },
  { name: "Oils & Fats", id: "oils-fats" },
  { name: "Beverages", id: "beverages" },
  { name: "Snacks", id: "snacks" },
  { name: "Other", id: "other" },
] as const;

export type FoodCategory = (typeof FOOD_CATEGORIES)[number]["id"];
