import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Autocomplete,
  Stack,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Typography,
  Paper,
  Tooltip,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  PlaylistAdd,
} from "@mui/icons-material";
import { useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { useGetMealsQuery } from "@/store/api/meals";
import { useGetIngredientsQuery } from "@/store/api/ingredients";
import { useAuth } from "@/contexts/AuthContext";
import type { Ingredient, Meal } from "@food-recipe-app/common";
import {
  useAddPlannedMealMutation,
  useGetPlannedMealsQuery,
  useDeletePlannedMealMutation,
  useAddPlannedMealToDiaryMutation,
} from "@/store/api/mealPlanner";

type EntryType = "ingredients" | "public_meals" | "my_meals";

interface PlannedMealEntry {
  time: Date | null;
  name: string;
  type: EntryType;
  selectedMeal: Meal | null;
  ingredients: IngredientWithQuantity[];
}

interface IngredientWithQuantity {
  ingredient: Ingredient;
  amount: number;
}

export function MealPlanner() {
  const { user } = useAuth();
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set time to midnight for comparison

  const [selectedDate, setSelectedDate] = useState<Date | null>(today);
  const [isAddEntryDialogOpen, setIsAddEntryDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<EntryType>("ingredients");
  const [selectedIngredient, setSelectedIngredient] =
    useState<Ingredient | null>(null);
  const [ingredientQuantity, setIngredientQuantity] = useState<string>("");
  const [entryData, setEntryData] = useState<PlannedMealEntry>({
    time: null,
    name: "",
    type: "ingredients",
    selectedMeal: null,
    ingredients: [],
  });

  const [addPlannedMeal, { isLoading: isAddingMeal }] =
    useAddPlannedMealMutation();
  const [deletePlannedMeal, { isLoading: isDeletingMeal }] =
    useDeletePlannedMealMutation();
  const [addPlannedMealToDiary, { isLoading: isAddingToDiary }] =
    useAddPlannedMealToDiaryMutation();

  // Fetch data for dropdowns
  const { data: allMeals = [] } = useGetMealsQuery({});
  const { data: myMeals = [] } = useGetMealsQuery({ userId: user?.id });
  const { data: ingredients = [] } = useGetIngredientsQuery();

  // Fetch planned meals for the selected date
  const { data: plannedMeals = [], isLoading } = useGetPlannedMealsQuery(
    {
      userId: user?.id || "",
      date: selectedDate?.toISOString().split("T")[0],
    },
    { skip: !user?.id }
  );

  // Check if selected date is today
  const isSelectedDateToday = selectedDate
    ? selectedDate.toDateString() === today.toDateString()
    : false;

  const handleAddEntry = () => {
    setIsAddEntryDialogOpen(true);
    setEntryData({
      time: new Date(),
      name: "",
      type: "ingredients",
      selectedMeal: null,
      ingredients: [],
    });
  };

  const handleSaveEntry = async () => {
    if (!selectedDate || !entryData.time || !user?.id) return;

    try {
      await addPlannedMeal({
        userId: user.id,
        date: selectedDate.toISOString().split("T")[0],
        time: entryData.time.toTimeString().split(" ")[0],
        name: entryData.name,
        mealId: entryData.selectedMeal?.id,
        ingredients: entryData.ingredients.map((ing) => ({
          ingredientId: ing.ingredient.id,
          amount: ing.amount,
        })),
      }).unwrap();

      setIsAddEntryDialogOpen(false);
    } catch (error) {
      console.error("Failed to save planned meal:", error);
      // Show error message to user
      alert("Nie udało się zapisać zaplanowanego posiłku");
    }
  };

  const handleAddIngredient = () => {
    if (selectedIngredient && ingredientQuantity) {
      setEntryData((prev) => ({
        ...prev,
        ingredients: [
          ...prev.ingredients,
          {
            ingredient: selectedIngredient,
            amount: parseFloat(ingredientQuantity),
          },
        ],
      }));
      setSelectedIngredient(null);
      setIngredientQuantity("");
    }
  };

  const handleRemoveIngredient = (index: number) => {
    setEntryData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  };

  const handleDeletePlannedMeal = async (id: number) => {
    try {
      await deletePlannedMeal(id).unwrap();
    } catch (error) {
      console.error("Failed to delete planned meal:", error);
      alert("Nie udało się usunąć zaplanowanego posiłku");
    }
  };

  const handleAddToDiary = async (id: number) => {
    try {
      await addPlannedMealToDiary(id).unwrap();
      alert("Posiłek został dodany do dziennika");
    } catch (error) {
      console.error("Failed to add planned meal to diary:", error);
      alert("Nie udało się dodać posiłku do dziennika");
    }
  };

  // Helper function to format time (HH:MM)
  const formatTime = (timeStr: string) => {
    const parts = timeStr.split(":");
    if (parts.length >= 2) {
      return `${parts[0]}:${parts[1]}`;
    }
    return timeStr;
  };

  if (!user) {
    return (
      <Box sx={{ maxWidth: 800, mx: "auto", p: { xs: 1, sm: 3 } }}>
        <Alert severity="info">
          Zaloguj się, aby korzystać z planera posiłków
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: { xs: 1, sm: 3 } }}>
      <Stack spacing={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          Plan posiłków
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <DatePicker
            label="Data"
            value={selectedDate}
            onChange={setSelectedDate}
            disablePast
            slotProps={{
              textField: {
                size: "small",
                sx: { minWidth: 150 },
              },
            }}
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddEntry}
          >
            Dodaj posiłek
          </Button>
        </Box>

        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : plannedMeals.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Typography color="text.secondary">
              Brak zaplanowanych posiłków na ten dzień
            </Typography>
          </Paper>
        ) : (
          <Paper sx={{ p: 2 }}>
            <List>
              {[...plannedMeals]
                .sort((a, b) => a.time.localeCompare(b.time))
                .map((meal) => (
                  <ListItem
                    key={meal.id}
                    secondaryAction={
                      <Box>
                        {isSelectedDateToday && (
                          <Tooltip title="Dodaj do dziennika">
                            <IconButton
                              edge="end"
                              onClick={() => handleAddToDiary(meal.id)}
                              disabled={isAddingToDiary}
                              sx={{ mr: 1 }}
                            >
                              <PlaylistAdd />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="Usuń">
                          <IconButton
                            edge="end"
                            onClick={() => handleDeletePlannedMeal(meal.id)}
                            disabled={isDeletingMeal}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    }
                  >
                    <ListItemText
                      primary={
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Typography
                            component="span"
                            variant="body1"
                            sx={{ mr: 2, fontWeight: "medium" }}
                          >
                            {formatTime(meal.time)}
                          </Typography>
                          {meal.name}
                        </Box>
                      }
                      secondary={
                        meal.meal
                          ? `Posiłek: ${meal.meal.name}`
                          : `Składniki: ${meal.ingredients
                              .map(
                                (ing) =>
                                  `${ing.ingredient.name} (${ing.amount}g)`
                              )
                              .join(", ")}`
                      }
                    />
                  </ListItem>
                ))}
            </List>
          </Paper>
        )}

        <Dialog
          open={isAddEntryDialogOpen}
          onClose={() => setIsAddEntryDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Dodaj zaplanowany posiłek</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <TimePicker
                label="Godzina"
                value={entryData.time}
                onChange={(newTime) =>
                  setEntryData((prev) => ({ ...prev, time: newTime }))
                }
                slotProps={{
                  textField: {
                    size: "small",
                    fullWidth: true,
                  },
                }}
              />
              <TextField
                label="Nazwa"
                value={entryData.name}
                onChange={(e) =>
                  setEntryData((prev) => ({ ...prev, name: e.target.value }))
                }
                size="small"
                fullWidth
              />
              <Tabs
                value={activeTab}
                onChange={(_, newValue: EntryType) => {
                  setActiveTab(newValue);
                  setEntryData((prev) => ({
                    ...prev,
                    type: newValue,
                    selectedMeal: null,
                    ingredients: [],
                  }));
                }}
              >
                <Tab label="Składniki" value="ingredients" />
                <Tab label="Publiczne posiłki" value="public_meals" />
                <Tab label="Moje posiłki" value="my_meals" />
              </Tabs>

              {activeTab === "ingredients" ? (
                <>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Autocomplete
                      value={selectedIngredient}
                      onChange={(_, newValue) =>
                        setSelectedIngredient(newValue)
                      }
                      options={ingredients}
                      getOptionLabel={(option) => option.name}
                      renderInput={(params) => (
                        <TextField {...params} label="Składnik" size="small" />
                      )}
                      sx={{ flex: 1 }}
                    />
                    <TextField
                      label="Ilość (g)"
                      value={ingredientQuantity}
                      onChange={(e) => setIngredientQuantity(e.target.value)}
                      type="number"
                      size="small"
                      sx={{ width: 100 }}
                    />
                    <Button
                      variant="contained"
                      onClick={handleAddIngredient}
                      disabled={!selectedIngredient || !ingredientQuantity}
                    >
                      Dodaj
                    </Button>
                  </Box>
                  <List>
                    {entryData.ingredients.map((ing, index) => (
                      <ListItem key={index}>
                        <ListItemText
                          primary={`${ing.ingredient.name} - ${ing.amount}g`}
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            onClick={() => handleRemoveIngredient(index)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                </>
              ) : (
                <Autocomplete
                  value={entryData.selectedMeal}
                  onChange={(_, newValue) =>
                    setEntryData((prev) => ({
                      ...prev,
                      selectedMeal: newValue,
                      ingredients: newValue
                        ? newValue.ingredients.map((ing) => ({
                            ingredient: ing.ingredient,
                            amount: ing.amount,
                          }))
                        : [],
                    }))
                  }
                  options={activeTab === "public_meals" ? allMeals : myMeals}
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => (
                    <TextField {...params} label="Posiłek" size="small" />
                  )}
                />
              )}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsAddEntryDialogOpen(false)}>
              Anuluj
            </Button>
            <Button
              onClick={handleSaveEntry}
              variant="contained"
              disabled={
                isAddingMeal ||
                !entryData.time ||
                !entryData.name ||
                (activeTab === "ingredients"
                  ? entryData.ingredients.length === 0
                  : !entryData.selectedMeal)
              }
            >
              Zapisz
            </Button>
          </DialogActions>
        </Dialog>
      </Stack>
    </Box>
  );
}
