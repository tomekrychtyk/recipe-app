import { useMemo } from "react";
import { Grid, Card, CardContent, Typography, Box } from "@mui/material";
import {
  RestaurantMenu,
  LocalFireDepartment,
  Scale,
  Spa,
} from "@mui/icons-material";

interface NutritionSummaryCardsProps {
  entries: any[];
  timeRange: "day" | "week" | "month";
}

export function NutritionSummaryCards({
  entries,
  timeRange,
}: NutritionSummaryCardsProps) {
  const summaryData = useMemo(() => {
    // Calculate total nutrients from all entries
    const totalNutrients = entries.reduce(
      (acc, entry) => {
        // Calculate nutrients for the entry
        const calculateEntryNutrients = (entry: any) => {
          let totalProteins = 0;
          let totalCarbs = 0;
          let totalFats = 0;
          let totalCalories = 0;

          if (entry.meal) {
            totalProteins += entry.meal.totalNutrients.proteins;
            totalCarbs += entry.meal.totalNutrients.carbs;
            totalFats += entry.meal.totalNutrients.fats;
            totalCalories += entry.meal.totalNutrients.calories;
          } else if (entry.ingredients && entry.ingredients.length > 0) {
            entry.ingredients.forEach((ingredient: any) => {
              // Calculate based on weight per 100g
              const multiplier = ingredient.amount / 100;
              totalProteins += ingredient.ingredient.proteins * multiplier;
              totalCarbs += ingredient.ingredient.carbs * multiplier;
              totalFats += ingredient.ingredient.fats * multiplier;
              totalCalories += ingredient.ingredient.calories * multiplier;
            });
          }

          return {
            proteins: totalProteins,
            carbs: totalCarbs,
            fats: totalFats,
            calories: totalCalories,
          };
        };

        const nutrients = calculateEntryNutrients(entry);

        return {
          proteins: acc.proteins + nutrients.proteins,
          carbs: acc.carbs + nutrients.carbs,
          fats: acc.fats + nutrients.fats,
          calories: acc.calories + nutrients.calories,
          meals: acc.meals + 1,
        };
      },
      { proteins: 0, carbs: 0, fats: 0, calories: 0, meals: 0 }
    );

    // Calculate average daily values
    let dayDivisor = 1;
    if (timeRange === "week") dayDivisor = 7;
    if (timeRange === "month") dayDivisor = 30;

    // Get unique dates count
    const uniqueDates = new Set(entries.map((entry) => entry.date)).size;
    dayDivisor = uniqueDates || 1;

    return {
      totalCalories: totalNutrients.calories,
      averageDailyCalories: totalNutrients.calories / dayDivisor,
      totalMeals: totalNutrients.meals,
      averageMealsPerDay: totalNutrients.meals / dayDivisor,
      macroRatio: {
        proteins: totalNutrients.proteins,
        carbs: totalNutrients.carbs,
        fats: totalNutrients.fats,
      },
      proteinsPercentage:
        ((totalNutrients.proteins * 4) /
          (totalNutrients.proteins * 4 +
            totalNutrients.carbs * 4 +
            totalNutrients.fats * 9)) *
          100 || 0,
      carbsPercentage:
        ((totalNutrients.carbs * 4) /
          (totalNutrients.proteins * 4 +
            totalNutrients.carbs * 4 +
            totalNutrients.fats * 9)) *
          100 || 0,
      fatsPercentage:
        ((totalNutrients.fats * 9) /
          (totalNutrients.proteins * 4 +
            totalNutrients.carbs * 4 +
            totalNutrients.fats * 9)) *
          100 || 0,
    };
  }, [entries, timeRange]);

  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      <Grid item xs={12} sm={6} md={3}>
        <Card elevation={2} sx={{ height: "100%" }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <LocalFireDepartment sx={{ color: "primary.main", mr: 1 }} />
              <Typography variant="h6" component="div">
                Kalorie
              </Typography>
            </Box>
            <Typography variant="h4" component="div" gutterBottom>
              {Math.round(summaryData.totalCalories)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Średnio {Math.round(summaryData.averageDailyCalories)} kcal/dzień
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card elevation={2} sx={{ height: "100%" }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <RestaurantMenu sx={{ color: "primary.main", mr: 1 }} />
              <Typography variant="h6" component="div">
                Posiłki
              </Typography>
            </Box>
            <Typography variant="h4" component="div" gutterBottom>
              {summaryData.totalMeals}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Średnio {summaryData.averageMealsPerDay.toFixed(1)} posiłków/dzień
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card elevation={2} sx={{ height: "100%" }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Scale sx={{ color: "primary.main", mr: 1 }} />
              <Typography variant="h6" component="div">
                Makroskładniki
              </Typography>
            </Box>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography variant="body2" fontWeight="bold">
                B:
              </Typography>
              <Typography variant="body2">
                {summaryData.macroRatio.proteins.toFixed(1)}g (
                {Math.round(summaryData.proteinsPercentage)}%)
              </Typography>
            </Box>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography variant="body2" fontWeight="bold">
                W:
              </Typography>
              <Typography variant="body2">
                {summaryData.macroRatio.carbs.toFixed(1)}g (
                {Math.round(summaryData.carbsPercentage)}%)
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body2" fontWeight="bold">
                T:
              </Typography>
              <Typography variant="body2">
                {summaryData.macroRatio.fats.toFixed(1)}g (
                {Math.round(summaryData.fatsPercentage)}%)
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card elevation={2} sx={{ height: "100%" }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Spa sx={{ color: "primary.main", mr: 1 }} />
              <Typography variant="h6" component="div">
                Bilans
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Box
                sx={{
                  width: "100%",
                  height: 20,
                  bgcolor: "background.paper",
                  borderRadius: 1,
                  overflow: "hidden",
                  display: "flex",
                }}
              >
                <Box
                  sx={{
                    width: `${summaryData.proteinsPercentage}%`,
                    bgcolor: "primary.main",
                    height: "100%",
                  }}
                />
                <Box
                  sx={{
                    width: `${summaryData.carbsPercentage}%`,
                    bgcolor: "secondary.main",
                    height: "100%",
                  }}
                />
                <Box
                  sx={{
                    width: `${summaryData.fatsPercentage}%`,
                    bgcolor: "warning.main",
                    height: "100%",
                  }}
                />
              </Box>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {summaryData.proteinsPercentage > 30
                ? "Wysoki poziom białka"
                : summaryData.carbsPercentage > 50
                  ? "Dieta bogata w węglowodany"
                  : summaryData.fatsPercentage > 35
                    ? "Wysoki poziom tłuszczu"
                    : "Zbalansowana dieta"}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
