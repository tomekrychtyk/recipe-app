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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useGetMealsQuery, useDeleteMealMutation } from "../../store/api/meals";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { getMealCategoryName } from "@/utils/meals";
import { useAuth } from "@/contexts/AuthContext";
import {
  MEAL_CATEGORIES,
  type MealCategory,
  type Meal,
} from "@food-recipe-app/common";
import { MealThumbnail } from "@/components/MealThumbnail/MealThumbnail";

export function MyMeals() {
  const { user } = useAuth();
  const {
    data: meals = [],
    isLoading,
    error,
  } = useGetMealsQuery({ userId: user?.id });
  const [deleteMeal, { isLoading: isDeleting }] = useDeleteMealMutation();
  const navigate = useNavigate();
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<
    MealCategory | "all"
  >("all");

  const handleDeleteClick = (id: number) => {
    setDeleteConfirmId(id);
  };

  const handleDeleteConfirm = async () => {
    if (deleteConfirmId) {
      try {
        await deleteMeal(deleteConfirmId).unwrap();
      } catch (error) {
        console.error("Failed to delete meal:", error);
      }
      setDeleteConfirmId(null);
    }
  };

  const filteredMeals =
    selectedCategory === "all"
      ? meals
      : meals.filter((meal) => meal.categoryId === selectedCategory);

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
        Nie udało się załadować posiłków
      </Alert>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Typography variant="h4" component="h1">
            🍳 Moje przepisy
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/meals/new")}
          >
            Dodaj przepis
          </Button>
        </Box>

        <Box sx={{ mb: 3 }}>
          <TextField
            select
            label="Kategoria"
            value={selectedCategory}
            onChange={(e) =>
              setSelectedCategory(e.target.value as MealCategory | "all")
            }
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="all">Wszystkie kategorie</MenuItem>
            {MEAL_CATEGORIES.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Zdjęcie</TableCell>
                <TableCell>Nazwa</TableCell>
                <TableCell>Kategoria</TableCell>
                <TableCell>Kalorie</TableCell>
                <TableCell>Białko</TableCell>
                <TableCell>Węglowodany</TableCell>
                <TableCell>Tłuszcze</TableCell>
                <TableCell>Akcje</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredMeals.map((meal) => (
                <TableRow key={meal.id}>
                  <TableCell>
                    <MealThumbnail
                      thumbnailUrl={meal.thumbnailUrl}
                      alt={meal.name}
                    />
                  </TableCell>
                  <TableCell>{meal.name}</TableCell>
                  <TableCell>{getMealCategoryName(meal.categoryId)}</TableCell>
                  <TableCell>
                    {meal.totalNutrients.calories.toFixed(1)}
                  </TableCell>
                  <TableCell>
                    {meal.totalNutrients.proteins.toFixed(1)}
                  </TableCell>
                  <TableCell>{meal.totalNutrients.carbs.toFixed(1)}</TableCell>
                  <TableCell>{meal.totalNutrients.fats.toFixed(1)}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => navigate(`/meals/${meal.id}`)}
                      color="primary"
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => navigate(`/meals/${meal.id}/edit`)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteClick(meal.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog
          open={deleteConfirmId !== null}
          onClose={() => setDeleteConfirmId(null)}
        >
          <DialogTitle>Potwierdzenie usunięcia</DialogTitle>
          <DialogContent>Czy na pewno chcesz usunąć ten posiłek?</DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteConfirmId(null)}>Anuluj</Button>
            <Button
              onClick={handleDeleteConfirm}
              color="error"
              variant="contained"
              disabled={isDeleting}
            >
              Usuń
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Box>
  );
}
