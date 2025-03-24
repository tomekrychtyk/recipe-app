import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { theme } from "./theme";
import { Layout } from "./components/Layout";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/Home";
import { AddIngredient } from "./pages/Ingredients/AddIngredient";
import { Ingredients } from "./pages/Ingredients";
import { Provider } from "react-redux";
import { store } from "./store";
import { Meals, AddMeal, EditMeal, MealDetails } from "./pages/Meals";
import { MealSuggestions } from "./pages/MealSuggestions/MealSuggestions";

export function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ width: "100vw", minHeight: "100vh" }}>
          <BrowserRouter>
            <Layout>
              <Box sx={{ width: "100%", p: 4 }}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/ingredients" element={<Ingredients />} />
                  <Route path="/ingredients/new" element={<AddIngredient />} />
                  <Route path="/meals" element={<Meals />} />
                  <Route path="/meals/new" element={<AddMeal />} />
                  <Route path="/meals/:id/edit" element={<EditMeal />} />
                  <Route path="/meals/:id" element={<MealDetails />} />
                  <Route
                    path="/meal-suggestions"
                    element={<MealSuggestions />}
                  />
                </Routes>
              </Box>
            </Layout>
          </BrowserRouter>
        </Box>
      </ThemeProvider>
    </Provider>
  );
}
