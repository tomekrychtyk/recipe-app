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
import EditIcon from "@mui/icons-material/Edit";
import { useGetMealsQuery, useDeleteMealMutation } from "../../store/api/meals";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { getMealCategoryName } from "@/utils/meals";

export function Meals() {
  const { data: meals = [], isLoading, error } = useGetMealsQuery();
  const [deleteMeal, { isLoading: isDeleting }] = useDeleteMealMutation();
  const navigate = useNavigate();
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
          🍽️ Przepisy
        </Typography>
        <Button
          variant="contained"
          color="primary"
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
                  Nie zostały dodane żadne przepisy.
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
