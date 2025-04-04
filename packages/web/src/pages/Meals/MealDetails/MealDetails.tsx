import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Paper,
  Stack,
  IconButton,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { useGetMealByIdQuery } from "../../../store/api/meals";
import { NutrientRDAGraph } from "../../../components/NutrientRDAGraph";
import { MacroSummary } from "./MacroSummary";
import { MealIngredients } from "./MealIngredients";
import { useAuth } from "@/contexts/AuthContext";

export function MealDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { data: meal, isLoading, error } = useGetMealByIdQuery(parseInt(id!));
  const [portions, setPortions] = useState(1);

  const handleIncrementPortions = () => {
    setPortions((prev) => prev + 1);
  };

  const handleDecrementPortions = () => {
    setPortions((prev) => Math.max(1, prev - 1));
  };

  const handlePortionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1) {
      setPortions(value);
    } else if (e.target.value === "") {
      setPortions(1);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !meal) {
    return (
      <Alert severity="error" sx={{ mt: 4 }}>
        Nie udało się załadować posiłku
      </Alert>
    );
  }

  console.log(meal);

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            {meal.name}
          </Typography>
          {meal.description && (
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              {meal.description}
            </Typography>
          )}
        </Box>
        {isAdmin && (
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/meals/${meal.id}/edit`)}
          >
            Edytuj przepis
          </Button>
        )}
      </Box>

      {meal.thumbnailUrl && (
        <Box
          sx={{
            mb: 4,
            borderRadius: 2,
            overflow: "hidden",
            maxHeight: 400,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <img
            src={meal.thumbnailUrl}
            alt={meal.name}
            style={{
              width: "100%",
              maxHeight: "400px",
              objectFit: "cover",
            }}
          />
        </Box>
      )}

      <Paper sx={{ mb: 4, p: 2 }}>
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="subtitle1">Ilość porcji:</Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              onClick={handleDecrementPortions}
              disabled={portions <= 1}
              size="small"
            >
              <RemoveIcon />
            </IconButton>
            <TextField
              value={portions}
              onChange={handlePortionChange}
              inputProps={{
                min: 1,
                style: { textAlign: "center" },
                inputMode: "numeric",
              }}
              variant="outlined"
              size="small"
              sx={{ width: "60px", mx: 1 }}
            />
            <IconButton onClick={handleIncrementPortions} size="small">
              <AddIcon />
            </IconButton>
          </Box>
        </Stack>
      </Paper>

      <MacroSummary meal={meal} portions={portions} />

      <Typography variant="h5" component="h2" gutterBottom>
        Składniki
      </Typography>

      <MealIngredients meal={meal} portions={portions} />

      <Box
        sx={{
          py: 3,
          px: {
            xs: 0,
            md: 12,
          },
        }}
      >
        <NutrientRDAGraph
          totalNutrients={meal.totalNutrients}
          portions={portions}
        />
      </Box>
    </Box>
  );
}
