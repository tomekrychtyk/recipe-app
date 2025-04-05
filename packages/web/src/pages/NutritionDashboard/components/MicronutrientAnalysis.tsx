import { useMemo } from "react";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Grid,
  LinearProgress,
  Divider,
} from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useTheme } from "@mui/material/styles";

interface MicronutrientAnalysisProps {
  entries: any[];
  timeRange: "day" | "week" | "month";
}

type NutrientKey =
  | "vitaminA"
  | "vitaminC"
  | "vitaminD"
  | "vitaminE"
  | "vitaminK"
  | "vitaminB6"
  | "vitaminB12"
  | "calcium"
  | "iron"
  | "magnesium"
  | "zinc"
  | "potassium"
  | "selenium";

interface NutrientData {
  amount: number;
  unit: string;
  percentDV: number;
}

interface DeficientNutrient extends NutrientData {
  name: NutrientKey;
  foodSources: string[];
}

type NutrientAnalysis = Record<NutrientKey, NutrientData>;

// Define recommended daily values
const recommendedDailyValues: Record<NutrientKey, number> = {
  vitaminA: 900, // μg
  vitaminC: 90, // mg
  vitaminD: 15, // μg
  vitaminE: 15, // mg
  vitaminK: 120, // μg
  vitaminB6: 1.7, // mg
  vitaminB12: 2.4, // μg
  calcium: 1000, // mg
  iron: 18, // mg
  magnesium: 400, // mg
  zinc: 11, // mg
  potassium: 3500, // mg
  selenium: 55, // μg
};

// Food recommendations based on deficient nutrients
const nutrientFoodSources: Record<NutrientKey, string[]> = {
  vitaminA: ["marchewka", "bataty", "szpinak", "jarmuż", "dynia"],
  vitaminC: ["papryka", "pomarańcze", "truskawki", "brokuły", "kiwi"],
  vitaminD: [
    "tłuste ryby",
    "jajka",
    "grzyby",
    "produkty fortyfikowane",
    "wątroba",
  ],
  vitaminE: [
    "orzechy",
    "nasiona słonecznika",
    "olej z awokado",
    "szpinak",
    "oliwa z oliwek",
  ],
  vitaminK: ["jarmuż", "szpinak", "brukselka", "brokuły", "sałata"],
  vitaminB6: ["drób", "ziemniaki", "banany", "nasiona słonecznika", "tuńczyk"],
  vitaminB12: [
    "wątroba",
    "mięso",
    "jajka",
    "nabiał",
    "fortyfikowane produkty roślinne",
  ],
  calcium: [
    "nabiał",
    "sardynki",
    "tofu",
    "migdały",
    "zielone warzywa liściaste",
  ],
  iron: ["czerwone mięso", "fasola", "soczewica", "szpinak", "tofu"],
  magnesium: ["orzechy", "nasiona", "awokado", "fasola", "banany"],
  zinc: ["ostrygi", "wołowina", "krewetki", "pestki dyni", "soczewica"],
  potassium: ["banany", "ziemniaki", "fasola", "awokado", "szpinak"],
  selenium: [
    "orzechy brazylijskie",
    "tuńczyk",
    "łosoś",
    "jajka",
    "brązowy ryż",
  ],
};

export function MicronutrientAnalysis({
  entries,
  timeRange,
}: MicronutrientAnalysisProps) {
  const theme = useTheme();

  // Calculate average daily intake of micronutrients
  const nutrientAnalysis = useMemo((): NutrientAnalysis => {
    // In a real application, we would extract this data from the entries
    // For this example, we'll use mock data with some nutrients intentionally low

    const numberOfDays =
      timeRange === "day" ? 1 : timeRange === "week" ? 7 : 30;

    // Simulated data - in a real app, calculate from food entries
    return {
      vitaminA: { amount: 650, unit: "μg", percentDV: 72 },
      vitaminC: { amount: 45, unit: "mg", percentDV: 50 },
      vitaminD: { amount: 8, unit: "μg", percentDV: 53 },
      vitaminE: { amount: 12, unit: "mg", percentDV: 80 },
      vitaminK: { amount: 100, unit: "μg", percentDV: 83 },
      vitaminB6: { amount: 1.4, unit: "mg", percentDV: 82 },
      vitaminB12: { amount: 2.2, unit: "μg", percentDV: 92 },
      calcium: { amount: 750, unit: "mg", percentDV: 75 },
      iron: { amount: 12, unit: "mg", percentDV: 67 },
      magnesium: { amount: 300, unit: "mg", percentDV: 75 },
      zinc: { amount: 7, unit: "mg", percentDV: 64 },
      potassium: { amount: 2800, unit: "mg", percentDV: 80 },
      selenium: { amount: 40, unit: "μg", percentDV: 73 },
    };
  }, [entries, timeRange]);

  // Identify deficient nutrients (below 70% of daily value)
  const deficientNutrients = useMemo((): DeficientNutrient[] => {
    return Object.entries(nutrientAnalysis)
      .filter(([_, data]) => data.percentDV < 70)
      .map(([nutrient, data]) => ({
        name: nutrient as NutrientKey,
        ...data,
        foodSources: nutrientFoodSources[nutrient as NutrientKey],
      }));
  }, [nutrientAnalysis]);

  // Get user-friendly nutrient names
  const getNutrientName = (key: string): string => {
    const nameMap: Record<string, string> = {
      vitaminA: "Witamina A",
      vitaminC: "Witamina C",
      vitaminD: "Witamina D",
      vitaminE: "Witamina E",
      vitaminK: "Witamina K",
      vitaminB6: "Witamina B6",
      vitaminB12: "Witamina B12",
      calcium: "Wapń",
      iron: "Żelazo",
      magnesium: "Magnez",
      zinc: "Cynk",
      potassium: "Potas",
      selenium: "Selen",
    };
    return nameMap[key] || key;
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Analiza mikroskładników
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Na podstawie analizy Twojej diety w wybranym okresie, zidentyfikowaliśmy
        następujące obszary do poprawy:
      </Typography>

      {deficientNutrients.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 2,
            border: 1,
            borderColor: theme.palette.success.main,
            bgcolor: theme.palette.success.light + "20",
            borderRadius: 2,
            mb: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <CheckCircleIcon
              sx={{ color: theme.palette.success.main, mr: 1 }}
            />
            <Typography variant="body1">
              Twoja dieta jest dobrze zbilansowana pod kątem mikroskładników!
            </Typography>
          </Box>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {deficientNutrients.map((nutrient) => (
            <Grid item xs={12} key={nutrient.name}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  border: 1,
                  borderColor: theme.palette.warning.main,
                  bgcolor: theme.palette.warning.light + "20",
                  borderRadius: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <WarningIcon
                    sx={{ color: theme.palette.warning.main, mr: 1 }}
                  />
                  <Typography variant="body1" fontWeight="medium">
                    Niedobór: {getNutrientName(nutrient.name)}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 0.5,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Spożycie: {nutrient.amount} {nutrient.unit}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {nutrient.percentDV}% zalecanej ilości
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={nutrient.percentDV}
                    sx={{
                      height: 8,
                      borderRadius: 1,
                      bgcolor: theme.palette.grey[200],
                      "& .MuiLinearProgress-bar": {
                        bgcolor:
                          nutrient.percentDV < 50
                            ? theme.palette.error.main
                            : theme.palette.warning.main,
                      },
                    }}
                  />
                </Box>

                <Typography variant="body2" sx={{ mb: 1 }}>
                  Rozważ spożywanie produktów bogatych w{" "}
                  {getNutrientName(nutrient.name).toLowerCase()}:
                </Typography>

                <Box>
                  {nutrient.foodSources.map((food: string, index: number) => (
                    <Chip
                      key={index}
                      label={food}
                      variant="outlined"
                      size="small"
                      sx={{ m: 0.5 }}
                    />
                  ))}
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      <Divider sx={{ my: 3 }} />

      <Typography variant="subtitle2" sx={{ mb: 2 }}>
        Ogólny przegląd spożycia mikroskładników
      </Typography>

      <Grid container spacing={1}>
        {Object.entries(nutrientAnalysis).map(([nutrient, data]) => (
          <Grid item xs={12} sm={6} md={4} key={nutrient}>
            <Box sx={{ px: 1, py: 0.5 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2">
                  {getNutrientName(nutrient)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {data.percentDV}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={data.percentDV > 100 ? 100 : data.percentDV}
                sx={{
                  height: 5,
                  borderRadius: 1,
                  bgcolor: theme.palette.grey[200],
                  "& .MuiLinearProgress-bar": {
                    bgcolor:
                      data.percentDV < 50
                        ? theme.palette.error.main
                        : data.percentDV < 70
                          ? theme.palette.warning.main
                          : theme.palette.success.main,
                  },
                }}
              />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
