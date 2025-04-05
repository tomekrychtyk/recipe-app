import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { parseISO, format } from "date-fns";
import { pl } from "date-fns/locale";
import { Box, useTheme } from "@mui/material";

interface WeeklyCaloriesChartProps {
  entries: any[];
  timeRange: "day" | "week" | "month";
  detailedView?: boolean;
}

export function WeeklyCaloriesChart({
  entries,
  timeRange,
  detailedView = false,
}: WeeklyCaloriesChartProps) {
  const theme = useTheme();

  // Target calorie intake (example - this could come from user settings)
  const targetDailyCalories = 2000;

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
          calories: 0,
          rawDate: date,
        });
      }

      const dateData = dateMap.get(formattedDate);

      // Calculate calories for the entry
      const calculateEntryCalories = (entry: any) => {
        let totalCalories = 0;

        if (entry.meal) {
          totalCalories += entry.meal.totalNutrients.calories;
        } else if (entry.ingredients && entry.ingredients.length > 0) {
          entry.ingredients.forEach((ingredient: any) => {
            // Calculate based on weight per 100g
            const multiplier = ingredient.amount / 100;
            totalCalories += ingredient.ingredient.calories * multiplier;
          });
        }

        return totalCalories;
      };

      // Add to daily totals
      dateData.calories += calculateEntryCalories(entry);
    });

    // Convert map to array and sort by date
    return Array.from(dateMap.values()).sort(
      (a, b) => new Date(a.rawDate).getTime() - new Date(b.rawDate).getTime()
    );
  }, [entries]);

  // Custom tooltip formatter
  const formatTooltip = (value: number) => `${value.toFixed(0)} kcal`;

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} height={50} />
          <YAxis
            label={{
              value: "Kalorie (kcal)",
              angle: -90,
              position: "insideLeft",
              style: { textAnchor: "middle" },
            }}
            tick={{ fontSize: 12 }}
            domain={detailedView ? ["auto", "auto"] : [0, "auto"]}
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
          <Line
            type="monotone"
            name="Kalorie"
            dataKey="calories"
            stroke={theme.palette.primary.main}
            strokeWidth={2}
            dot={{ strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
          />
          {detailedView && (
            <ReferenceLine
              y={targetDailyCalories}
              label={{ value: "Cel", position: "right" }}
              stroke={theme.palette.success.main}
              strokeDasharray="3 3"
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}
