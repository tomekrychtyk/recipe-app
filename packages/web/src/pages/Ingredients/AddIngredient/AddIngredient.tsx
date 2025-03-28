import { useState, useReducer } from "react";
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
import { useAddIngredientMutation } from "@/store/api/ingredients";
import {
  FOOD_CATEGORIES,
  FoodCategory,
} from "@food-recipe-app/common/src/constants/categories";
import { useNavigate } from "react-router-dom";
import {
  NutrientsState,
  NutrientsAction,
} from "@food-recipe-app/common/src/types";

const initialState: NutrientsState = {
  proteins: 0,
  carbs: 0,
  fats: 0,
  calories: 0,
  vitaminA: null,
  vitaminD: null,
  vitaminE: null,
  vitaminK: null,
  vitaminC: null,
  thiamin: null,
  riboflavin: null,
  niacin: null,
  pantothenicAcid: null,
  vitaminB6: null,
  biotin: null,
  folate: null,
  vitaminB12: null,
  calcium: null,
  iron: null,
  magnesium: null,
  phosphorus: null,
  potassium: null,
  sodium: null,
  zinc: null,
  copper: null,
  manganese: null,
  selenium: null,
  chromium: null,
  molybdenum: null,
  iodine: null,
};

function nutrientsReducer(
  state: NutrientsState,
  action: NutrientsAction
): NutrientsState {
  switch (action.type) {
    case "SET_BASIC_NUTRIENT":
      return { ...state, [action.field]: action.value };
    case "SET_VITAMIN":
      return { ...state, [action.field]: action.value };
    case "SET_MINERAL":
      return { ...state, [action.field]: action.value };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

export function AddIngredient() {
  const [addIngredient, { isLoading, error }] = useAddIngredientMutation();
  const [success, setSuccess] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState<FoodCategory>(FOOD_CATEGORIES[0].id);
  const [nutrients, dispatch] = useReducer(nutrientsReducer, initialState);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await addIngredient({
        name,
        categoryId: category,
        ...nutrients,
      }).unwrap();

      setSuccess(true);
      setName("");
      setCategory(FOOD_CATEGORIES[0].id);
      dispatch({ type: "RESET" });
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

  // Helper function for handling number inputs
  const handleNutrientChange = (
    type: NutrientsAction["type"],
    field: string,
    value: string
  ) => {
    switch (type) {
      case "SET_BASIC_NUTRIENT":
        dispatch({
          type,
          field: field as "proteins" | "carbs" | "fats" | "calories",
          value: Number(value),
        });
        break;
      case "SET_VITAMIN":
      case "SET_MINERAL":
        dispatch({
          type,
          field: field as any,
          value: value ? Number(value) : null,
        });
        break;
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          🥗 Dodaj nowy składnik
        </Typography>

        {success && (
          <Fade in={success}>
            <Alert severity="success" sx={{ mb: 2 }}>
              Składnik dodany pomyślnie!
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
            label="Nazwa"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            sx={{ mb: 2 }}
          />

          <TextField
            select
            fullWidth
            label="Kategoria"
            value={category}
            onChange={(e) => setCategory(e.target.value as FoodCategory)}
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
            Makroskładniki (na 100g)
          </Typography>
          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            <TextField
              type="number"
              label="Białko (g)"
              value={nutrients.proteins}
              onChange={(e) =>
                handleNutrientChange(
                  "SET_BASIC_NUTRIENT",
                  "proteins",
                  e.target.value
                )
              }
              required
              fullWidth
            />
            <TextField
              type="number"
              label="Węglowodany (g)"
              value={nutrients.carbs}
              onChange={(e) =>
                handleNutrientChange(
                  "SET_BASIC_NUTRIENT",
                  "carbs",
                  e.target.value
                )
              }
              required
              fullWidth
            />
            <TextField
              type="number"
              label="Tłuszcze (g)"
              value={nutrients.fats}
              onChange={(e) =>
                handleNutrientChange(
                  "SET_BASIC_NUTRIENT",
                  "fats",
                  e.target.value
                )
              }
              required
              fullWidth
            />
            <TextField
              type="number"
              label="Kalorie (kcal)"
              value={nutrients.calories}
              onChange={(e) =>
                handleNutrientChange(
                  "SET_BASIC_NUTRIENT",
                  "calories",
                  e.target.value
                )
              }
              required
              fullWidth
            />
          </Box>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h6" sx={{ mb: 2 }}>
            Witaminy (na 100g)
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 2,
              mb: 4,
            }}
          >
            <TextField
              type="number"
              label="Witamina A (mcg)"
              value={nutrients.vitaminA ?? ""}
              onChange={(e) =>
                handleNutrientChange("SET_VITAMIN", "vitaminA", e.target.value)
              }
            />
            <TextField
              type="number"
              label="Witamina D (mcg)"
              value={nutrients.vitaminD ?? ""}
              onChange={(e) =>
                handleNutrientChange("SET_VITAMIN", "vitaminD", e.target.value)
              }
            />
            <TextField
              type="number"
              label="Witamina E (mg)"
              value={nutrients.vitaminE ?? ""}
              onChange={(e) =>
                handleNutrientChange("SET_VITAMIN", "vitaminE", e.target.value)
              }
            />
            <TextField
              type="number"
              label="Witamina K (mcg)"
              value={nutrients.vitaminK ?? ""}
              onChange={(e) =>
                handleNutrientChange("SET_VITAMIN", "vitaminK", e.target.value)
              }
            />
            <TextField
              type="number"
              label="Witamina C (mg)"
              value={nutrients.vitaminC ?? ""}
              onChange={(e) =>
                handleNutrientChange("SET_VITAMIN", "vitaminC", e.target.value)
              }
            />
            <TextField
              type="number"
              label="Tiamina (B1) (mg)"
              value={nutrients.thiamin ?? ""}
              onChange={(e) =>
                handleNutrientChange("SET_VITAMIN", "thiamin", e.target.value)
              }
            />
            <TextField
              type="number"
              label="Ryboflawina (B2) (mg)"
              value={nutrients.riboflavin ?? ""}
              onChange={(e) =>
                handleNutrientChange(
                  "SET_VITAMIN",
                  "riboflavin",
                  e.target.value
                )
              }
            />
            <TextField
              type="number"
              label="Niacyna (B3) (mg)"
              value={nutrients.niacin ?? ""}
              onChange={(e) =>
                handleNutrientChange("SET_VITAMIN", "niacin", e.target.value)
              }
            />
            <TextField
              type="number"
              label="Kwas pantotenowy (B5) (mg)"
              value={nutrients.pantothenicAcid ?? ""}
              onChange={(e) =>
                handleNutrientChange(
                  "SET_VITAMIN",
                  "pantothenicAcid",
                  e.target.value
                )
              }
            />
            <TextField
              type="number"
              label="Witamina B6 (mg)"
              value={nutrients.vitaminB6 ?? ""}
              onChange={(e) =>
                handleNutrientChange("SET_VITAMIN", "vitaminB6", e.target.value)
              }
            />
            <TextField
              type="number"
              label="Biotyna (B7) (mcg)"
              value={nutrients.biotin ?? ""}
              onChange={(e) =>
                handleNutrientChange("SET_VITAMIN", "biotin", e.target.value)
              }
            />
            <TextField
              type="number"
              label="Folian (B9) (mcg)"
              value={nutrients.folate ?? ""}
              onChange={(e) =>
                handleNutrientChange("SET_VITAMIN", "folate", e.target.value)
              }
            />
            <TextField
              type="number"
              label="Witamina B12 (mcg)"
              value={nutrients.vitaminB12 ?? ""}
              onChange={(e) =>
                handleNutrientChange(
                  "SET_VITAMIN",
                  "vitaminB12",
                  e.target.value
                )
              }
            />
          </Box>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h6" sx={{ mb: 2 }}>
            Minerały (na 100g)
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 2,
              mb: 4,
            }}
          >
            <TextField
              type="number"
              label="Wapń (mg)"
              value={nutrients.calcium ?? ""}
              onChange={(e) =>
                handleNutrientChange("SET_MINERAL", "calcium", e.target.value)
              }
            />
            <TextField
              type="number"
              label="Żelazo (mg)"
              value={nutrients.iron ?? ""}
              onChange={(e) =>
                handleNutrientChange("SET_MINERAL", "iron", e.target.value)
              }
            />
            <TextField
              type="number"
              label="Magnez (mg)"
              value={nutrients.magnesium ?? ""}
              onChange={(e) =>
                handleNutrientChange("SET_MINERAL", "magnesium", e.target.value)
              }
            />
            <TextField
              type="number"
              label="Fosfor (mg)"
              value={nutrients.phosphorus ?? ""}
              onChange={(e) =>
                handleNutrientChange(
                  "SET_MINERAL",
                  "phosphorus",
                  e.target.value
                )
              }
            />
            <TextField
              type="number"
              label="Potas (mg)"
              value={nutrients.potassium ?? ""}
              onChange={(e) =>
                handleNutrientChange("SET_MINERAL", "potassium", e.target.value)
              }
            />
            <TextField
              type="number"
              label="Sód (mg)"
              value={nutrients.sodium ?? ""}
              onChange={(e) =>
                handleNutrientChange("SET_MINERAL", "sodium", e.target.value)
              }
            />
            <TextField
              type="number"
              label="Cynk (mg)"
              value={nutrients.zinc ?? ""}
              onChange={(e) =>
                handleNutrientChange("SET_MINERAL", "zinc", e.target.value)
              }
            />
            <TextField
              type="number"
              label="Miedź (mg)"
              value={nutrients.copper ?? ""}
              onChange={(e) =>
                handleNutrientChange("SET_MINERAL", "copper", e.target.value)
              }
            />
            <TextField
              type="number"
              label="Mangan (mg)"
              value={nutrients.manganese ?? ""}
              onChange={(e) =>
                handleNutrientChange("SET_MINERAL", "manganese", e.target.value)
              }
            />
            <TextField
              type="number"
              label="Selen (mcg)"
              value={nutrients.selenium ?? ""}
              onChange={(e) =>
                handleNutrientChange("SET_MINERAL", "selenium", e.target.value)
              }
            />
            <TextField
              type="number"
              label="Chrom (mcg)"
              value={nutrients.chromium ?? ""}
              onChange={(e) =>
                handleNutrientChange("SET_MINERAL", "chromium", e.target.value)
              }
            />
            <TextField
              type="number"
              label="Molibden (mcg)"
              value={nutrients.molybdenum ?? ""}
              onChange={(e) =>
                handleNutrientChange(
                  "SET_MINERAL",
                  "molybdenum",
                  e.target.value
                )
              }
            />
            <TextField
              type="number"
              label="Jod (mcg)"
              value={nutrients.iodine ?? ""}
              onChange={(e) =>
                handleNutrientChange("SET_MINERAL", "iodine", e.target.value)
              }
            />
          </Box>

          <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
            <Button onClick={() => navigate("/ingredients")}>Anuluj</Button>
            <Button type="submit" variant="contained" disabled={isLoading}>
              {isLoading ? <CircularProgress size={24} /> : "Dodaj składnik"}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}
