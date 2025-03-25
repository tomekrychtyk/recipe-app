import { Card, CardContent, CardActionArea, Typography } from "@mui/material";
import type { Meal } from "@food-recipe-app/common";
import { useNavigate } from "react-router-dom";

interface MealCardProps {
  meal: Meal;
}

export function MealCard({ meal }: MealCardProps) {
  const navigate = useNavigate();

  return (
    <Card>
      <CardActionArea onClick={() => navigate(`/meals/${meal.id}`)}>
        <CardContent>
          <Typography variant="h6" component="div" gutterBottom>
            {meal.name}
          </Typography>
          {meal.description && (
            <Typography variant="body2" color="text.secondary">
              {meal.description}
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
