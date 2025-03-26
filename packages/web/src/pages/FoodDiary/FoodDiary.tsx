import {
  Box,
  Typography,
  Button,
  Paper,
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
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { useGetMealsQuery } from "@/store/api/meals";
import { useGetIngredientsQuery } from "@/store/api/ingredients";
import { useAuth } from "@/contexts/AuthContext";
import type { Ingredient, Meal } from "@food-recipe-app/common";
import { useAddFoodDiaryEntryMutation } from "@/store/api/foodDiary";

type EntryType = "ingredients" | "public_meals" | "my_meals";

interface IngredientWithQuantity {
  ingredient: Ingredient;
  amount: number;
}

interface FoodDiaryEntry {
  time: Date | null;
  name: string;
  type: EntryType;
  selectedMeal: Meal | null;
  ingredients: IngredientWithQuantity[];
}

export function FoodDiary() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [isAddEntryDialogOpen, setIsAddEntryDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<EntryType>("ingredients");
  const [selectedIngredient, setSelectedIngredient] =
    useState<Ingredient | null>(null);
  const [ingredientQuantity, setIngredientQuantity] = useState<string>("");
  const [entryData, setEntryData] = useState<FoodDiaryEntry>({
    time: null,
    name: "",
    type: "ingredients",
    selectedMeal: null,
    ingredients: [],
  });
  const [addFoodDiaryEntry] = useAddFoodDiaryEntryMutation();

  // Fetch data for dropdowns
  const { data: allMeals = [] } = useGetMealsQuery({});
  const { data: myMeals = [] } = useGetMealsQuery({ userId: user?.id });
  const { data: ingredients = [] } = useGetIngredientsQuery();

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
      await addFoodDiaryEntry({
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
      console.error("Failed to save food diary entry:", error);
      // TODO: Show error message to user
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

  const handleMealSelect = (meal: Meal | null) => {
    if (!meal) {
      setEntryData((prev) => ({
        ...prev,
        selectedMeal: null,
        name: "",
        ingredients: [],
      }));
      return;
    }

    // Find the full meal with ingredients from the appropriate list
    const fullMeal =
      activeTab === "my_meals"
        ? myMeals.find((m) => m.id === meal.id)
        : allMeals.find((m) => m.id === meal.id);

    if (!fullMeal) return;

    setEntryData((prev) => ({
      ...prev,
      selectedMeal: fullMeal,
      name: fullMeal.name,
      ingredients: fullMeal.ingredients
        .map((ing) => ({
          ingredient: ingredients.find((i) => i.id === ing.ingredientId)!,
          amount: ing.amount,
        }))
        .filter((item) => item.ingredient), // Filter out any ingredients that weren't found
    }));
  };

  const getOptionsForActiveTab = () => {
    switch (activeTab) {
      case "public_meals":
        return allMeals;
      case "my_meals":
        return myMeals;
      default:
        return [];
    }
  };

  const getOptionLabel = (option: any) => {
    return option.name || "";
  };

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
          📝 Dziennik posiłków
        </Typography>
        <DatePicker
          label="Wybierz datę"
          value={selectedDate}
          onChange={setSelectedDate}
          slotProps={{
            textField: {
              variant: "outlined",
              sx: { width: 200 },
            },
          }}
        />
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            py: 4,
          }}
        >
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddEntry}
          >
            Dodaj posiłek
          </Button>
        </Box>
      </Paper>

      {/* Add Entry Dialog */}
      <Dialog
        open={isAddEntryDialogOpen}
        onClose={() => setIsAddEntryDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Dodaj posiłek</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TimePicker
              label="Godzina posiłku"
              value={entryData.time}
              onChange={(newTime) =>
                setEntryData({ ...entryData, time: newTime })
              }
              slotProps={{
                textField: {
                  variant: "outlined",
                  fullWidth: true,
                },
              }}
            />

            <TextField
              label="Nazwa posiłku"
              value={entryData.name}
              onChange={(e) =>
                setEntryData({ ...entryData, name: e.target.value })
              }
              fullWidth
              disabled={activeTab !== "ingredients"}
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
                  name: "",
                }));
              }}
            >
              <Tab
                label="Składniki"
                value="ingredients"
                sx={{ textTransform: "none" }}
              />
              <Tab
                label="Przepisy publiczne"
                value="public_meals"
                sx={{ textTransform: "none" }}
              />
              <Tab
                label="Moje przepisy"
                value="my_meals"
                sx={{ textTransform: "none" }}
              />
            </Tabs>

            {activeTab === "ingredients" ? (
              <>
                <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                  <Autocomplete
                    options={ingredients}
                    getOptionLabel={(option: Ingredient) => option.name}
                    value={selectedIngredient}
                    onChange={(_, newValue) => setSelectedIngredient(newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Wybierz składnik"
                        placeholder="Wyszukaj składnik..."
                      />
                    )}
                    sx={{ flexGrow: 1 }}
                  />
                  <TextField
                    label="Ilość (g)"
                    value={ingredientQuantity}
                    onChange={(e) => setIngredientQuantity(e.target.value)}
                    type="number"
                    sx={{ width: 120 }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleAddIngredient}
                    disabled={!selectedIngredient || !ingredientQuantity}
                    sx={{ mt: 1 }}
                  >
                    Dodaj
                  </Button>
                </Box>
              </>
            ) : (
              <Autocomplete
                options={getOptionsForActiveTab()}
                getOptionLabel={getOptionLabel}
                value={entryData.selectedMeal}
                onChange={(_, newValue) => handleMealSelect(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Wybierz przepis"
                    placeholder="Wyszukaj przepis..."
                  />
                )}
              />
            )}

            {/* Always show ingredients list */}
            <List>
              {entryData.ingredients.map((item, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={item.ingredient.name}
                    secondary={`${item.amount}g`}
                  />
                  {activeTab === "ingredients" && (
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleRemoveIngredient(index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  )}
                </ListItem>
              ))}
            </List>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddEntryDialogOpen(false)}>Anuluj</Button>
          <Button
            onClick={handleSaveEntry}
            variant="contained"
            disabled={
              !entryData.time ||
              !entryData.name ||
              entryData.ingredients.length === 0
            }
          >
            Zapisz
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
