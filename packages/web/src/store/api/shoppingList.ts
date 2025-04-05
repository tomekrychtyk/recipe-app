import { baseApi } from "./base";
import { ShoppingList, ShoppingListItem } from "@food-recipe-app/common";

interface CreateShoppingListInput {
  userId: string;
  name: string;
  items?: Array<{
    ingredientId: number;
    amount: number;
  }>;
}

interface GenerateFromPlannedInput {
  userId: string;
  name: string;
  startDate: string;
  endDate: string;
}

interface AddItemsInput {
  items: Array<{
    ingredientId: number;
    amount: number;
  }>;
}

export const shoppingListApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getShoppingLists: build.query<ShoppingList[], { userId: string }>({
      query: ({ userId }) => ({
        url: `/shopping-list?userId=${userId}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "ShoppingList" as const,
                id,
              })),
              { type: "ShoppingList", id: "LIST" },
            ]
          : [{ type: "ShoppingList", id: "LIST" }],
    }),

    getShoppingList: build.query<ShoppingList, { id: number }>({
      query: ({ id }) => ({
        url: `/shopping-list/${id}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              { type: "ShoppingList", id: result.id },
              ...result.items.map(({ id }) => ({
                type: "ShoppingListItem" as const,
                id,
              })),
            ]
          : [{ type: "ShoppingList", id: "SINGLE" }],
    }),

    createShoppingList: build.mutation<ShoppingList, CreateShoppingListInput>({
      query: (body) => ({
        url: "/shopping-list",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "ShoppingList", id: "LIST" }],
    }),

    updateShoppingList: build.mutation<
      ShoppingList,
      { id: number; name: string }
    >({
      query: ({ id, ...body }) => ({
        url: `/shopping-list/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result) =>
        result
          ? [
              { type: "ShoppingList", id: result.id },
              { type: "ShoppingList", id: "LIST" },
            ]
          : [{ type: "ShoppingList", id: "LIST" }],
    }),

    deleteShoppingList: build.mutation<void, { id: number }>({
      query: ({ id }) => ({
        url: `/shopping-list/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "ShoppingList", id: "LIST" }],
    }),

    addItems: build.mutation<
      ShoppingList,
      { shoppingListId: number; items: AddItemsInput["items"] }
    >({
      query: ({ shoppingListId, items }) => ({
        url: `/shopping-list/${shoppingListId}/items`,
        method: "POST",
        body: { items },
      }),
      invalidatesTags: (result) =>
        result
          ? [{ type: "ShoppingList", id: result.id }]
          : [{ type: "ShoppingList", id: "SINGLE" }],
    }),

    updateItemStatus: build.mutation<
      ShoppingListItem,
      { itemId: number; isDone: boolean }
    >({
      query: ({ itemId, isDone }) => ({
        url: `/shopping-list/items/${itemId}`,
        method: "PATCH",
        body: { isDone },
      }),
      invalidatesTags: (result, error, { itemId }) => [
        { type: "ShoppingListItem", id: itemId },
      ],
    }),

    deleteItem: build.mutation<void, { itemId: number }>({
      query: ({ itemId }) => ({
        url: `/shopping-list/items/${itemId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { itemId }) => [
        { type: "ShoppingListItem", id: itemId },
      ],
    }),

    generateFromPlanned: build.mutation<ShoppingList, GenerateFromPlannedInput>(
      {
        query: (body) => ({
          url: "/shopping-list/generate-from-planned",
          method: "POST",
          body,
        }),
        invalidatesTags: [{ type: "ShoppingList", id: "LIST" }],
      }
    ),
  }),
});

export const {
  useGetShoppingListsQuery,
  useGetShoppingListQuery,
  useCreateShoppingListMutation,
  useUpdateShoppingListMutation,
  useDeleteShoppingListMutation,
  useAddItemsMutation,
  useUpdateItemStatusMutation,
  useDeleteItemMutation,
  useGenerateFromPlannedMutation,
} = shoppingListApi;
