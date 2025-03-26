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
                    {meal.thumbnailUrl && (
                      <img
                        src={meal.thumbnailUrl}
                        alt={meal.name}
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                          borderRadius: "4px",
                        }}
                      />
                    )}
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
