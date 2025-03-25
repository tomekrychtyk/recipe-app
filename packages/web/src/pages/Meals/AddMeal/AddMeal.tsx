import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Autocomplete,
  IconButton,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  MenuItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAddMealMutation } from "@/store/api/meals";
import { useGetIngredientsQuery } from "@/store/api/ingredients";
import type { Ingredient, MealCategory } from "@food-recipe-app/common";
import { MEAL_CATEGORIES } from "@food-recipe-app/common";
import { useAuth } from "@/contexts/AuthContext";

interface SelectedIngredient {
  ingredient: Ingredient;
  amount: number;
}

export function AddMeal() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [addMeal, { isLoading, error }] = useAddMealMutation();
  const { data: ingredients = [] } = useGetIngredientsQuery();

  const [categoryId, setCategoryId] = useState<MealCategory>(
    MEAL_CATEGORIES[0].id
  );
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedIngredients, setSelectedIngredients] = useState<
    SelectedIngredient[]
  >([]);
  const [currentIngredient, setCurrentIngredient] = useState<Ingredient | null>(
    null
  );
  const [currentAmount, setCurrentAmount] = useState("");

  const handleAddIngredient = () => {
    if (currentIngredient && currentAmount && Number(currentAmount) > 0) {
      setSelectedIngredients((prev) => [
        ...prev,
        { ingredient: currentIngredient, amount: Number(currentAmount) },
      ]);
      setCurrentIngredient(null);
      setCurrentAmount("");
    }
  };

  const handleRemoveIngredient = (index: number) => {
    setSelectedIngredients((prev) => prev.filter((_, i) => i !== index));
  };

  const calculateTotalNutrients = () => {
    return selectedIngredients.reduce(
      (acc, { ingredient, amount }) => {
        const multiplier = amount / 100;
        return {
          proteins: acc.proteins + ingredient.proteins * multiplier,
          carbs: acc.carbs + ingredient.carbs * multiplier,
          fats: acc.fats + ingredient.fats * multiplier,
          calories: acc.calories + ingredient.calories * multiplier,
        };
      },
      { proteins: 0, carbs: 0, fats: 0, calories: 0 }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIngredients.length === 0) {
      alert("Please add at least one ingredient");
      return;
    }

    try {
      await addMeal({
        name,
        description,
        ingredients: selectedIngredients.map(({ ingredient, amount }) => ({
          ingredientId: ingredient.id,
          amount,
        })),
        categoryId,
        userId: user?.id,
      }).unwrap();

      navigate("/my-meals");
    } catch (error) {
      console.error("Failed to create meal:", error);
    }
  };

  const totalNutrients = calculateTotalNutrients();

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          🍳 Skomponuj przepis
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Nie udało się stworzyć przepisu
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Nazwa przepisu"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            sx={{ mb: 2 }}
          />

          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            <Autocomplete
              value={currentIngredient}
              onChange={(_, newValue) => setCurrentIngredient(newValue)}
              options={ingredients}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <TextField {...params} label="Wybierz składnik" />
              )}
              sx={{ flexGrow: 1 }}
            />
            <TextField
              label="Ilość (g)"
              type="number"
              value={currentAmount}
              onChange={(e) => setCurrentAmount(e.target.value)}
              sx={{ width: 150 }}
            />
            <Button
              variant="contained"
              onClick={handleAddIngredient}
              disabled={!currentIngredient || !currentAmount}
            >
              Add
            </Button>
          </Box>

          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            <TextField
              fullWidth
              select
              label="Kategoria"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value as MealCategory)}
              required
            >
              {MEAL_CATEGORIES.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          {selectedIngredients.length > 0 && (
            <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Składnik</TableCell>
                    <TableCell align="right">Ilość (g)</TableCell>
                    <TableCell align="right">Białko (g)</TableCell>
                    <TableCell align="right">Węglowodany (g)</TableCell>
                    <TableCell align="right">Tłuszcze (g)</TableCell>
                    <TableCell align="right">Kalorie (kcal)</TableCell>
                    <TableCell align="right">Akcje</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedIngredients.map(({ ingredient, amount }, index) => {
                    const multiplier = amount / 100;
                    return (
                      <TableRow key={index}>
                        <TableCell>{ingredient.name}</TableCell>
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
                        <TableCell align="right">
                          <IconButton
                            onClick={() => handleRemoveIngredient(index)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  <TableRow>
                    <TableCell>
                      <strong>Total</strong>
                    </TableCell>
                    <TableCell align="right">-</TableCell>
                    <TableCell align="right">
                      <strong>{totalNutrients.proteins.toFixed(1)}</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>{totalNutrients.carbs.toFixed(1)}</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>{totalNutrients.fats.toFixed(1)}</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>{totalNutrients.calories.toFixed(1)}</strong>
                    </TableCell>
                    <TableCell />
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          )}
          <TextField
            fullWidth
            label="Opis przepisu"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={2}
            sx={{ mb: 3 }}
          />
          <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
            <Button onClick={() => navigate(-1)}>Anuluj</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading || !name || selectedIngredients.length === 0}
            >
              {isLoading ? <CircularProgress size={24} /> : "Zapisz przepis"}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}
