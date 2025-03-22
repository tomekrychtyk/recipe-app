import { useState } from "react";
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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import {
  useGetIngredientsQuery,
  useDeleteIngredientMutation,
  useUpdateIngredientMutation,
} from "../../store/api/ingredients";
import { FOOD_CATEGORIES } from "@food-recipe-app/common/src/constants/categories";
import type { FoodCategory } from "@food-recipe-app/common/src/constants/categories";
import { EditIngredientModal } from "../../components/EditIngredientModal";
import { Ingredient } from "@food-recipe-app/common";

type SortField =
  | "name"
  | "categoryId"
  | "proteins"
  | "carbs"
  | "fats"
  | "calories";
type SortOrder = "asc" | "desc";

export function Ingredients() {
  const { data: ingredients = [], isLoading, error } = useGetIngredientsQuery();
  const [deleteIngredient, { isLoading: isDeleting }] =
    useDeleteIngredientMutation();
  const [editIngredient, setEditIngredient] = useState<Ingredient | null>(null);
  const [updateIngredient, { isLoading: isUpdating, error: updateError }] =
    useUpdateIngredientMutation();

  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<FoodCategory | "">("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

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

  const handleEditClick = (ingredient: Ingredient) => {
    setEditIngredient(ingredient);
  };

  const handleEditSave = async (updatedIngredient: Ingredient) => {
    try {
      await updateIngredient(updatedIngredient).unwrap();
      setEditIngredient(null);
    } catch (error) {
      console.error("Failed to update ingredient:", error);
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
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        🥗 Ingredients
      </Typography>

      <Box sx={{ mb: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
        <TextField
          placeholder="Search ingredients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />
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

      {editIngredient && (
        <EditIngredientModal
          open={true}
          onClose={() => setEditIngredient(null)}
          ingredient={editIngredient}
          onSave={handleEditSave}
          isLoading={isUpdating}
          error={
            updateError && "data" in updateError
              ? (updateError.data as { errors?: string[] })?.errors
              : undefined
          }
        />
      )}
    </Box>
  );
}
