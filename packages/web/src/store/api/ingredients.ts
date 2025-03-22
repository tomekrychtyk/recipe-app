import type { Ingredient } from "@food-recipe-app/common";
import { baseApi } from "./base";

export const ingredientsApi = baseApi.injectEndpoints({
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
    updateIngredient: builder.mutation<Ingredient, Ingredient>({
      query: (ingredient) => ({
        url: `/ingredients/${ingredient.id}`,
        method: "PUT",
        body: ingredient,
      }),
      invalidatesTags: ["Ingredient"],
    }),
    deleteIngredient: builder.mutation<void, number>({
      query: (id) => ({
        url: `/ingredients/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Ingredient"],
    }),
  }),
});

export const {
  useGetIngredientsQuery,
  useAddIngredientMutation,
  useUpdateIngredientMutation,
  useDeleteIngredientMutation,
} = ingredientsApi;
