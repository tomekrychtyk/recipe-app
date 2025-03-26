import { Box, Typography, Paper, Grid, CircularProgress } from "@mui/material";
import type { FoodDiaryEntryResponse } from "../types";
import { calculateDailyNutrition } from "../utils";

interface Props {
  entries: FoodDiaryEntryResponse[];
  isLoading?: boolean;
}

export function DailyNutritionSummary({ entries, isLoading = false }: Props) {
  if (isLoading) {
    return (
      <Paper sx={{ p: 2, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Paper>
    );
  }

  if (entries.length === 0) {
    return (
      <Paper sx={{ p: 2 }}>
        <Typography variant="body1" color="text.secondary" align="center">
          Brak wpisów na wybrany dzień
        </Typography>
      </Paper>
    );
  }

  const summary = calculateDailyNutrition(entries);

  return (
    <Paper sx={{ p: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Podsumowanie dnia
          </Typography>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h4" color="primary">
              {summary.calories}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Kalorie (kcal)
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h4" color="primary">
              {summary.proteins}g
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Białko
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h4" color="primary">
              {summary.carbs}g
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Węglowodany
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h4" color="primary">
              {summary.fats}g
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tłuszcze
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}
