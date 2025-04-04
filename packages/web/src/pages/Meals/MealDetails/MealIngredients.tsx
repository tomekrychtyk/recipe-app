import { Meal } from "@food-recipe-app/common";
import {
  Box,
  TableHead,
  TableBody,
  TableRow,
  Paper,
  TableContainer,
  Table,
  TableCell,
  Chip,
} from "@mui/material";
import { getCategoryColor, getCategoryName } from "../../../utils";

interface MealIngredientsProps {
  meal: Meal;
  portions: number;
}

export const MealIngredients = ({
  meal,
  portions = 1,
}: MealIngredientsProps) => {
  // Calculate total meal weight (for a single portion)
  const totalWeightSinglePortion = meal.ingredients.reduce(
    (sum, { amount }) => sum + amount,
    0
  );

  // Total weight with portions
  const totalWeight = totalWeightSinglePortion * portions;

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Składnik</TableCell>
            <TableCell align="right">Ilość (g)</TableCell>
            <TableCell align="right">Białko (g)</TableCell>
            <TableCell align="right">Węglowodany (g)</TableCell>
            <TableCell align="right">Tłuszcze (g)</TableCell>
            <TableCell align="right">Kalorie (kcal)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {meal.ingredients.map(({ ingredient, amount }) => {
            // Scale amount by portions
            const scaledAmount = amount * portions;
            const multiplier = scaledAmount / 100;

            return (
              <TableRow key={ingredient.id}>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {ingredient.name}
                    <Chip
                      label={getCategoryName(ingredient.categoryId)}
                      color={getCategoryColor(ingredient.categoryId)}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                </TableCell>
                <TableCell align="right">{scaledAmount}</TableCell>
                <TableCell align="right">
                  {(ingredient.proteins * multiplier).toFixed(1)}
                </TableCell>
                <TableCell align="right">
                  {(ingredient.carbs * multiplier).toFixed(1)}
                </TableCell>
                <TableCell align="right">
                  {(ingredient.fats * multiplier).toFixed(1)}
                </TableCell>
                <TableCell align="right">
                  {(ingredient.calories * multiplier).toFixed(1)}
                </TableCell>
              </TableRow>
            );
          })}

          {/* Total row */}
          <TableRow
            sx={{
              "& > td": { fontWeight: "bold" },
              backgroundColor: (theme) => theme.palette.action.hover,
            }}
          >
            <TableCell>
              Suma ({portions}{" "}
              {portions === 1 ? "porcja" : portions < 5 ? "porcje" : "porcji"})
            </TableCell>
            <TableCell align="right">{totalWeight}</TableCell>
            <TableCell align="right">
              {(meal.totalNutrients.proteins * portions).toFixed(1)}
            </TableCell>
            <TableCell align="right">
              {(meal.totalNutrients.carbs * portions).toFixed(1)}
            </TableCell>
            <TableCell align="right">
              {(meal.totalNutrients.fats * portions).toFixed(1)}
            </TableCell>
            <TableCell align="right">
              {(meal.totalNutrients.calories * portions).toFixed(1)}
            </TableCell>
          </TableRow>

          {/* Per portion row */}
          <TableRow
            sx={{
              "& > td": { fontWeight: "bold" },
              backgroundColor: (theme) => theme.palette.primary.light,
              color: (theme) => theme.palette.primary.contrastText,
            }}
          >
            <TableCell>Na 1 porcję</TableCell>
            <TableCell align="right">{totalWeightSinglePortion}</TableCell>
            <TableCell align="right">
              {meal.totalNutrients.proteins.toFixed(1)}
            </TableCell>
            <TableCell align="right">
              {meal.totalNutrients.carbs.toFixed(1)}
            </TableCell>
            <TableCell align="right">
              {meal.totalNutrients.fats.toFixed(1)}
            </TableCell>
            <TableCell align="right">
              {meal.totalNutrients.calories.toFixed(1)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};
