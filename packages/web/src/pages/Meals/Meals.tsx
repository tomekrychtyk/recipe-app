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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useGetMealsQuery, useDeleteMealMutation } from "../../store/api/meals";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { getMealCategoryName } from "@/utils/meals";
import { useAuth } from "@/contexts/AuthContext";
import { type MealCategory } from "@food-recipe-app/common";
import { MealThumbnail } from "@/components/MealThumbnail/MealThumbnail";

export function Meals() {
  const {
    data: meals = [],
    isLoading,
    error,
  } = useGetMealsQuery({ publicOnly: true });
  const [deleteMeal, { isLoading: isDeleting }] = useDeleteMealMutation();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [selectedCategory] = useState<MealCategory | "all">("all");

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
        <Typography variant="h4" component="h1" gutterBottom>
          🍽️ Przepisy
        </Typography>

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
                    {isAdmin && (
                      <IconButton
                        onClick={() => handleDeleteClick(meal.id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
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
