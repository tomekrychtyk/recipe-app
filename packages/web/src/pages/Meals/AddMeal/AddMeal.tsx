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
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  useAddMealMutation,
  useUploadMealImageMutation,
} from "@/store/api/meals";
import { useGetIngredientsQuery } from "@/store/api/ingredients";
import type { Ingredient, MealCategory } from "@food-recipe-app/common";
import { MEAL_CATEGORIES } from "@food-recipe-app/common";
import { useAuth } from "@/contexts/AuthContext";
import { styled } from "@mui/material/styles";

const VisuallyHiddenInput = styled("input")`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  left: 0;
  white-space: nowrap;
  width: 1px;
`;

interface SelectedIngredient {
  ingredient: Ingredient;
  amount: number;
}

type MealVisibility = "public" | "private";

export function AddMeal() {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [addMeal, { isLoading, error }] = useAddMealMutation();
  const [uploadMealImage] = useUploadMealImageMutation();
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
  const [thumbnailUrl, setThumbnailUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [visibility, setVisibility] = useState<MealVisibility>("private");
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const response = await uploadMealImage(formData).unwrap();
      setThumbnailUrl(response.url);
    } catch (error) {
      console.error("Failed to upload image:", error);
    } finally {
      setIsUploading(false);
    }
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
        userId: visibility === "private" ? user?.id : undefined,
        thumbnailUrl,
      }).unwrap();

      navigate(visibility === "public" ? "/meals" : "/my-meals");
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
          <Box sx={{ mb: 3 }}>
            <Button
              component="label"
              variant="outlined"
              startIcon={<CloudUploadIcon />}
              disabled={isUploading}
              sx={{ mb: 2 }}
            >
              {isUploading ? "Uploading..." : "Dodaj zdjęcie"}
              <VisuallyHiddenInput
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                ref={fileInputRef}
              />
            </Button>
            {thumbnailUrl && (
              <Box sx={{ mt: 2, textAlign: "center" }}>
                <img
                  src={thumbnailUrl}
                  alt="Meal thumbnail"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "200px",
                    objectFit: "cover",
                  }}
                />
              </Box>
            )}
          </Box>

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
            {isAdmin && (
              <FormControl fullWidth>
                <InputLabel>Widoczność</InputLabel>
                <Select
                  value={visibility}
                  label="Widoczność"
                  onChange={(e) =>
                    setVisibility(e.target.value as MealVisibility)
                  }
                >
                  <MenuItem value="private">Prywatny</MenuItem>
                  <MenuItem value="public">Publiczny</MenuItem>
                </Select>
              </FormControl>
            )}
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
