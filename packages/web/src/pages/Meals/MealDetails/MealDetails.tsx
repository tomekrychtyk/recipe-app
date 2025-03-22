import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate, useParams } from "react-router-dom";
import { useGetMealByIdQuery } from "../../../store/api/meals";
import { NutrientRDAGraph } from "../../../components/NutrientRDAGraph";
import { MacroSummary } from "./MacroSummary";
import { MealIngredients } from "./MealIngredients";

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
        Nie udało się załadować posiłku
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
          Edytuj przepis
        </Button>
      </Box>

      <MacroSummary meal={meal} />

      <Typography variant="h5" component="h2" gutterBottom>
        Składniki
      </Typography>

      <MealIngredients meal={meal} />

      <Box
        sx={{
          py: 3,
          px: {
            xs: 0,
            md: 12,
          },
        }}
      >
        <NutrientRDAGraph totalNutrients={meal.totalNutrients} />
      </Box>
    </Box>
  );
}
