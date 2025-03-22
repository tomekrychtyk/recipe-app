import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Ingredient, Meal } from "@food-recipe-app/common";

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:4000/api" }),
  tagTypes: ["Ingredient", "Meal"],
  endpoints: (builder) => ({
    getIngredients: builder.query<Ingredient[], void>({
      query: () => "/ingredients",
      providesTags: ["Ingredient"],
    }),
    addIngredient: builder.mutation<Ingredient, Omit<Ingredient, "id">>({
      query: (ingredient) => ({
        url: "/ingredients",
        method: "POST",
        body: ingredient,
      }),
      invalidatesTags: ["Ingredient"],
    }),
    getMeals: builder.query<Meal[], void>({
      query: () => "/meals",
      providesTags: ["Meal"],
    }),
    addMeal: builder.mutation<Meal, Omit<Meal, "id" | "totalNutrients">>({
      query: (meal) => ({
        url: "/meals",
        method: "POST",
        body: meal,
      }),
      invalidatesTags: ["Meal"],
    }),
  }),
});

export const {
  useGetIngredientsQuery,
  useAddIngredientMutation,
  useGetMealsQuery,
  useAddMealMutation,
} = api;
