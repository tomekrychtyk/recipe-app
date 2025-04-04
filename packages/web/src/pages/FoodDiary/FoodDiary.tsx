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
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { useGetMealsQuery } from "@/store/api/meals";
import { useGetIngredientsQuery } from "@/store/api/ingredients";
import { useAuth } from "@/contexts/AuthContext";
import type { Ingredient, Meal } from "@food-recipe-app/common";
import {
  useAddFoodDiaryEntryMutation,
  useGetFoodDiaryEntriesQuery,
  useDeleteFoodDiaryEntryMutation,
} from "@/store/api/foodDiary";
import { DailyNutritionSummary } from "./components/DailyNutritionSummary";
import { DetailedNutritionBreakdown } from "./components/DetailedNutritionBreakdown";
import { TimelineEntries } from "./components/TimelineEntries";

type EntryType = "ingredients" | "public_meals" | "my_meals";

interface FoodDiaryEntry {
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
  const [deleteFoodDiaryEntry] = useDeleteFoodDiaryEntryMutation();

  // Fetch data for dropdowns
  const { data: allMeals = [] } = useGetMealsQuery({});
  const { data: myMeals = [] } = useGetMealsQuery({ userId: user?.id });
  const { data: ingredients = [] } = useGetIngredientsQuery();

  // Fetch entries for the selected date
  const { data: entries = [], isLoading } = useGetFoodDiaryEntriesQuery({
    userId: user?.id || "",
    date: selectedDate?.toISOString().split("T")[0],
  });

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

  const handleDeleteEntry = async (id: number) => {
    try {
      await deleteFoodDiaryEntry(id).unwrap();
    } catch (error) {
      console.error("Failed to delete food diary entry:", error);
      // TODO: Show error message to user
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: { xs: 1, sm: 3 } }}>
      <Stack spacing={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dziennik posiłków
        </Typography>

        {/* <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 2,
              bgcolor: "rgba(25, 118, 210, 0.05)",
              borderRadius: 2,
              mb: 2,
            }}
          >
            <Typography
              variant="h5"
              sx={{
                color: "primary.main",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                mb: 1,
              }}
            >
              <motion.span
                animate={{ rotate: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
              >
                📝
              </motion.span>
              Monitoruj swoje odżywianie
              <motion.span
                animate={{ rotate: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
              >
                🥗
              </motion.span>
            </Typography>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <Typography align="center" variant="body1" sx={{ mb: 2 }}>
                Dziennik posiłków pomaga Ci śledzić, co jesz każdego dnia.
                Monitoruj swoją dietę, kontroluj kalorie i sprawdzaj zawartość
                składników odżywczych, aby podejmować zdrowsze decyzje
                żywieniowe. Twój osobisty asystent zdrowego stylu życia!
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 3,
                  flexWrap: "wrap",
                  color: "text.secondary",
                  fontSize: "0.875rem",
                  "& > div": {
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  },
                }}
              >
                <div>
                  <span>📊</span> <span>Śledź swoje kalorie</span>
                </div>
                <div>
                  <span>⚡</span> <span>Analizuj makroskładniki</span>
                </div>
                <div>
                  <span>🍎</span> <span>Zdrowe wybory</span>
                </div>
              </Box>
            </motion.div>
          </Paper>
        </motion.div> */}

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
            Dodaj wpis
          </Button>
        </Box>

        <DailyNutritionSummary entries={entries} isLoading={isLoading} />
        <TimelineEntries
          entries={entries}
          onDelete={handleDeleteEntry}
          isLoading={isLoading}
        />
        <DetailedNutritionBreakdown entries={entries} />

        <Dialog
          open={isAddEntryDialogOpen}
          onClose={() => setIsAddEntryDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Dodaj wpis</DialogTitle>
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
