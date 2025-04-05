import {
  Box,
  Button,
  Paper,
  Typography,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  CircularProgress,
  Alert,
  Autocomplete,
  Checkbox,
  Tooltip,
  LinearProgress,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  ShoppingCart,
} from "@mui/icons-material";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Ingredient } from "@food-recipe-app/common";
import {
  useGetShoppingListQuery,
  useUpdateItemStatusMutation,
  useDeleteItemMutation,
  useAddItemsMutation,
} from "@/store/api/shoppingList";
import { useGetIngredientsQuery } from "@/store/api/ingredients";

interface ShoppingListItem {
  id: number;
  ingredientId: number;
  ingredient: Ingredient;
  amount: number;
  isDone: boolean;
}

export function ShoppingListDetail() {
  const { id } = useParams<{ id: string }>();
  const listId = parseInt(id || "0");
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);
  const [selectedIngredient, setSelectedIngredient] =
    useState<Ingredient | null>(null);
  const [ingredientAmount, setIngredientAmount] = useState<string>("");

  // API hooks
  const {
    data: shoppingList,
    isLoading,
    isError,
  } = useGetShoppingListQuery({ id: listId }, { skip: !listId });
  const { data: ingredients = [] } = useGetIngredientsQuery();
  const [updateItemStatus] = useUpdateItemStatusMutation();
  const [deleteItem] = useDeleteItemMutation();
  const [addItems, { isLoading: isAddingItem }] = useAddItemsMutation();

  // Toggle item completion status
  const handleToggleItem = async (itemId: number, currentStatus: boolean) => {
    try {
      await updateItemStatus({
        itemId,
        isDone: !currentStatus,
      }).unwrap();
    } catch (error) {
      console.error("Failed to update item status:", error);
    }
  };

  // Delete item from list
  const handleDeleteItem = async (itemId: number) => {
    try {
      await deleteItem({ itemId }).unwrap();
    } catch (error) {
      console.error("Failed to delete item:", error);
    }
  };

  // Add new item to list
  const handleAddItem = async () => {
    if (!selectedIngredient || !ingredientAmount || !shoppingList) return;

    try {
      await addItems({
        shoppingListId: shoppingList.id,
        items: [
          {
            ingredientId: selectedIngredient.id,
            amount: parseFloat(ingredientAmount),
          },
        ],
      }).unwrap();

      setSelectedIngredient(null);
      setIngredientAmount("");
      setIsAddItemDialogOpen(false);
    } catch (error) {
      console.error("Failed to add item to shopping list:", error);
    }
  };

  // Calculate completion percentage
  const calculateCompletion = () => {
    if (!shoppingList || shoppingList.items.length === 0) return 0;
    const completedItems = shoppingList.items.filter(
      (item: ShoppingListItem) => item.isDone
    ).length;
    return (completedItems / shoppingList.items.length) * 100;
  };

  // Navigate back to shopping lists
  const handleGoBack = () => {
    navigate("/shopping-list");
  };

  if (isLoading) {
    return (
      <Box sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !shoppingList) {
    return (
      <Box sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
        <Alert severity="error">Nie można załadować listy zakupów.</Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleGoBack}
          sx={{ mt: 2 }}
        >
          Powrót
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <IconButton onClick={handleGoBack} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" component="h1" fontWeight="bold">
          {shoppingList.name}
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <ShoppingCart sx={{ fontSize: 30, mr: 2, color: "primary.main" }} />
          <Typography variant="h6">Postęp zakupów</Typography>
        </Box>

        <Box sx={{ mt: 2, mb: 1 }}>
          <LinearProgress
            variant="determinate"
            value={calculateCompletion()}
            sx={{ height: 10, borderRadius: 5 }}
          />
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="body2" color="text.secondary">
            {
              shoppingList.items.filter((item: ShoppingListItem) => item.isDone)
                .length
            }{" "}
            z {shoppingList.items.length} produktów
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {calculateCompletion().toFixed(0)}%
          </Typography>
        </Box>
      </Paper>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setIsAddItemDialogOpen(true)}
        >
          Dodaj produkt
        </Button>
      </Box>

      {shoppingList.items.length === 0 ? (
        <Alert severity="info">
          Ta lista zakupów jest pusta. Dodaj produkty używając przycisku
          powyżej.
        </Alert>
      ) : (
        <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden" }}>
          <List disablePadding>
            {shoppingList.items.map((item: ShoppingListItem, index: number) => (
              <Box key={item.id}>
                {index > 0 && <Divider />}
                <ListItem sx={{ py: 1.5 }}>
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={item.isDone}
                      onChange={() => handleToggleItem(item.id, item.isDone)}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        variant="body1"
                        sx={{
                          textDecoration: item.isDone ? "line-through" : "none",
                          color: item.isDone
                            ? "text.secondary"
                            : "text.primary",
                        }}
                      >
                        {item.ingredient.name}
                      </Typography>
                    }
                    secondary={`${item.amount}g`}
                  />
                  <ListItemSecondaryAction>
                    <Tooltip title="Usuń">
                      <IconButton
                        edge="end"
                        onClick={() => handleDeleteItem(item.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </ListItemSecondaryAction>
                </ListItem>
              </Box>
            ))}
          </List>
        </Paper>
      )}

      {/* Add Item Dialog */}
      <Dialog
        open={isAddItemDialogOpen}
        onClose={() => setIsAddItemDialogOpen(false)}
      >
        <DialogTitle>Dodaj produkt do listy</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              pt: 1,
              minWidth: 400,
            }}
          >
            <Autocomplete
              options={ingredients}
              getOptionLabel={(option) => option.name}
              value={selectedIngredient}
              onChange={(_, newValue) => setSelectedIngredient(newValue)}
              renderInput={(params) => (
                <TextField {...params} label="Produkt" fullWidth />
              )}
            />
            <TextField
              label="Ilość (g)"
              type="number"
              value={ingredientAmount}
              onChange={(e) => setIngredientAmount(e.target.value)}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddItemDialogOpen(false)}>Anuluj</Button>
          <Button
            onClick={handleAddItem}
            variant="contained"
            disabled={!selectedIngredient || !ingredientAmount || isAddingItem}
          >
            {isAddingItem ? <CircularProgress size={24} /> : "Dodaj"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
