import { Box, Typography, Tooltip } from "@mui/material";
import {
  VITAMINS_RDA,
  MINERALS_RDA,
} from "@food-recipe-app/common/src/constants/rda";
import type { Meal } from "@food-recipe-app/common";
import { HorizontalGraph } from "../HorizontalGraph";

interface Props {
  totalNutrients: Meal["totalNutrients"];
}

export function NutrientRDAGraph({ totalNutrients }: Props) {
  const calculatePercentage = (value: number, rdaValue: number) => {
    return Math.min((value / rdaValue) * 100, Infinity);
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Witaminy i minerały
      </Typography>

      <Box sx={{ display: "grid", gridTemplateColumns: "1fr", gap: 1 }}>
        {Object.entries({ ...VITAMINS_RDA, ...MINERALS_RDA }).map(
          ([nutrient, rdaValue]) => {
            const value =
              totalNutrients[nutrient as keyof typeof totalNutrients];
            const percentage = calculatePercentage(value, rdaValue.value);

            return (
              <Tooltip
                key={nutrient}
                title={`${value.toFixed(1)} / ${rdaValue.value} ${rdaValue.unit}`}
                arrow
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: "0.75rem",
                      width: 120,
                      flexShrink: 0,
                    }}
                  >
                    {rdaValue.label} ({percentage.toFixed(0)}%)
                  </Typography>
                  <Box
                    sx={{
                      height: 16,
                      flexGrow: 1,
                      bgcolor: "grey.400",
                      borderRadius: 1,
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    <HorizontalGraph percentage={percentage} />
                  </Box>
                </Box>
              </Tooltip>
            );
          }
        )}
      </Box>
    </Box>
  );
}
