import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Box, Typography, useTheme } from "@mui/material";

interface VitaminsMineralsChartProps {
  entries: any[];
}

interface NutrientData {
  name: string;
  value: number;
  unit: string;
  percentDV: number;
}

export function VitaminsMineralsChart({ entries }: VitaminsMineralsChartProps) {
  const theme = useTheme();

  const vitaminData = useMemo((): NutrientData[] => {
    // In a real application, we would calculate these values from the entries
    // For now, we'll use example data
    return [
      { name: "Vitamin A", value: 800, unit: "μg", percentDV: 89 },
      { name: "Vitamin C", value: 75, unit: "mg", percentDV: 83 },
      { name: "Vitamin D", value: 10, unit: "μg", percentDV: 50 },
      { name: "Vitamin E", value: 14, unit: "mg", percentDV: 93 },
      { name: "Vitamin K", value: 90, unit: "μg", percentDV: 75 },
      { name: "Vitamin B6", value: 1.5, unit: "mg", percentDV: 88 },
      { name: "Vitamin B12", value: 2.4, unit: "μg", percentDV: 100 },
    ];
  }, [entries]);

  const mineralData = useMemo((): NutrientData[] => {
    // In a real application, we would calculate these values from the entries
    // For now, we'll use example data
    return [
      { name: "Calcium", value: 950, unit: "mg", percentDV: 73 },
      { name: "Iron", value: 14, unit: "mg", percentDV: 78 },
      { name: "Magnesium", value: 380, unit: "mg", percentDV: 90 },
      { name: "Potassium", value: 3200, unit: "mg", percentDV: 68 },
      { name: "Zinc", value: 9, unit: "mg", percentDV: 82 },
      { name: "Selenium", value: 45, unit: "μg", percentDV: 82 },
      { name: "Phosphorus", value: 800, unit: "mg", percentDV: 64 },
    ];
  }, [entries]);

  // Custom tooltip
  const renderTooltip = (props: any) => {
    const { active, payload } = props;
    if (active && payload && payload.length) {
      const data = payload[0].payload;
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
          <Typography variant="subtitle2">{data.name}</Typography>
          <Typography variant="body2">
            {data.value} {data.unit} ({data.percentDV}% dziennej wartości)
          </Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Witaminy
      </Typography>
      <Box sx={{ height: 300, mb: 4 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={vitaminData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" domain={[0, 100]} unit="%" />
            <YAxis
              dataKey="name"
              type="category"
              tick={{ fontSize: 12 }}
              width={100}
            />
            <Tooltip content={renderTooltip} />
            <Bar
              dataKey="percentDV"
              name="% Dziennej wartości"
              radius={[0, 4, 4, 0]}
            >
              {vitaminData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.percentDV > 90
                      ? theme.palette.success.main
                      : entry.percentDV > 50
                        ? theme.palette.info.main
                        : theme.palette.warning.main
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>

      <Typography variant="h6" gutterBottom>
        Minerały
      </Typography>
      <Box sx={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={mineralData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" domain={[0, 100]} unit="%" />
            <YAxis
              dataKey="name"
              type="category"
              tick={{ fontSize: 12 }}
              width={100}
            />
            <Tooltip content={renderTooltip} />
            <Bar
              dataKey="percentDV"
              name="% Dziennej wartości"
              radius={[0, 4, 4, 0]}
            >
              {mineralData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.percentDV > 90
                      ? theme.palette.success.main
                      : entry.percentDV > 50
                        ? theme.palette.info.main
                        : theme.palette.warning.main
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}
