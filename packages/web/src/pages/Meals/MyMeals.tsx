import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useGetMealsQuery, useDeleteMealMutation } from "../../store/api/meals";
import { useAuth } from "../../contexts/AuthContext";
import { useState } from "react";
import { getMealCategoryName } from "@/utils/meals";
import { MEAL_CATEGORIES, type MealCategory } from "@food-recipe-app/common";

export function MyMeals() {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const {
    data: meals = [],
    isLoading,
    error,
  } = useGetMealsQuery({ userId: user?.id });
  const [deleteMeal, { isLoading: isDeleting }] = useDeleteMealMutation();
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

  const formatNutrient = (value: number) => value.toFixed(1);

  const filteredMeals =
    selectedCategory === "all"
      ? meals
      : meals.filter((meal) => meal.categoryId === selectedCategory);

  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Ładowanie...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">Nie udało się załadować przepisów</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4" component="h1">
          👨‍🍳 Moje przepisy
        </Typography>
        {isAdmin && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/meals/new")}
          >
            Dodaj przepis
          </Button>
        )}
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

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nazwa</TableCell>
              <TableCell align="right">Białko (g)</TableCell>
              <TableCell align="right">Kategoria</TableCell>
              <TableCell align="right">Węglowodany (g)</TableCell>
              <TableCell align="right">Tłuszcze (g)</TableCell>
              <TableCell align="right">Kalorie (kcal)</TableCell>
              <TableCell align="right">Akcje</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredMeals.map((meal) => (
              <TableRow
                key={meal.id}
                hover
                sx={{ cursor: "pointer" }}
                onClick={() => navigate(`/meals/${meal.id}`)}
              >
                <TableCell component="th" scope="row">
                  <Typography variant="body1">{meal.name}</Typography>
                  {meal.description && (
                    <Typography variant="body2" color="text.secondary">
                      {meal.description}
                    </Typography>
                  )}
                </TableCell>
                <TableCell align="right">
                  {formatNutrient(meal.totalNutrients.proteins)}
                </TableCell>
                <TableCell align="right">
                  {getMealCategoryName(meal.categoryId)}
                </TableCell>
                <TableCell align="right">
                  {formatNutrient(meal.totalNutrients.carbs)}
                </TableCell>
                <TableCell align="right">
                  {formatNutrient(meal.totalNutrients.fats)}
                </TableCell>
                <TableCell align="right">
                  {formatNutrient(meal.totalNutrients.calories)}
                </TableCell>
                <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                  {isAdmin ? (
                    <>
                      <IconButton
                        onClick={() => navigate(`/meals/${meal.id}/edit`)}
                        color="primary"
                        sx={{ mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteClick(meal.id)}
                        disabled={isDeleting}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </>
                  ) : (
                    <IconButton
                      onClick={() => navigate(`/meals/${meal.id}`)}
                      color="primary"
                    >
                      <VisibilityIcon />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {filteredMeals.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Box sx={{ py: 4 }}>
                    <Typography
                      variant="h6"
                      color="text.secondary"
                      gutterBottom
                    >
                      {selectedCategory === "all"
                        ? "Nie masz jeszcze żadnych przepisów"
                        : "Brak przepisów w wybranej kategorii"}
                    </Typography>
                    {isAdmin && (
                      <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate("/meals/new")}
                        sx={{ mt: 2 }}
                      >
                        Dodaj swój pierwszy przepis
                      </Button>
                    )}
                  </Box>
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
        <DialogTitle>Potwierdzenie usunięcia</DialogTitle>
        <DialogContent>Czy na pewno chcesz usunąć ten posiłek?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmId(null)}>Anuluj</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Usuń
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
