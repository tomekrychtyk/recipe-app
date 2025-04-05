import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { Box, Typography, useTheme } from "@mui/material";

interface NutrientDistributionChartProps {
  entries: any[];
  detailedView?: boolean;
}

export function NutrientDistributionChart({
  entries,
  detailedView = false,
}: NutrientDistributionChartProps) {
  const theme = useTheme();

  const chartData = useMemo(() => {
    // Calculate total nutrients from all entries
    const totalNutrients = entries.reduce(
      (acc, entry) => {
        // Calculate nutrients for the entry
        const calculateEntryNutrients = (entry: any) => {
          let totalProteins = 0;
          let totalCarbs = 0;
          let totalFats = 0;

          if (entry.meal) {
            totalProteins += entry.meal.totalNutrients.proteins;
            totalCarbs += entry.meal.totalNutrients.carbs;
            totalFats += entry.meal.totalNutrients.fats;
          } else if (entry.ingredients && entry.ingredients.length > 0) {
            entry.ingredients.forEach((ingredient: any) => {
              // Calculate based on weight per 100g
              const multiplier = ingredient.amount / 100;
              totalProteins += ingredient.ingredient.proteins * multiplier;
              totalCarbs += ingredient.ingredient.carbs * multiplier;
              totalFats += ingredient.ingredient.fats * multiplier;
            });
          }

          return {
            proteins: totalProteins,
            carbs: totalCarbs,
            fats: totalFats,
          };
        };

        const { proteins, carbs, fats } = calculateEntryNutrients(entry);

        return {
          proteins: acc.proteins + proteins,
          carbs: acc.carbs + carbs,
          fats: acc.fats + fats,
        };
      },
      { proteins: 0, carbs: 0, fats: 0 }
    );

    // Convert to array for pie chart
    return [
      {
        name: "Białko",
        value: totalNutrients.proteins,
        calories: totalNutrients.proteins * 4,
      },
      {
        name: "Węglowodany",
        value: totalNutrients.carbs,
        calories: totalNutrients.carbs * 4,
      },
      {
        name: "Tłuszcze",
        value: totalNutrients.fats,
        calories: totalNutrients.fats * 9,
      },
    ];
  }, [entries]);

  const totalCalories = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.calories, 0);
  }, [chartData]);

  const calculatePercentage = (calories: number) => {
    return totalCalories > 0
      ? ((calories / totalCalories) * 100).toFixed(1)
      : "0";
  };

  // Colors for pie chart segments
  const COLORS = [
    theme.palette.primary.main, // Proteins
    theme.palette.secondary.main, // Carbs
    "#FF9800", // Fats
  ];

  // Custom formatter for tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <Box
          sx={{
            bgcolor: "background.paper",
            p: 1.5,
            border: 1,
            borderColor: "divider",
            borderRadius: 1,
            boxShadow: 1,
          }}
        >
          <Typography variant="subtitle2">{item.name}</Typography>
          <Typography variant="body2">
            {item.value.toFixed(1)}g ({calculatePercentage(item.calories)}%)
          </Typography>
          <Typography variant="body2">
            {item.calories.toFixed(0)} kcal
          </Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <Box sx={{ width: "100%", height: "100%", position: "relative" }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={detailedView ? 70 : 0}
            outerRadius={detailedView ? 100 : 80}
            paddingAngle={2}
            dataKey="calories"
            label={({ name, value, percent }) =>
              detailedView ? `${name} (${(percent * 100).toFixed(0)}%)` : ""
            }
            labelLine={detailedView}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            layout={detailedView ? "horizontal" : "vertical"}
            align={detailedView ? "center" : "right"}
            formatter={(value, entry, index) => {
              const item = chartData[index];
              return `${value}: ${calculatePercentage(item.calories)}%`;
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      {!detailedView && (
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
          }}
        >
          <Typography variant="h6" component="div">
            {Math.round(totalCalories)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            kcal
          </Typography>
        </Box>
      )}
    </Box>
  );
}
