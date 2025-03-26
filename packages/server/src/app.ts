import express from "express";
import cors from "cors";
import ingredientsRoutes from "./routes/ingredients";
import mealsRoutes from "./routes/meals";
import foodDiaryRoutes from "./routes/foodDiary";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/ingredients", ingredientsRoutes);
app.use("/api/meals", mealsRoutes);
app.use("/api/food-diary", foodDiaryRoutes);

export default app;
