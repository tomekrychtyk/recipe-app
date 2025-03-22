import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  InputAdornment,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useState, useEffect } from "react";
import type { Ingredient } from "@food-recipe-app/common";
import { FOOD_CATEGORIES } from "@food-recipe-app/common/src/constants/categories";

interface EditIngredientModalProps {
  open: boolean;
  onClose: () => void;
  ingredient: Ingredient;
  onSave: (updatedIngredient: Ingredient) => Promise<void>;
  isLoading?: boolean;
  error?: string[];
}

export function EditIngredientModal({
  open,
  onClose,
  ingredient,
  onSave,
  isLoading,
  error,
}: EditIngredientModalProps) {
  const [formData, setFormData] = useState(ingredient);

  useEffect(() => {
    setFormData(ingredient);
  }, [ingredient]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "name" || name === "categoryId" ? value : Number(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Edit Ingredient</DialogTitle>
        <DialogContent>
          {error && error.length > 0 && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error.map((err, index) => (
                <div key={index}>{err}</div>
              ))}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
            required
            disabled={isLoading}
          />

          <TextField
            select
            fullWidth
            label="Category"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            margin="normal"
            required
            disabled={isLoading}
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
              mt: 2,
            }}
          >
            <TextField
              required
              type="number"
              label="Proteins"
              name="proteins"
              value={formData.proteins}
              onChange={handleChange}
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
              value={formData.carbs}
              onChange={handleChange}
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
              value={formData.fats}
              onChange={handleChange}
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
              value={formData.calories}
              onChange={handleChange}
              disabled={isLoading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">kcal</InputAdornment>
                ),
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isLoading}>
            {isLoading ? <CircularProgress size={24} /> : "Save Changes"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
