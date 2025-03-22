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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useGetMealsQuery, useDeleteMealMutation } from "../../store/api/meals";
import { useNavigate } from "react-router-dom";

export function Meals() {
  const { data: meals = [], isLoading, error } = useGetMealsQuery();
  const [deleteMeal, { isLoading: isDeleting }] = useDeleteMealMutation();
  const navigate = useNavigate();

  const handleDeleteClick = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this meal?")) {
      try {
        await deleteMeal(id).unwrap();
      } catch (error) {
        console.error("Failed to delete meal:", error);
      }
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
        Failed to load meals
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
          🍽️ Meals
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/meals/new")}
        >
          Add New Meal
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Proteins (g)</TableCell>
              <TableCell align="right">Carbs (g)</TableCell>
              <TableCell align="right">Fats (g)</TableCell>
              <TableCell align="right">Calories (kcal)</TableCell>
              <TableCell align="right">Actions</TableCell>
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
                  No meals found. Add some!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
