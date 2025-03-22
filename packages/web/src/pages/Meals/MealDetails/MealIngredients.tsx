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

export const MealIngredients = ({ meal }: { meal: Meal }) => (
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
          const multiplier = amount / 100;
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
              <TableCell align="right">{amount}</TableCell>
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
      </TableBody>
    </Table>
  </TableContainer>
);
