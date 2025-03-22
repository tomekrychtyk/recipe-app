import { useState, useEffect, useReducer } from "react";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  IconButton,
  TableSortLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Chip,
  Divider,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import {
  useGetIngredientsQuery,
  useDeleteIngredientMutation,
  useUpdateIngredientMutation,
} from "../../store/api/ingredients";
import {
  FOOD_CATEGORIES,
  FoodCategory,
} from "@food-recipe-app/common/src/constants/categories";
import { NutrientsState, NutrientsAction } from "@food-recipe-app/common";
import { EditIngredientModal } from "../../components/EditIngredientModal";
import { Ingredient } from "@food-recipe-app/common";
import { Link } from "react-router-dom";

type SortField =
  | "name"
  | "categoryId"
  | "proteins"
  | "carbs"
  | "fats"
  | "calories";
type SortOrder = "asc" | "desc";

const initialState: NutrientsState = {
  proteins: 0,
  carbs: 0,
  fats: 0,
  calories: 0,
  vitaminA: null,
  vitaminD: null,
  vitaminE: null,
  vitaminK: null,
  vitaminC: null,
  thiamin: null,
  riboflavin: null,
  niacin: null,
  pantothenicAcid: null,
  vitaminB6: null,
  biotin: null,
  folate: null,
  vitaminB12: null,
  calcium: null,
  iron: null,
  magnesium: null,
  phosphorus: null,
  potassium: null,
  sodium: null,
  zinc: null,
  copper: null,
  manganese: null,
  selenium: null,
  chromium: null,
  molybdenum: null,
  iodine: null,
};

function nutrientsReducer(
  state: NutrientsState,
  action: NutrientsAction
): NutrientsState {
  switch (action.type) {
    case "SET_BASIC_NUTRIENT":
      return { ...state, [action.field]: action.value };
    case "SET_VITAMIN":
      return { ...state, [action.field]: action.value };
    case "SET_MINERAL":
      return { ...state, [action.field]: action.value };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

export function Ingredients() {
  const { data: ingredients = [], isLoading, error } = useGetIngredientsQuery();
  const [deleteIngredient, { isLoading: isDeleting }] =
    useDeleteIngredientMutation();
  const [updateIngredient, { isLoading: isUpdating }] =
    useUpdateIngredientMutation();

  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<FoodCategory | "">("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedIngredient, setSelectedIngredient] =
    useState<Ingredient | null>(null);
  const [editName, setEditName] = useState("");
  const [editCategory, setEditCategory] = useState<FoodCategory>(
    FOOD_CATEGORIES[0].id
  );
  const [nutrients, dispatch] = useReducer(nutrientsReducer, initialState);

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleDeleteClick = (id: number) => {
    setDeleteConfirmId(id);
  };

  const handleDeleteConfirm = async () => {
    if (deleteConfirmId) {
      try {
        await deleteIngredient(deleteConfirmId).unwrap();
      } catch (error) {
        console.error("Failed to delete ingredient:", error);
      }
      setDeleteConfirmId(null);
    }
  };

  const getCategoryName = (categoryId: string) => {
    return (
      FOOD_CATEGORIES.find((cat) => cat.id === categoryId)?.name || categoryId
    );
  };

  const getCategoryColor = (
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

  const sortedAndFilteredIngredients = [...ingredients]
    .filter((ing) => {
      const matchesSearch = ing.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        !categoryFilter || ing.categoryId === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      let compareValue: number;
      if (sortField === "categoryId") {
        compareValue = getCategoryName(a[sortField]).localeCompare(
          getCategoryName(b[sortField])
        );
      } else {
        compareValue = a[sortField] > b[sortField] ? 1 : -1;
      }
      return sortOrder === "asc" ? compareValue : -compareValue;
    });

  const handleEditClick = (ingredient: any) => {
    setSelectedIngredient(ingredient);
    setEditDialogOpen(true);
  };

  const handleEditClose = () => {
    setEditDialogOpen(false);
    setSelectedIngredient(null);
    dispatch({ type: "RESET" });
  };

  const handleEditSubmit = async () => {
    if (!selectedIngredient) return;

    try {
      await updateIngredient({
        id: selectedIngredient.id,
        name: editName,
        categoryId: editCategory,
        ...nutrients,
      }).unwrap();
      handleEditClose();
    } catch (error) {
      console.error("Failed to update ingredient:", error);
    }
  };

  useEffect(() => {
    if (selectedIngredient) {
      setEditName(selectedIngredient.name);
      setEditCategory(selectedIngredient.categoryId);
      Object.entries(selectedIngredient).forEach(([key, value]) => {
        if (key in initialState) {
          dispatch({
            type:
              key in ["proteins", "carbs", "fats", "calories"]
                ? "SET_BASIC_NUTRIENT"
                : key.startsWith("vitamin")
                  ? "SET_VITAMIN"
                  : "SET_MINERAL",
            field: key as any,
            value: value as any,
          });
        }
      });
    }
  }, [selectedIngredient]);

  const handleNutrientChange = (
    type: NutrientsAction["type"],
    field: string,
    value: string
  ) => {
    switch (type) {
      case "SET_BASIC_NUTRIENT":
        dispatch({
          type,
          field: field as "proteins" | "carbs" | "fats" | "calories",
          value: Number(value),
        });
        break;
      case "SET_VITAMIN":
      case "SET_MINERAL":
        dispatch({
          type,
          field: field as any,
          value: value ? Number(value) : null,
        });
        break;
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 4 }}>
        Failed to load ingredients
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4" component="h1">
          🥗 Ingredients
        </Typography>
        <Button
          component={Link}
          to="/ingredients/add"
          variant="contained"
          color="primary"
        >
          Add Ingredient
        </Button>
      </Box>

      <Box sx={{ mb: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
        <TextField
          placeholder="Search ingredients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <EditIcon sx={{ mr: 1, color: "text.secondary" }} />
            ),
          }}
          sx={{ minWidth: 300 }}
        />

        <TextField
          select
          label="Filter by Category"
          value={categoryFilter}
          onChange={(e) =>
            setCategoryFilter(e.target.value as FoodCategory | "")
          }
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="">All Categories</MenuItem>
          {FOOD_CATEGORIES.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={sortField === "name"}
                  direction={sortField === "name" ? sortOrder : "asc"}
                  onClick={() => handleSort("name")}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === "categoryId"}
                  direction={sortField === "categoryId" ? sortOrder : "asc"}
                  onClick={() => handleSort("categoryId")}
                >
                  Category
                </TableSortLabel>
              </TableCell>
              {["proteins", "carbs", "fats", "calories"].map((field) => (
                <TableCell key={field} align="right">
                  <TableSortLabel
                    active={sortField === field}
                    direction={sortField === field ? sortOrder : "asc"}
                    onClick={() => handleSort(field as SortField)}
                  >
                    {field.charAt(0).toUpperCase() + field.slice(1)}{" "}
                    {field !== "calories" ? "(g)" : "(kcal)"}
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedAndFilteredIngredients.map((ingredient) => (
              <TableRow key={ingredient.id}>
                <TableCell component="th" scope="row">
                  {ingredient.name}
                </TableCell>
                <TableCell>
                  <Chip
                    label={getCategoryName(ingredient.categoryId)}
                    color={getCategoryColor(ingredient.categoryId)}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  {ingredient.proteins.toFixed(2)}
                </TableCell>
                <TableCell align="right">
                  {ingredient.carbs.toFixed(2)}
                </TableCell>
                <TableCell align="right">
                  {ingredient.fats.toFixed(2)}
                </TableCell>
                <TableCell align="right">
                  {ingredient.calories.toFixed(2)}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={() => handleEditClick(ingredient)}
                    disabled={isDeleting || isUpdating}
                    color="primary"
                    sx={{ mr: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteClick(ingredient.id)}
                    disabled={isDeleting}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {sortedAndFilteredIngredients.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  {searchTerm || categoryFilter
                    ? "No ingredients found matching your filters"
                    : "No ingredients found. Add some!"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this ingredient?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmId(null)}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={handleEditClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Ingredient</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            margin="normal"
          />
          <TextField
            select
            fullWidth
            label="Category"
            value={editCategory}
            onChange={(e) => setEditCategory(e.target.value as FoodCategory)}
            margin="normal"
          >
            {FOOD_CATEGORIES.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
              </MenuItem>
            ))}
          </TextField>

          {/* Macronutrients section */}
          <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
            Macronutrients (per 100g)
          </Typography>
          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            <TextField
              type="number"
              label="Proteins (g)"
              value={nutrients.proteins}
              onChange={(e) =>
                handleNutrientChange(
                  "SET_BASIC_NUTRIENT",
                  "proteins",
                  e.target.value
                )
              }
              fullWidth
            />
            <TextField
              type="number"
              label="Carbs (g)"
              value={nutrients.carbs}
              onChange={(e) =>
                handleNutrientChange(
                  "SET_BASIC_NUTRIENT",
                  "carbs",
                  e.target.value
                )
              }
              fullWidth
            />
            <TextField
              type="number"
              label="Fats (g)"
              value={nutrients.fats}
              onChange={(e) =>
                handleNutrientChange(
                  "SET_BASIC_NUTRIENT",
                  "fats",
                  e.target.value
                )
              }
              fullWidth
            />
            <TextField
              type="number"
              label="Calories (kcal)"
              value={nutrients.calories}
              onChange={(e) =>
                handleNutrientChange(
                  "SET_BASIC_NUTRIENT",
                  "calories",
                  e.target.value
                )
              }
              fullWidth
            />
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Vitamins section */}
          <Typography variant="h6" sx={{ mb: 2 }}>
            Vitamins (per 100g)
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 2,
              mb: 4,
            }}
          >
            <TextField
              type="number"
              label="Vitamin A (mcg)"
              value={nutrients.vitaminA ?? ""}
              onChange={(e) =>
                handleNutrientChange("SET_VITAMIN", "vitaminA", e.target.value)
              }
            />
            <TextField
              type="number"
              label="Vitamin D (mcg)"
              value={nutrients.vitaminD ?? ""}
              onChange={(e) =>
                handleNutrientChange("SET_VITAMIN", "vitaminD", e.target.value)
              }
            />
            <TextField
              type="number"
              label="Vitamin E (mg)"
              value={nutrients.vitaminE ?? ""}
              onChange={(e) =>
                handleNutrientChange("SET_VITAMIN", "vitaminE", e.target.value)
              }
            />
            <TextField
              type="number"
              label="Vitamin K (mcg)"
              value={nutrients.vitaminK ?? ""}
              onChange={(e) =>
                handleNutrientChange("SET_VITAMIN", "vitaminK", e.target.value)
              }
            />
            <TextField
              type="number"
              label="Vitamin C (mg)"
              value={nutrients.vitaminC ?? ""}
              onChange={(e) =>
                handleNutrientChange("SET_VITAMIN", "vitaminC", e.target.value)
              }
            />
            <TextField
              type="number"
              label="Thiamin (B1) (mg)"
              value={nutrients.thiamin ?? ""}
              onChange={(e) =>
                handleNutrientChange("SET_VITAMIN", "thiamin", e.target.value)
              }
            />
            <TextField
              type="number"
              label="Riboflavin (B2) (mg)"
              value={nutrients.riboflavin ?? ""}
              onChange={(e) =>
                handleNutrientChange(
                  "SET_VITAMIN",
                  "riboflavin",
                  e.target.value
                )
              }
            />
            <TextField
              type="number"
              label="Niacin (B3) (mg)"
              value={nutrients.niacin ?? ""}
              onChange={(e) =>
                handleNutrientChange("SET_VITAMIN", "niacin", e.target.value)
              }
            />
            <TextField
              type="number"
              label="Pantothenic Acid (B5) (mg)"
              value={nutrients.pantothenicAcid ?? ""}
              onChange={(e) =>
                handleNutrientChange(
                  "SET_VITAMIN",
                  "pantothenicAcid",
                  e.target.value
                )
              }
            />
            <TextField
              type="number"
              label="Vitamin B6 (mg)"
              value={nutrients.vitaminB6 ?? ""}
              onChange={(e) =>
                handleNutrientChange("SET_VITAMIN", "vitaminB6", e.target.value)
              }
            />
            <TextField
              type="number"
              label="Biotin (B7) (mcg)"
              value={nutrients.biotin ?? ""}
              onChange={(e) =>
                handleNutrientChange("SET_VITAMIN", "biotin", e.target.value)
              }
            />
            <TextField
              type="number"
              label="Folate (B9) (mcg)"
              value={nutrients.folate ?? ""}
              onChange={(e) =>
                handleNutrientChange("SET_VITAMIN", "folate", e.target.value)
              }
            />
            <TextField
              type="number"
              label="Vitamin B12 (mcg)"
              value={nutrients.vitaminB12 ?? ""}
              onChange={(e) =>
                handleNutrientChange(
                  "SET_VITAMIN",
                  "vitaminB12",
                  e.target.value
                )
              }
            />
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Minerals section */}
          <Typography variant="h6" sx={{ mb: 2 }}>
            Minerals (per 100g)
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 2,
              mb: 4,
            }}
          >
            <TextField
              type="number"
              label="Calcium (mg)"
              value={nutrients.calcium ?? ""}
              onChange={(e) =>
                handleNutrientChange("SET_MINERAL", "calcium", e.target.value)
              }
            />
            <TextField
              type="number"
              label="Iron (mg)"
              value={nutrients.iron ?? ""}
              onChange={(e) =>
                handleNutrientChange("SET_MINERAL", "iron", e.target.value)
              }
            />
            <TextField
              type="number"
              label="Magnesium (mg)"
              value={nutrients.magnesium ?? ""}
              onChange={(e) =>
                handleNutrientChange("SET_MINERAL", "magnesium", e.target.value)
              }
            />
            <TextField
              type="number"
              label="Phosphorus (mg)"
              value={nutrients.phosphorus ?? ""}
              onChange={(e) =>
                handleNutrientChange(
                  "SET_MINERAL",
                  "phosphorus",
                  e.target.value
                )
              }
            />
            <TextField
              type="number"
              label="Potassium (mg)"
              value={nutrients.potassium ?? ""}
              onChange={(e) =>
                handleNutrientChange("SET_MINERAL", "potassium", e.target.value)
              }
            />
            <TextField
              type="number"
              label="Sodium (mg)"
              value={nutrients.sodium ?? ""}
              onChange={(e) =>
                handleNutrientChange("SET_MINERAL", "sodium", e.target.value)
              }
            />
            <TextField
              type="number"
              label="Zinc (mg)"
              value={nutrients.zinc ?? ""}
              onChange={(e) =>
                handleNutrientChange("SET_MINERAL", "zinc", e.target.value)
              }
            />
            <TextField
              type="number"
              label="Copper (mg)"
              value={nutrients.copper ?? ""}
              onChange={(e) =>
                handleNutrientChange("SET_MINERAL", "copper", e.target.value)
              }
            />
            <TextField
              type="number"
              label="Manganese (mg)"
              value={nutrients.manganese ?? ""}
              onChange={(e) =>
                handleNutrientChange("SET_MINERAL", "manganese", e.target.value)
              }
            />
            <TextField
              type="number"
              label="Selenium (mcg)"
              value={nutrients.selenium ?? ""}
              onChange={(e) =>
                handleNutrientChange("SET_MINERAL", "selenium", e.target.value)
              }
            />
            <TextField
              type="number"
              label="Chromium (mcg)"
              value={nutrients.chromium ?? ""}
              onChange={(e) =>
                handleNutrientChange("SET_MINERAL", "chromium", e.target.value)
              }
            />
            <TextField
              type="number"
              label="Molybdenum (mcg)"
              value={nutrients.molybdenum ?? ""}
              onChange={(e) =>
                handleNutrientChange(
                  "SET_MINERAL",
                  "molybdenum",
                  e.target.value
                )
              }
            />
            <TextField
              type="number"
              label="Iodine (mcg)"
              value={nutrients.iodine ?? ""}
              onChange={(e) =>
                handleNutrientChange("SET_MINERAL", "iodine", e.target.value)
              }
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button onClick={handleEditSubmit} variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
