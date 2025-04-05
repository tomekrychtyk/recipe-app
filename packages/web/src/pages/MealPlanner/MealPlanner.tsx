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
  Alert,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { useGetMealsQuery } from "@/store/api/meals";
import { useGetIngredientsQuery } from "@/store/api/ingredients";
import { useAuth } from "@/contexts/AuthContext";
import type { Ingredient } from "@food-recipe-app/common";
import {
  useAddPlannedMealMutation,
  useGetPlannedMealsQuery,
  useDeletePlannedMealMutation,
  useAddPlannedMealToDiaryMutation,
} from "@/store/api/mealPlanner";
import { DailyNutritionSummary } from "./components/DailyNutritionSummary";
import { DetailedNutritionBreakdown } from "./components/DetailedNutritionBreakdown";
import { TimelineEntries } from "./components/TimelineEntries";
import { PlannedMealEntry, EntryType } from "./types";
import { useCreateShoppingListMutation } from "@/store/api/shoppingList";

export function MealPlanner() {
  const { user } = useAuth();

  // Get today's date at midnight for comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);

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
  const [deletePlannedMeal] = useDeletePlannedMealMutation();
  const [addPlannedMealToDiary] = useAddPlannedMealToDiaryMutation();
  const [createShoppingList] = useCreateShoppingListMutation();

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
      // First add the meal to the food diary
      await addPlannedMealToDiary(id).unwrap();

      // Then delete it from the meal planner
      await deletePlannedMeal(id).unwrap();

      // Show success message
      alert("Posiłek został dodany do dziennika i usunięty z planera");
    } catch (error) {
      console.error("Failed to add planned meal to diary:", error);
      alert("Nie udało się dodać posiłku do dziennika");
    }
  };

  // Handle adding a planned meal to a new shopping list
  const handleAddToShoppingList = async (mealId: number) => {
    if (!user) return;

    const mealToAdd = plannedMeals.find((meal) => meal.id === mealId);
    if (!mealToAdd) return;

    try {
      const dateStr = mealToAdd.date.split("T")[0];
      await createShoppingList({
        userId: user.id,
        name: `Lista zakupów dla: ${mealToAdd.name} (${dateStr})`,
        items: mealToAdd.ingredients.map((ing) => ({
          ingredientId: ing.ingredient.id,
          amount: ing.amount,
        })),
      }).unwrap();

      alert("Pomyślnie utworzono listę zakupów");
    } catch (error) {
      console.error("Failed to create shopping list:", error);
      alert("Nie udało się utworzyć listy zakupów");
    }
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
                helperText: "Wybierz datę (tylko aktualna i przyszłe)",
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

        <DailyNutritionSummary entries={plannedMeals} isLoading={isLoading} />

        <TimelineEntries
          entries={plannedMeals}
          onDelete={handleDeletePlannedMeal}
          onAddToDiary={handleAddToDiary}
          onAddToShoppingList={handleAddToShoppingList}
          isSelectedDateToday={isSelectedDateToday}
          isLoading={isLoading}
        />

        <DetailedNutritionBreakdown entries={plannedMeals} />

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
