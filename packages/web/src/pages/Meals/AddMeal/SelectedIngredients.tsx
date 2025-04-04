import { Ingredient } from "@food-recipe-app/common";
import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

interface SelectedIngredient {
  ingredient: Ingredient;
  amount: number;
}

interface TotalNutrients {
  proteins: number;
  carbs: number;
  fats: number;
  calories: number;
}

export const SelectedIngredients = ({
  selectedIngredients,
  totalNutrients,
  handleRemoveIngredient,
}: {
  selectedIngredients: SelectedIngredient[];
  totalNutrients: TotalNutrients;
  handleRemoveIngredient: (index: number) => void;
}) => (
  <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Składnik</TableCell>
          <TableCell align="right">Ilość (g)</TableCell>
          <TableCell align="right">Białko (g)</TableCell>
          <TableCell align="right">Węglowodany (g)</TableCell>
          <TableCell align="right">Tłuszcze (g)</TableCell>
          <TableCell align="right">Kalorie (kcal)</TableCell>
          <TableCell align="right">Akcje</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {selectedIngredients.map(({ ingredient, amount }, index) => {
          const multiplier = amount / 100;
          return (
            <TableRow key={index}>
              <TableCell>{ingredient.name}</TableCell>
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
              <TableCell align="right">
                <IconButton
                  onClick={() => handleRemoveIngredient(index)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          );
        })}
        <TableRow>
          <TableCell>
            <strong>Total</strong>
          </TableCell>
          <TableCell align="right">-</TableCell>
          <TableCell align="right">
            <strong>{totalNutrients.proteins.toFixed(1)}</strong>
          </TableCell>
          <TableCell align="right">
            <strong>{totalNutrients.carbs.toFixed(1)}</strong>
          </TableCell>
          <TableCell align="right">
            <strong>{totalNutrients.fats.toFixed(1)}</strong>
          </TableCell>
          <TableCell align="right">
            <strong>{totalNutrients.calories.toFixed(1)}</strong>
          </TableCell>
          <TableCell />
        </TableRow>
      </TableBody>
    </Table>
  </TableContainer>
);
