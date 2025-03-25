import { useState, useMemo } from "react";
import { motion } from "framer-motion";
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
    <Box sx={{ p: 3, pt: 0 }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold mb-4 text-emerald-600">
          🧪 Inteligentny Dobór Posiłków 🍳
        </h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed"
        >
          Masz składniki, ale nie wiesz co ugotować? Pomożemy Ci znaleźć idealny
          posiłek! Po prostu wybierz składniki, które masz pod ręką, a my
          zaproponujemy pyszne przepisy, które możesz z nich przygotować. Koniec
          z marnowaniem jedzenia, czas na smaczne możliwości! ✨
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex items-center justify-center gap-2 text-sm text-gray-500 mt-4"
        >
          <span>🥕 Wybierz składniki</span>
          <span className="text-gray-400"> → </span>
          <span>📖 Znajdź przepisy</span>
          <span className="text-gray-400"> → </span>
          <span>🍽️ Zacznij gotować!</span>
        </motion.div>
      </motion.div>

      <Paper sx={{ p: 3, mb: 3, mt: 4 }}>
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
