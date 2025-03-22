import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  InputAdornment,
  Alert,
  Fade,
  CircularProgress,
  MenuItem,
} from "@mui/material";
import { useAddIngredientMutation } from "../../store/api/ingredients";
import { FOOD_CATEGORIES } from "@food-recipe-app/common/src/constants/categories";

export function AddIngredient() {
  const [addIngredient, { isLoading, error }] = useAddIngredientMutation();
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      await addIngredient({
        name: formData.get("name") as string,
        categoryId: formData.get("categoryId") as string,
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
    <Box
      sx={{
        maxWidth: 600,
        mx: "auto",
        mt: 4,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 2,
          border: "1px solid",
          borderColor: "primary.main",
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
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
            required
            fullWidth
            label="Ingredient Name"
            name="name"
            margin="normal"
            variant="outlined"
            disabled={isLoading}
          />

          <TextField
            required
            select
            fullWidth
            label="Category"
            name="categoryId"
            margin="normal"
            variant="outlined"
            disabled={isLoading}
            defaultValue=""
          >
            {FOOD_CATEGORIES.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </TextField>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 2,
              my: 2,
            }}
          >
            <TextField
              required
              type="number"
              label="Proteins"
              name="proteins"
              disabled={isLoading}
              InputProps={{
                endAdornment: <InputAdornment position="end">g</InputAdornment>,
              }}
            />

            <TextField
              required
              type="number"
              label="Carbs"
              name="carbs"
              disabled={isLoading}
              InputProps={{
                endAdornment: <InputAdornment position="end">g</InputAdornment>,
              }}
            />

            <TextField
              required
              type="number"
              label="Fats"
              name="fats"
              disabled={isLoading}
              InputProps={{
                endAdornment: <InputAdornment position="end">g</InputAdornment>,
              }}
            />

            <TextField
              required
              type="number"
              label="Calories"
              name="calories"
              disabled={isLoading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">kcal</InputAdornment>
                ),
              }}
            />
          </Box>

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={isLoading}
            sx={{
              mt: 3,
              height: 48,
              background: "linear-gradient(45deg, #FFD700 30%, #FFA500 90%)",
              "&:hover": {
                background: "linear-gradient(45deg, #FFA500 30%, #FFD700 90%)",
              },
            }}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Add Ingredient"
            )}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
