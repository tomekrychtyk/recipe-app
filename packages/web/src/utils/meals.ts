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
