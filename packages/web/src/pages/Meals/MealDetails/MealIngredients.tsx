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
  Typography,
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
            <TableCell>
              <Typography sx={{ fontWeight: 700 }}>Składnik</Typography>
            </TableCell>
            <TableCell align="right">
              <Typography sx={{ fontWeight: 700 }}>Ilość (g)</Typography>
            </TableCell>
            <TableCell align="right">
              <Typography sx={{ fontWeight: 700 }}>Białko (g)</Typography>
            </TableCell>
            <TableCell align="right">
              <Typography sx={{ fontWeight: 700 }}>Węglowodany (g)</Typography>
            </TableCell>
            <TableCell align="right">
              <Typography sx={{ fontWeight: 700 }}>Tłuszcze (g)</Typography>
            </TableCell>
            <TableCell align="right">
              <Typography sx={{ fontWeight: 700 }}>Kalorie (kcal)</Typography>
            </TableCell>
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
            <TableCell>
              <Typography sx={{ fontWeight: 700 }} color="black">
                Na 1 porcję
              </Typography>
            </TableCell>
            <TableCell align="right">
              <Typography sx={{ fontWeight: 700 }} color="black">
                {totalWeightSinglePortion}
              </Typography>
            </TableCell>
            <TableCell align="right">
              <Typography sx={{ fontWeight: 700 }} color="black">
                {meal.totalNutrients.proteins.toFixed(1)}
              </Typography>
            </TableCell>
            <TableCell align="right">
              <Typography sx={{ fontWeight: 700 }} color="black">
                {meal.totalNutrients.carbs.toFixed(1)}
              </Typography>
            </TableCell>
            <TableCell align="right">
              <Typography sx={{ fontWeight: 700 }} color="black">
                {meal.totalNutrients.fats.toFixed(1)}
              </Typography>
            </TableCell>
            <TableCell align="right">
              <Typography sx={{ fontWeight: 700 }} color="black">
                {meal.totalNutrients.calories.toFixed(1)}
              </Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};
