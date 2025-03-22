import { Meal } from "@food-recipe-app/common";
import { Box, Paper, Typography } from "@mui/material";

export const MacroSummary = ({ meal }: { meal: Meal }) => (
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
          {meal.totalNutrients.proteins.toFixed(1)}g
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Białko
        </Typography>
      </Box>
      <Box sx={{ textAlign: "center" }}>
        <Typography variant="h6">
          {meal.totalNutrients.carbs.toFixed(1)}g
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Węglowodany
        </Typography>
      </Box>
      <Box sx={{ textAlign: "center" }}>
        <Typography variant="h6">
          {meal.totalNutrients.fats.toFixed(1)}g
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Tłuszcze
        </Typography>
      </Box>
      <Box sx={{ textAlign: "center" }}>
        <Typography variant="h6">
          {meal.totalNutrients.calories.toFixed(1)} kcal
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Kalorie
        </Typography>
      </Box>
    </Box>
  </Paper>
);
