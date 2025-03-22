import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Fade,
  CircularProgress,
  MenuItem,
  Divider,
} from "@mui/material";
import { useAddIngredientMutation } from "../../store/api/ingredients";
import {
  FOOD_CATEGORIES,
  FoodCategory,
} from "@food-recipe-app/common/src/constants/categories";
import { useNavigate } from "react-router-dom";

export function AddIngredient() {
  const [addIngredient, { isLoading, error }] = useAddIngredientMutation();
  const [success, setSuccess] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [proteins, setProteins] = useState(0);
  const [carbs, setCarbs] = useState(0);
  const [fats, setFats] = useState(0);
  const [calories, setCalories] = useState(0);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      await addIngredient({
        name: formData.get("name") as string,
        categoryId: formData.get("categoryId") as FoodCategory,
        proteins: Number(formData.get("proteins")),
        carbs: Number(formData.get("carbs")),
        fats: Number(formData.get("fats")),
        calories: Number(formData.get("calories")),
      }).unwrap();

      setSuccess(true);
      event.currentTarget.reset();
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to add ingredient:", error);
    }
  };

  const errorMessages = error
    ? "data" in error
      ? (error.data as { errors?: string[] })?.errors || ["An error occurred"]
      : ["An error occurred"]
    : [];

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          🥗 Add New Ingredient
        </Typography>

        {success && (
          <Fade in={success}>
            <Alert severity="success" sx={{ mb: 2 }}>
              Ingredient added successfully!
            </Alert>
          </Fade>
        )}

        {errorMessages.length > 0 && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessages.map((message, index) => (
              <div key={index}>{message}</div>
            ))}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            sx={{ mb: 2 }}
          />

          <TextField
            select
            fullWidth
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            sx={{ mb: 2 }}
          >
            {FOOD_CATEGORIES.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
              </MenuItem>
            ))}
          </TextField>

          <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
            Macronutrients (per 100g)
          </Typography>
          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            <TextField
              type="number"
              label="Proteins (g)"
              value={proteins}
              onChange={(e) => setProteins(Number(e.target.value))}
              required
              fullWidth
            />
            <TextField
              type="number"
              label="Carbs (g)"
              value={carbs}
              onChange={(e) => setCarbs(Number(e.target.value))}
              required
              fullWidth
            />
            <TextField
              type="number"
              label="Fats (g)"
              value={fats}
              onChange={(e) => setFats(Number(e.target.value))}
              required
              fullWidth
            />
            <TextField
              type="number"
              label="Calories (kcal)"
              value={calories}
              onChange={(e) => setCalories(Number(e.target.value))}
              required
              fullWidth
            />
          </Box>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h6" sx={{ mb: 2 }}>
            Vitamins (per 100g)
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 2,
              mb: 4,
            }}
          >
            <TextField type="number" label="Vitamin A (mcg)" />
            <TextField type="number" label="Vitamin D (mcg)" />
            <TextField type="number" label="Vitamin E (mg)" />
            <TextField type="number" label="Vitamin K (mcg)" />
            <TextField type="number" label="Vitamin C (mg)" />
            <TextField type="number" label="Thiamin (B1) (mg)" />
            <TextField type="number" label="Riboflavin (B2) (mg)" />
            <TextField type="number" label="Niacin (B3) (mg)" />
            <TextField type="number" label="Pantothenic Acid (B5) (mg)" />
            <TextField type="number" label="Vitamin B6 (mg)" />
            <TextField type="number" label="Biotin (B7) (mcg)" />
            <TextField type="number" label="Folate (B9) (mcg)" />
            <TextField type="number" label="Vitamin B12 (mcg)" />
          </Box>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h6" sx={{ mb: 2 }}>
            Minerals (per 100g)
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 2,
              mb: 4,
            }}
          >
            <TextField type="number" label="Calcium (mg)" />
            <TextField type="number" label="Iron (mg)" />
            <TextField type="number" label="Magnesium (mg)" />
            <TextField type="number" label="Phosphorus (mg)" />
            <TextField type="number" label="Potassium (mg)" />
            <TextField type="number" label="Sodium (mg)" />
            <TextField type="number" label="Zinc (mg)" />
            <TextField type="number" label="Copper (mg)" />
            <TextField type="number" label="Manganese (mg)" />
            <TextField type="number" label="Selenium (mcg)" />
            <TextField type="number" label="Chromium (mcg)" />
            <TextField type="number" label="Molybdenum (mcg)" />
            <TextField type="number" label="Iodine (mcg)" />
          </Box>

          <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
            <Button onClick={() => navigate("/ingredients")}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={isLoading}>
              {isLoading ? <CircularProgress size={24} /> : "Add Ingredient"}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}
