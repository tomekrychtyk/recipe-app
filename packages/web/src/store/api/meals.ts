import type {
  Meal,
  Ingredient,
  MealIngredientInput,
  MealInput,
} from "@food-recipe-app/common";
import { baseApi } from "./base";

export const mealsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMeals: builder.query<Meal[], void>({
      query: () => "/meals",
      providesTags: ["Meal"],
    }),
    getMealById: builder.query<
      Meal & { ingredients: Array<{ ingredient: Ingredient }> },
      number
    >({
      query: (id) => `/meals/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Meal", id }],
    }),
    addMeal: builder.mutation<Meal, MealInput>({
      query: (meal) => ({
        url: "/meals",
        method: "POST",
        body: meal,
      }),
      invalidatesTags: ["Meal"],
    }),
    updateMeal: builder.mutation<
      Meal,
      {
        id: number;
        name: string;
        description?: string;
        ingredients: MealIngredientInput[];
      }
    >({
      query: (meal) => ({
        url: `/meals/${meal.id}`,
        method: "PUT",
        body: meal,
      }),
      invalidatesTags: ["Meal"],
    }),
    deleteMeal: builder.mutation<void, number>({
      query: (id) => ({
        url: `/meals/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Meal"],
    }),
  }),
});

export const {
  useGetMealsQuery,
  useGetMealByIdQuery,
  useAddMealMutation,
  useUpdateMealMutation,
  useDeleteMealMutation,
} = mealsApi;
