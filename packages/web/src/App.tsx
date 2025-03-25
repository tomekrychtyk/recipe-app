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
import { MyMeals } from "./pages/Meals/MyMeals";
import { MealSuggestions } from "./pages/MealSuggestions/MealSuggestions";
import { AuthProvider } from "./contexts/AuthContext";
import { LoginPage } from "./pages/LoginPage";
import { AuthCallbackPage } from "./pages/AuthCallbackPage";
import { ProtectedRoute } from "./components/ProtectedRoute";

export function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Box sx={{ width: "100vw", minHeight: "100vh" }}>
            <BrowserRouter>
              <Layout>
                <Box sx={{ width: "100%", p: 4 }}>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route
                      path="/auth/callback"
                      element={<AuthCallbackPage />}
                    />

                    {/* Public Routes */}
                    <Route path="/meals" element={<Meals />} />
                    <Route path="/meals/:id" element={<MealDetails />} />

                    {/* Protected Routes */}
                    <Route
                      path="/my-meals"
                      element={
                        <ProtectedRoute>
                          <MyMeals />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/meals/new"
                      element={
                        <ProtectedRoute>
                          <AddMeal />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/meals/:id/edit"
                      element={
                        <ProtectedRoute>
                          <EditMeal />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/ingredients"
                      element={
                        <ProtectedRoute>
                          <Ingredients />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/ingredients/new"
                      element={
                        <ProtectedRoute>
                          <AddIngredient />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/meal-suggestions"
                      element={
                        <ProtectedRoute>
                          <MealSuggestions />
                        </ProtectedRoute>
                      }
                    />
                  </Routes>
                </Box>
              </Layout>
            </BrowserRouter>
          </Box>
        </ThemeProvider>
      </AuthProvider>
    </Provider>
  );
}
