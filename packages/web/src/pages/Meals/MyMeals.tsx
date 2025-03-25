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
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useGetMealsQuery, useDeleteMealMutation } from "../../store/api/meals";
import { useAuth } from "../../contexts/AuthContext";
import { useState } from "react";
import { getMealCategoryName } from "@/utils/meals";

export function MyMeals() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    data: meals = [],
    isLoading,
    error,
  } = useGetMealsQuery({ userId: user?.id });
  const [deleteMeal, { isLoading: isDeleting }] = useDeleteMealMutation();
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

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
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/meals/new")}
        >
          Dodaj przepis
        </Button>
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
            {meals.map((meal) => (
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
                </TableCell>
              </TableRow>
            ))}
            {meals.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Box sx={{ py: 4 }}>
                    <Typography
                      variant="h6"
                      color="text.secondary"
                      gutterBottom
                    >
                      Nie masz jeszcze żadnych przepisów
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => navigate("/meals/new")}
                      sx={{ mt: 2 }}
                    >
                      Dodaj swój pierwszy przepis
                    </Button>
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
