import express from "express";
import cors from "cors";
import ingredientsRoutes from "./routes/ingredients";
import mealsRoutes from "./routes/meals";
import foodDiaryRoutes from "./routes/foodDiary";

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://recipe-app-web.vercel.app",
  "https://dabelo.pl",
  "https://www.dabelo.pl",
];

// deploy trigger 1
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/ingredients", ingredientsRoutes);
app.use("/api/meals", mealsRoutes);
app.use("/api/food-diary", foodDiaryRoutes);

export default app;
