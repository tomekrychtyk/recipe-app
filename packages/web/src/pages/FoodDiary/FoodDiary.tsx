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
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from "@mui/lab";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
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
import { VITAMINS_RDA, MINERALS_RDA } from "@food-recipe-app/common";

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

interface FoodDiaryEntryResponse {
  id: number;
  date: string;
  time: string;
  name: string;
  ingredients: Array<{
    ingredientId: number;
    ingredient: Ingredient;
    amount: number;
  }>;
}

interface NutritionalSummary {
  proteins: number;
  carbs: number;
  fats: number;
  calories: number;
}

interface DetailedNutrition {
  vitaminA?: number;
  vitaminD?: number;
  vitaminE?: number;
  vitaminK?: number;
  vitaminC?: number;
  thiamin?: number;
  riboflavin?: number;
  niacin?: number;
  pantothenicAcid?: number;
  vitaminB6?: number;
  biotin?: number;
  folate?: number;
  vitaminB12?: number;
  calcium?: number;
  iron?: number;
  magnesium?: number;
  phosphorus?: number;
  potassium?: number;
  sodium?: number;
  zinc?: number;
  copper?: number;
  manganese?: number;
  selenium?: number;
  chromium?: number;
  molybdenum?: number;
  iodine?: number;
}

const formatTime = (timeString: string) => {
  // PostgreSQL returns time as "HH:mm:ss.ms+00"
  const match = timeString.match(/(\d{2}):(\d{2})/);
  if (match) {
    const [, hours, minutes] = match;
    return `${hours}:${minutes}`;
  }
  return timeString;
};

const sortEntriesByTime = (entries: FoodDiaryEntryResponse[]) => {
  return [...entries].sort((a, b) => a.time.localeCompare(b.time));
};

const calculateDailyNutrition = (
  entries: FoodDiaryEntryResponse[]
): NutritionalSummary => {
  const summary = entries.reduce(
    (acc, entry) => {
      entry.ingredients.forEach((ing) => {
        // Calculate nutrition based on amount (converting from 100g base)
        const multiplier = ing.amount / 100;
        acc.proteins += (ing.ingredient.proteins || 0) * multiplier;
        acc.carbs += (ing.ingredient.carbs || 0) * multiplier;
        acc.fats += (ing.ingredient.fats || 0) * multiplier;
        acc.calories += (ing.ingredient.calories || 0) * multiplier;
      });
      return acc;
    },
    {
      proteins: 0,
      carbs: 0,
      fats: 0,
      calories: 0,
    }
  );

  // Round to 1 decimal place
  return {
    proteins: Math.round(summary.proteins * 10) / 10,
    carbs: Math.round(summary.carbs * 10) / 10,
    fats: Math.round(summary.fats * 10) / 10,
    calories: Math.round(summary.calories),
  };
};

const calculateDetailedNutrition = (
  entries: FoodDiaryEntryResponse[]
): DetailedNutrition => {
  const nutrition: DetailedNutrition = {};

  entries.forEach((entry) => {
    entry.ingredients.forEach((ingredient) => {
      const multiplier = ingredient.amount / 100;
      Object.entries(ingredient.ingredient).forEach(([key, value]) => {
        if (
          (key in VITAMINS_RDA || key in MINERALS_RDA) &&
          typeof value === "number"
        ) {
          const nutrientKey = key as keyof DetailedNutrition;
          nutrition[nutrientKey] =
            (nutrition[nutrientKey] || 0) + value * multiplier;
        }
      });
    });
  });

  // Round all values to 1 decimal place
  return Object.fromEntries(
    Object.entries(nutrition).map(([key, value]) => [
      key,
      Math.round(value * 10) / 10,
    ])
  ) as DetailedNutrition;
};

const calculateEntryNutrition = (
  ingredients: Array<{ ingredient: Ingredient; amount: number }>
): NutritionalSummary => {
  const summary = ingredients.reduce(
    (acc, ing) => {
      const multiplier = ing.amount / 100;
      acc.proteins += (ing.ingredient.proteins || 0) * multiplier;
      acc.carbs += (ing.ingredient.carbs || 0) * multiplier;
      acc.fats += (ing.ingredient.fats || 0) * multiplier;
      acc.calories += (ing.ingredient.calories || 0) * multiplier;
      return acc;
    },
    { proteins: 0, carbs: 0, fats: 0, calories: 0 }
  );

  return {
    proteins: Math.round(summary.proteins * 10) / 10,
    carbs: Math.round(summary.carbs * 10) / 10,
    fats: Math.round(summary.fats * 10) / 10,
    calories: Math.round(summary.calories),
  };
};

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
  const { data: entries = [] } = useGetFoodDiaryEntriesQuery({
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
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Podsumowanie dnia
            </Typography>
          </Grid>
          {entries.length === 0 ? (
            <Grid item xs={12}>
              <Typography variant="body1" color="text.secondary" align="center">
                Brak wpisów na wybrany dzień
              </Typography>
            </Grid>
          ) : (
            <>
              {(() => {
                const summary = calculateDailyNutrition(entries);
                return (
                  <>
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ textAlign: "center" }}>
                        <Typography variant="h4" color="primary">
                          {summary.calories}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Kalorie (kcal)
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ textAlign: "center" }}>
                        <Typography variant="h4" color="primary">
                          {summary.proteins}g
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Białko
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ textAlign: "center" }}>
                        <Typography variant="h4" color="primary">
                          {summary.carbs}g
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Węglowodany
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Box sx={{ textAlign: "center" }}>
                        <Typography variant="h4" color="primary">
                          {summary.fats}g
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Tłuszcze
                        </Typography>
                      </Box>
                    </Grid>
                  </>
                );
              })()}
            </>
          )}
        </Grid>
      </Paper>

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

      {/* Timeline of entries */}
      <Paper sx={{ p: { xs: 1, sm: 3 }, mt: 3, mb: 3 }}>
        {entries.length === 0 ? (
          <Typography variant="body1" color="text.secondary" align="center">
            Brak wpisów na wybrany dzień
          </Typography>
        ) : (
          <Timeline
            sx={{
              [`& .MuiTimelineContent-root`]: {
                flex: 4,
              },
              [`& .MuiTimelineItem-root`]: {
                minHeight: "auto",
              },
              [`& .MuiTimelineOppositeContent-root`]: {
                flex: 1,
                maxWidth: { xs: 50, sm: 100 },
              },
              p: 0,
              m: 0,
            }}
          >
            {sortEntriesByTime(entries).map((entry) => (
              <TimelineItem key={entry.id}>
                <TimelineOppositeContent
                  color="text.secondary"
                  sx={{
                    minWidth: { xs: 50, sm: 100 },
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  }}
                >
                  {formatTime(entry.time)}
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot color="primary" />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                  <Paper elevation={1} sx={{ p: { xs: 1, sm: 2 } }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                      }}
                    >
                      <Typography
                        variant="h6"
                        component="h3"
                        sx={{
                          fontSize: { xs: "1rem", sm: "1.25rem" },
                          wordBreak: "break-word",
                          pr: 1,
                        }}
                      >
                        {entry.name}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={async () => {
                          try {
                            await deleteFoodDiaryEntry(entry.id).unwrap();
                          } catch (error) {
                            console.error("Failed to delete entry:", error);
                          }
                        }}
                        sx={{
                          color: "error.main",
                          "&:hover": {
                            bgcolor: "error.light",
                            color: "error.dark",
                          },
                          flexShrink: 0,
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                    <List dense sx={{ py: 0 }}>
                      {entry.ingredients.map((ing) => (
                        <ListItem
                          key={ing.ingredientId}
                          sx={{ px: { xs: 0, sm: 2 } }}
                        >
                          <ListItemText
                            primary={ing.ingredient.name}
                            secondary={`${ing.amount}g`}
                            primaryTypographyProps={{
                              sx: {
                                fontSize: { xs: "0.875rem", sm: "1rem" },
                                wordBreak: "break-word",
                              },
                            }}
                            secondaryTypographyProps={{
                              sx: {
                                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                              },
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                    {/* Add macronutrient summary */}
                    {(() => {
                      const nutrition = calculateEntryNutrition(
                        entry.ingredients
                      );
                      return (
                        <Box
                          sx={{
                            display: "flex",
                            gap: { xs: 1, sm: 2 },
                            mt: 1,
                            pt: 1,
                            borderTop: 1,
                            borderColor: "divider",
                            flexWrap: "wrap",
                          }}
                        >
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                          >
                            {nutrition.calories} kcal
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                          >
                            B: {nutrition.proteins}g
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                          >
                            W: {nutrition.carbs}g
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                          >
                            T: {nutrition.fats}g
                          </Typography>
                        </Box>
                      );
                    })()}
                  </Paper>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        )}
      </Paper>

      {/* Detailed Nutrition Breakdown */}
      {entries.length > 0 && (
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{ bgcolor: "background.paper" }}
          >
            <Typography variant="h6">
              Szczegółowe informacje o wartościach odżywczych
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Witaminy</TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold" }}>
                      Ilość
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold" }}>
                      % RDA
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", pl: 4 }}>
                      Minerały
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold" }}>
                      Ilość
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold" }}>
                      % RDA
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(() => {
                    const nutrition = calculateDetailedNutrition(entries);
                    const vitamins = [
                      ["vitaminA", "Witamina A", nutrition.vitaminA, "µg"],
                      ["vitaminD", "Witamina D", nutrition.vitaminD, "µg"],
                      ["vitaminE", "Witamina E", nutrition.vitaminE, "mg"],
                      ["vitaminK", "Witamina K", nutrition.vitaminK, "µg"],
                      ["vitaminC", "Witamina C", nutrition.vitaminC, "mg"],
                      ["thiamin", "Tiamina (B1)", nutrition.thiamin, "mg"],
                      [
                        "riboflavin",
                        "Ryboflawina (B2)",
                        nutrition.riboflavin,
                        "mg",
                      ],
                      ["niacin", "Niacyna (B3)", nutrition.niacin, "mg"],
                      [
                        "pantothenicAcid",
                        "Kwas pantotenowy (B5)",
                        nutrition.pantothenicAcid,
                        "mg",
                      ],
                      ["vitaminB6", "Witamina B6", nutrition.vitaminB6, "mg"],
                      ["biotin", "Biotyna (B7)", nutrition.biotin, "µg"],
                      ["folate", "Kwas foliowy (B9)", nutrition.folate, "µg"],
                      [
                        "vitaminB12",
                        "Witamina B12",
                        nutrition.vitaminB12,
                        "µg",
                      ],
                    ];
                    const minerals = [
                      ["calcium", "Wapń", nutrition.calcium, "mg"],
                      ["iron", "Żelazo", nutrition.iron, "mg"],
                      ["magnesium", "Magnez", nutrition.magnesium, "mg"],
                      ["phosphorus", "Fosfor", nutrition.phosphorus, "mg"],
                      ["potassium", "Potas", nutrition.potassium, "mg"],
                      ["sodium", "Sód", nutrition.sodium, "mg"],
                      ["zinc", "Cynk", nutrition.zinc, "mg"],
                      ["copper", "Miedź", nutrition.copper, "mg"],
                      ["manganese", "Mangan", nutrition.manganese, "mg"],
                      ["selenium", "Selen", nutrition.selenium, "µg"],
                      ["chromium", "Chrom", nutrition.chromium, "µg"],
                      ["molybdenum", "Molibden", nutrition.molybdenum, "µg"],
                      ["iodine", "Jod", nutrition.iodine, "µg"],
                    ];

                    const calculateRdaPercentage = (
                      key:
                        | keyof typeof VITAMINS_RDA
                        | keyof typeof MINERALS_RDA,
                      value: number | undefined,
                      type: "vitamin" | "mineral"
                    ): number => {
                      if (
                        value === undefined ||
                        typeof value !== "number" ||
                        isNaN(value)
                      )
                        return 0;

                      const rda =
                        type === "vitamin"
                          ? VITAMINS_RDA[key as keyof typeof VITAMINS_RDA]
                              ?.value
                          : MINERALS_RDA[key as keyof typeof MINERALS_RDA]
                              ?.value;

                      if (!rda) return 0;
                      return Math.round((value / rda) * 100);
                    };

                    const maxRows = Math.max(vitamins.length, minerals.length);
                    return Array.from({ length: maxRows }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>{vitamins[i]?.[1] || ""}</TableCell>
                        <TableCell align="right">
                          {vitamins[i]
                            ? `${Number(vitamins[i][2]) || 0} ${vitamins[i][3]}`
                            : ""}
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            color: vitamins[i]
                              ? calculateRdaPercentage(
                                  vitamins[i][0] as keyof typeof VITAMINS_RDA,
                                  Number(vitamins[i][2]),
                                  "vitamin"
                                ) >= 100
                                ? "success.main"
                                : "text.primary"
                              : "text.primary",
                          }}
                        >
                          {vitamins[i]
                            ? `${calculateRdaPercentage(vitamins[i][0] as keyof typeof VITAMINS_RDA, Number(vitamins[i][2]), "vitamin")}%`
                            : ""}
                        </TableCell>
                        <TableCell sx={{ pl: 4 }}>
                          {minerals[i]?.[1] || ""}
                        </TableCell>
                        <TableCell align="right">
                          {minerals[i]
                            ? `${Number(minerals[i][2]) || 0} ${minerals[i][3]}`
                            : ""}
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            color: minerals[i]
                              ? calculateRdaPercentage(
                                  minerals[i][0] as keyof typeof MINERALS_RDA,
                                  Number(minerals[i][2]),
                                  "mineral"
                                ) >= 100
                                ? "success.main"
                                : "text.primary"
                              : "text.primary",
                          }}
                        >
                          {minerals[i]
                            ? `${calculateRdaPercentage(minerals[i][0] as keyof typeof MINERALS_RDA, Number(minerals[i][2]), "mineral")}%`
                            : ""}
                        </TableCell>
                      </TableRow>
                    ));
                  })()}
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>
      )}

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
