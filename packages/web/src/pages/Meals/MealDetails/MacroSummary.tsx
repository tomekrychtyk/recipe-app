import { Meal } from "@food-recipe-app/common";
import { Box, Paper, Typography } from "@mui/material";

interface MacroSummaryProps {
  meal: Meal;
  portions: number;
}

export const MacroSummary = ({ meal, portions = 1 }: MacroSummaryProps) => {
  // Scale nutrients by portions
  const scaledNutrients = {
    proteins: meal.totalNutrients.proteins * portions,
    carbs: meal.totalNutrients.carbs * portions,
    fats: meal.totalNutrients.fats * portions,
    calories: meal.totalNutrients.calories * portions,
  };

  return (
    <Paper sx={{ mb: 4 }}>
      <Box
        sx={{
          p: 2,
          display: "flex",
          gap: 2,
          justifyContent: "space-around",
          flexWrap: {
            xs: "wrap",
            md: "nowrap",
          },
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h6">
            {scaledNutrients.proteins.toFixed(1)}g
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Białko
          </Typography>
        </Box>
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h6">
            {scaledNutrients.carbs.toFixed(1)}g
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Węglowodany
          </Typography>
        </Box>
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h6">
            {scaledNutrients.fats.toFixed(1)}g
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Tłuszcze
          </Typography>
        </Box>
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h6">
            {scaledNutrients.calories.toFixed(1)} kcal
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Kalorie
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};
