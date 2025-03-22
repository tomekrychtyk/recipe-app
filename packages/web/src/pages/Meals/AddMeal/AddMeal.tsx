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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAddMealMutation } from "../../../store/api/meals";
import { useGetIngredientsQuery } from "../../../store/api/ingredients";
import type { Ingredient } from "@food-recipe-app/common";

interface SelectedIngredient {
  ingredient: Ingredient;
  amount: number;
}

export function AddMeal() {
  const navigate = useNavigate();
  const [addMeal, { isLoading, error }] = useAddMealMutation();
  const { data: ingredients = [] } = useGetIngredientsQuery();

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
      }).unwrap();

      navigate("/meals");
    } catch (error) {
      console.error("Failed to create meal:", error);
    }
  };

  const totalNutrients = calculateTotalNutrients();

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          🍳 Create New Meal
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Failed to create meal
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Meal Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={2}
            sx={{ mb: 3 }}
          />

          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            <Autocomplete
              value={currentIngredient}
              onChange={(_, newValue) => setCurrentIngredient(newValue)}
              options={ingredients}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <TextField {...params} label="Select Ingredient" />
              )}
              sx={{ flexGrow: 1 }}
            />
            <TextField
              label="Amount (g)"
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

          {selectedIngredients.length > 0 && (
            <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Ingredient</TableCell>
                    <TableCell align="right">Amount (g)</TableCell>
                    <TableCell align="right">Proteins (g)</TableCell>
                    <TableCell align="right">Carbs (g)</TableCell>
                    <TableCell align="right">Fats (g)</TableCell>
                    <TableCell align="right">Calories (kcal)</TableCell>
                    <TableCell align="right">Actions</TableCell>
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

          <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
            <Button onClick={() => navigate("/meals")}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading || !name || selectedIngredients.length === 0}
            >
              {isLoading ? <CircularProgress size={24} /> : "Create Meal"}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}
