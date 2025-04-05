import { baseApi } from "./base";

// Define interfaces similar to food diary
interface PlannedMeal {
  id: number;
  userId: string;
  date: string;
  time: string;
  name: string;
  mealId?: number;
  meal?: any; // Will extend this later when we implement the backend
  ingredients: Array<{
    ingredientId: number;
    ingredient: any; // Will extend this later
    amount: number;
  }>;
  createdAt: string;
  updatedAt: string;
}

interface CreatePlannedMealInput {
  userId: string;
  date: string;
  time: string;
  name: string;
  mealId?: number;
  ingredients: Array<{
    ingredientId: number;
    amount: number;
  }>;
}

interface GetPlannedMealsParams {
  userId: string;
  date?: string;
}

export const mealPlannerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPlannedMeals: builder.query<PlannedMeal[], GetPlannedMealsParams>({
      query: (params) => ({
        url: "/meal-planner",
        params,
      }),
      providesTags: ["MealPlanner"],
    }),
    addPlannedMeal: builder.mutation<PlannedMeal, CreatePlannedMealInput>({
      query: (entry) => ({
        url: "/meal-planner",
        method: "POST",
        body: entry,
      }),
      invalidatesTags: ["MealPlanner"],
    }),
    deletePlannedMeal: builder.mutation<void, number>({
      query: (id) => ({
        url: `/meal-planner/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["MealPlanner"],
    }),
    addPlannedMealToDiary: builder.mutation<void, number>({
      query: (id) => ({
        url: `/meal-planner/${id}/add-to-diary`,
        method: "POST",
      }),
      invalidatesTags: ["FoodDiary"],
    }),
  }),
});

export const {
  useGetPlannedMealsQuery,
  useAddPlannedMealMutation,
  useDeletePlannedMealMutation,
  useAddPlannedMealToDiaryMutation,
} = mealPlannerApi;
