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
  Button,
  Chip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate, useParams } from "react-router-dom";
import { useGetMealByIdQuery } from "../../store/api/meals";
import { NutrientRDAGraph } from "../../components/NutrientRDAGraph";

export function MealDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: meal, isLoading, error } = useGetMealByIdQuery(parseInt(id!));

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !meal) {
    return (
      <Alert severity="error" sx={{ mt: 4 }}>
        Failed to load meal details
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            {meal.name}
          </Typography>
          {meal.description && (
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              {meal.description}
            </Typography>
          )}
        </Box>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/meals/${meal.id}/edit`)}
        >
          Edit Meal
        </Button>
      </Box>

      <Paper sx={{ mb: 4 }}>
        <Box
          sx={{ p: 2, display: "flex", gap: 2, justifyContent: "space-around" }}
        >
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h6">
              {meal.totalNutrients.proteins.toFixed(1)}g
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Proteins
            </Typography>
          </Box>
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h6">
              {meal.totalNutrients.carbs.toFixed(1)}g
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Carbs
            </Typography>
          </Box>
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h6">
              {meal.totalNutrients.fats.toFixed(1)}g
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Fats
            </Typography>
          </Box>
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h6">
              {meal.totalNutrients.calories.toFixed(1)} kcal
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Calories
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Typography variant="h5" component="h2" gutterBottom>
        Ingredients
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ingredient</TableCell>
              <TableCell align="right">Amount (g)</TableCell>
              <TableCell align="right">Proteins (g)</TableCell>
              <TableCell align="right">Carbs (g)</TableCell>
              <TableCell align="right">Fats (g)</TableCell>
              <TableCell align="right">Calories (kcal)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {meal.ingredients.map(({ ingredient, amount }) => {
              const multiplier = amount / 100;
              return (
                <TableRow key={ingredient.id}>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {ingredient.name}
                      <Chip
                        label={ingredient.categoryId}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  </TableCell>
                  <TableCell align="right">{amount}</TableCell>
                  <TableCell align="right">
                    {(ingredient.proteins * multiplier).toFixed(1)}
                  </TableCell>
                  <TableCell align="right">
                    {(ingredient.carbs * multiplier).toFixed(1)}
                  </TableCell>
                  <TableCell align="right">
                    {(ingredient.fats * multiplier).toFixed(1)}
                  </TableCell>
                  <TableCell align="right">
                    {(ingredient.calories * multiplier).toFixed(1)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ p: 3 }}>
        <NutrientRDAGraph totalNutrients={meal.totalNutrients} />
      </Box>
    </Box>
  );
}
