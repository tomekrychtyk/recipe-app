import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { theme } from "./theme";
import { Layout } from "./components/Layout";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
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
import { FoodDiary } from "./pages/FoodDiary/FoodDiary";
import { Pricing } from "./pages/Pricing/Pricing";
import { MealPlanner } from "./pages/MealPlanner";
import { ShoppingList, ShoppingListDetail } from "./pages/ShoppingList";

export function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
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
                      <Route path="/pricing" element={<Pricing />} />
                      <Route
                        path="/meal-suggestions"
                        element={<MealSuggestions />}
                      />

                      {/* Protected Routes */}
                      <Route
                        path="/ingredients"
                        element={
                          <ProtectedRoute requireAdmin>
                            <Ingredients />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        element={
                          <ProtectedRoute>
                            <Outlet />
                          </ProtectedRoute>
                        }
                      >
                        <Route path="/my-meals" element={<MyMeals />} />
                        <Route path="/food-diary" element={<FoodDiary />} />
                        <Route path="/meal-planner" element={<MealPlanner />} />
                        <Route
                          path="/shopping-list"
                          element={<ShoppingList />}
                        />
                        <Route
                          path="/shopping-list/:id"
                          element={<ShoppingListDetail />}
                        />
                        <Route path="/meals/new" element={<AddMeal />} />
                        <Route
                          path="/meals/:id/edit"
                          element={
                            <ProtectedRoute>
                              <EditMeal />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/ingredients/new"
                          element={
                            <ProtectedRoute requireAdmin>
                              <AddIngredient />
                            </ProtectedRoute>
                          }
                        />
                      </Route>
                    </Routes>
                  </Box>
                </Layout>
              </BrowserRouter>
            </Box>
          </LocalizationProvider>
        </ThemeProvider>
      </AuthProvider>
    </Provider>
  );
}
