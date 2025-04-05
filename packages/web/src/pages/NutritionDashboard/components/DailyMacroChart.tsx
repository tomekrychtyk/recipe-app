import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { parseISO, format } from "date-fns";
import { pl } from "date-fns/locale";
import { Box, useTheme } from "@mui/material";

interface DailyMacroChartProps {
  entries: any[];
  timeRange: "day" | "week" | "month";
}

interface FoodEntry {
  date: string;
  meal?: {
    totalNutrients: {
      proteins: number;
      carbs: number;
      fats: number;
    };
  };
  ingredients?: {
    amount: number;
    ingredient: {
      proteins: number;
      carbs: number;
      fats: number;
    };
  }[];
}

interface IngredientEntry {
  amount: number;
  ingredient: {
    proteins: number;
    carbs: number;
    fats: number;
  };
}

export function DailyMacroChart({ entries, timeRange }: DailyMacroChartProps) {
  const theme = useTheme();

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
          rawDate: date,
        });
      }

      const dateData = dateMap.get(formattedDate);

      // Calculate nutrients for the entry
      const calculateEntryNutrients = (entry: FoodEntry) => {
        let totalProteins = 0;
        let totalCarbs = 0;
        let totalFats = 0;

        if (entry.meal) {
          totalProteins += entry.meal.totalNutrients.proteins;
          totalCarbs += entry.meal.totalNutrients.carbs;
          totalFats += entry.meal.totalNutrients.fats;
        } else if (entry.ingredients && entry.ingredients.length > 0) {
          entry.ingredients.forEach((ingredient: IngredientEntry) => {
            // Calculate based on weight per 100g
            const multiplier = ingredient.amount / 100;
            totalProteins += ingredient.ingredient.proteins * multiplier;
            totalCarbs += ingredient.ingredient.carbs * multiplier;
            totalFats += ingredient.ingredient.fats * multiplier;
          });
        }

        return { proteins: totalProteins, carbs: totalCarbs, fats: totalFats };
      };

      const { proteins, carbs, fats } = calculateEntryNutrients(entry);

      // Add to daily totals
      dateData.proteins += proteins;
      dateData.carbs += carbs;
      dateData.fats += fats;
    });

    // Convert map to array and sort by date
    return Array.from(dateMap.values()).sort(
      (a, b) => new Date(a.rawDate).getTime() - new Date(b.rawDate).getTime()
    );
  }, [entries]);

  // Custom tooltip formatter
  const formatTooltip = (value: number) => `${value.toFixed(1)}g`;

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} height={50} />
          <YAxis
            label={{
              value: "Ilość (g)",
              angle: -90,
              position: "insideLeft",
              style: { textAnchor: "middle" },
            }}
            tick={{ fontSize: 12 }}
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
          <Bar
            name="Białko"
            dataKey="proteins"
            fill={theme.palette.primary.main}
            stackId="a"
          />
          <Bar
            name="Węglowodany"
            dataKey="carbs"
            fill={theme.palette.secondary.main}
            stackId="a"
          />
          <Bar name="Tłuszcze" dataKey="fats" fill="#FF9800" stackId="a" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}
