import { Box, Typography, Button, Grid } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { MealCard } from "../../components/MealCard/MealCard";
import { useGetMealsQuery } from "../../store/api/meals";
import { useAuth } from "../../contexts/AuthContext";

export function MyMeals() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    data: meals = [],
    isLoading,
    error,
  } = useGetMealsQuery({ userId: user?.id });

  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Ładowanie...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">Nie udało się załadować przepisów</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4" component="h1">
          👨‍🍳 Moje przepisy
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/meals/new")}
        >
          Dodaj przepis
        </Button>
      </Box>

      <Grid container spacing={3}>
        {meals.map((meal) => (
          <Grid item xs={12} sm={6} md={4} key={meal.id}>
            <MealCard meal={meal} />
          </Grid>
        ))}
      </Grid>

      {meals.length === 0 && (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Nie masz jeszcze żadnych przepisów
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/meals/new")}
            sx={{ mt: 2 }}
          >
            Dodaj swój pierwszy przepis
          </Button>
        </Box>
      )}
    </Box>
  );
}
