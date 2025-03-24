import { useState, useMemo } from "react";
import {
  Box,
  Paper,
  Typography,
  Autocomplete,
  TextField,
  Card,
  CardContent,
  Chip,
  Stack,
  Button,
  Grid,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useGetIngredientsQuery } from "../../store/api/ingredients";
import { useGetMealsQuery } from "../../store/api/meals";
import { Ingredient } from "@food-recipe-app/common";

export function MealSuggestions() {
  const { data: ingredients = [] } = useGetIngredientsQuery();
  const { data: meals = [] } = useGetMealsQuery();
  const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>(
    []
  );

  const suggestedMeals = useMemo(() => {
    const selectedIds = new Set(selectedIngredients.map((ing) => ing.id));

    return meals
      .map((meal) => {
        const mealIngredientIds = new Set(
          meal.ingredients.map((ing) => ing.ingredientId)
        );

        // Calculate how many ingredients from the meal we can make with selected ingredients
        const matchingIngredientsCount = Array.from(mealIngredientIds).filter(
          (id) => selectedIds.has(id)
        ).length;

        // Calculate what percentage of the meal's ingredients we have
        const matchPercentage =
          (matchingIngredientsCount / mealIngredientIds.size) * 100;

        return {
          ...meal,
          matchPercentage,
          missingIngredients: meal.ingredients
            .filter((ing) => !selectedIds.has(ing.ingredientId))
            .map(
              (ing) => ingredients.find((i) => i.id === ing.ingredientId)?.name
            )
            .filter(Boolean),
        };
      })
      .filter((meal) => meal.matchPercentage > 0) // Only show meals with at least one matching ingredient
      .sort((a, b) => b.matchPercentage - a.matchPercentage); // Sort by match percentage
  }, [meals, selectedIngredients, ingredients]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Sugestie posiłków
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Wybierz dostępne składniki:
        </Typography>

        <Autocomplete
          multiple
          options={ingredients}
          getOptionLabel={(option) => option.name}
          value={selectedIngredients}
          onChange={(_, newValue) => setSelectedIngredients(newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label="Składniki"
              placeholder="Wybierz składniki"
            />
          )}
          sx={{ mb: 2 }}
        />

        <Typography variant="body2" color="text.secondary">
          Wybrano {selectedIngredients.length} składników
        </Typography>
      </Paper>

      {suggestedMeals.length > 0 ? (
        <Grid container spacing={3}>
          {suggestedMeals.map((meal) => (
            <Grid item xs={12} md={6} lg={4} key={meal.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {meal.name}
                  </Typography>

                  <Typography variant="body1" color="primary" gutterBottom>
                    Dopasowanie: {Math.round(meal.matchPercentage)}%
                  </Typography>

                  {meal.missingIngredients.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Brakujące składniki:
                      </Typography>
                      <Stack
                        direction="row"
                        spacing={1}
                        flexWrap="wrap"
                        gap={1}
                      >
                        {meal.missingIngredients.map((ing, idx) => (
                          <Chip
                            key={idx}
                            label={ing}
                            size="small"
                            color="error"
                            variant="outlined"
                          />
                        ))}
                      </Stack>
                    </Box>
                  )}

                  <Button
                    component={Link}
                    to={`/meals/${meal.id}`}
                    variant="outlined"
                    sx={{ mt: 2 }}
                    fullWidth
                  >
                    Zobacz szczegóły
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body1" color="text.secondary" align="center">
          {selectedIngredients.length === 0
            ? "Wybierz składniki, aby zobaczyć sugestie posiłków"
            : "Nie znaleziono pasujących posiłków"}
        </Typography>
      )}
    </Box>
  );
}
