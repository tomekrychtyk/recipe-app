import type {
  Meal,
  Ingredient,
  MealIngredientInput,
  MealInput,
  MealCategory,
} from "@food-recipe-app/common";
import { baseApi } from "./base";

interface GetMealsParams {
  userId?: string;
  publicOnly?: boolean;
}

export const mealsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMeals: builder.query<Meal[], GetMealsParams | void>({
      query: (params) => ({
        url: "/meals",
        params: params
          ? {
              userId: params.userId,
              publicOnly: params.publicOnly,
            }
          : undefined,
      }),
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
        categoryId: MealCategory;
        ingredients: MealIngredientInput[];
        userId?: string;
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
    uploadMealImage: builder.mutation<{ url: string }, FormData>({
      query: (formData) => ({
        url: "meals/upload",
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const {
  useGetMealsQuery,
  useGetMealByIdQuery,
  useAddMealMutation,
  useUpdateMealMutation,
  useDeleteMealMutation,
  useUploadMealImageMutation,
} = mealsApi;
