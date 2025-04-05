import { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { parseISO, format } from "date-fns";
import { pl } from "date-fns/locale";
import { Box, useTheme, ToggleButtonGroup, ToggleButton } from "@mui/material";

interface MonthlyNutrientChartProps {
  entries: any[];
}

type NutrientType = "proteins" | "carbs" | "fats" | "calories" | "all";

export function MonthlyNutrientChart({ entries }: MonthlyNutrientChartProps) {
  const theme = useTheme();
  const [nutrientType, setNutrientType] = useState<NutrientType>("all");

  const chartData = useMemo(() => {
    // Create date map for entries
    const dateMap = new Map();

    // Process each entry
    entries.forEach((entry) => {
      const date = entry.date;
      const formattedDate = format(parseISO(date), "dd/MM", { locale: pl });

      // Initialize or get the current date's data
      if (!dateMap.has(formattedDate)) {
        dateMap.set(formattedDate, {
          date: formattedDate,
          proteins: 0,
          carbs: 0,
          fats: 0,
          calories: 0,
          rawDate: date,
        });
      }

      const dateData = dateMap.get(formattedDate);

      // Calculate nutrients for the entry
      const calculateEntryNutrients = (entry: any) => {
        let totalProteins = 0;
        let totalCarbs = 0;
        let totalFats = 0;
        let totalCalories = 0;

        if (entry.meal) {
          totalProteins += entry.meal.totalNutrients.proteins;
          totalCarbs += entry.meal.totalNutrients.carbs;
          totalFats += entry.meal.totalNutrients.fats;
          totalCalories += entry.meal.totalNutrients.calories;
        } else if (entry.ingredients && entry.ingredients.length > 0) {
          entry.ingredients.forEach((ingredient: any) => {
            // Calculate based on weight per 100g
            const multiplier = ingredient.amount / 100;
            totalProteins += ingredient.ingredient.proteins * multiplier;
            totalCarbs += ingredient.ingredient.carbs * multiplier;
            totalFats += ingredient.ingredient.fats * multiplier;
            totalCalories += ingredient.ingredient.calories * multiplier;
          });
        }

        return {
          proteins: totalProteins,
          carbs: totalCarbs,
          fats: totalFats,
          calories: totalCalories,
        };
      };

      const nutrients = calculateEntryNutrients(entry);

      // Add to daily totals
      dateData.proteins += nutrients.proteins;
      dateData.carbs += nutrients.carbs;
      dateData.fats += nutrients.fats;
      dateData.calories += nutrients.calories;
    });

    // Convert map to array and sort by date
    return Array.from(dateMap.values()).sort(
      (a, b) => new Date(a.rawDate).getTime() - new Date(b.rawDate).getTime()
    );
  }, [entries]);

  // Handle nutrient type change
  const handleNutrientTypeChange = (
    event: React.MouseEvent<HTMLElement>,
    newNutrientType: NutrientType | null
  ) => {
    if (newNutrientType !== null) {
      setNutrientType(newNutrientType);
    }
  };

  // Get y-axis label based on nutrient type
  const getYAxisLabel = () => {
    switch (nutrientType) {
      case "proteins":
      case "carbs":
      case "fats":
        return "Ilość (g)";
      case "calories":
        return "Kalorie (kcal)";
      default:
        return "";
    }
  };

  // Custom tooltip formatter
  const formatTooltip = (value: number, name: string) => {
    if (name === "calories") {
      return `${value.toFixed(0)} kcal`;
    }
    return `${value.toFixed(1)}g`;
  };

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
        <ToggleButtonGroup
          value={nutrientType}
          exclusive
          onChange={handleNutrientTypeChange}
          aria-label="typ składnika"
          size="small"
        >
          <ToggleButton value="all">Wszystkie</ToggleButton>
          <ToggleButton value="proteins">Białko</ToggleButton>
          <ToggleButton value="carbs">Węglowodany</ToggleButton>
          <ToggleButton value="fats">Tłuszcze</ToggleButton>
          <ToggleButton value="calories">Kalorie</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <ResponsiveContainer width="100%" height="80%">
        <LineChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} height={50} />
          <YAxis
            label={{
              value: getYAxisLabel(),
              angle: -90,
              position: "insideLeft",
              style: { textAnchor: "middle" },
            }}
            tick={{ fontSize: 12 }}
            domain={["auto", "auto"]}
          />
          <Tooltip
            formatter={formatTooltip}
            contentStyle={{
              backgroundColor: theme.palette.background.paper,
              borderColor: theme.palette.divider,
              borderRadius: 4,
            }}
          />
          <Legend wrapperStyle={{ paddingTop: 10 }} />

          {(nutrientType === "all" || nutrientType === "proteins") && (
            <Line
              type="monotone"
              name="Białko"
              dataKey="proteins"
              stroke={theme.palette.primary.main}
              strokeWidth={2}
              dot={{ strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          )}

          {(nutrientType === "all" || nutrientType === "carbs") && (
            <Line
              type="monotone"
              name="Węglowodany"
              dataKey="carbs"
              stroke={theme.palette.secondary.main}
              strokeWidth={2}
              dot={{ strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          )}

          {(nutrientType === "all" || nutrientType === "fats") && (
            <Line
              type="monotone"
              name="Tłuszcze"
              dataKey="fats"
              stroke="#FF9800"
              strokeWidth={2}
              dot={{ strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          )}

          {nutrientType === "calories" && (
            <Line
              type="monotone"
              name="Kalorie"
              dataKey="calories"
              stroke="#E91E63"
              strokeWidth={2}
              dot={{ strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}
