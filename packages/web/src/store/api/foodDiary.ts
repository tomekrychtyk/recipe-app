import type {
  FoodDiaryEntry,
  CreateFoodDiaryEntryInput,
} from "@food-recipe-app/common";
import { baseApi } from "./base";

interface GetEntriesParams {
  userId: string;
  date?: string;
}

export const foodDiaryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFoodDiaryEntries: builder.query<FoodDiaryEntry[], GetEntriesParams>({
      query: (params) => ({
        url: "/food-diary",
        params,
      }),
      providesTags: ["FoodDiary"],
    }),
    addFoodDiaryEntry: builder.mutation<
      FoodDiaryEntry,
      CreateFoodDiaryEntryInput
    >({
      query: (entry) => ({
        url: "/food-diary",
        method: "POST",
        body: entry,
      }),
      invalidatesTags: ["FoodDiary"],
    }),
    deleteFoodDiaryEntry: builder.mutation<void, number>({
      query: (id) => ({
        url: `/food-diary/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["FoodDiary"],
    }),
  }),
});

export const {
  useGetFoodDiaryEntriesQuery,
  useAddFoodDiaryEntryMutation,
  useDeleteFoodDiaryEntryMutation,
} = foodDiaryApi;
