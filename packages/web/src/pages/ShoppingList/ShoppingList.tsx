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
  ListItemSecondaryAction,
  IconButton,
  Stack,
  CircularProgress,
  Alert,
  Divider,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  ShoppingCart,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  useGetShoppingListsQuery,
  useCreateShoppingListMutation,
  useDeleteShoppingListMutation,
  useGenerateFromPlannedMutation,
} from "@/store/api/shoppingList";

export function ShoppingList() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());

  // API hooks
  const { data: shoppingLists = [], isLoading } = useGetShoppingListsQuery(
    { userId: user?.id || "" },
    { skip: !user?.id }
  );
  const [createShoppingList, { isLoading: isCreating }] =
    useCreateShoppingListMutation();
  const [deleteShoppingList] = useDeleteShoppingListMutation();
  const [generateFromPlanned, { isLoading: isGenerating }] =
    useGenerateFromPlannedMutation();

  const handleCreateList = async () => {
    if (!user) return;

    try {
      await createShoppingList({
        userId: user.id,
        name: newListName,
      }).unwrap();

      setNewListName("");
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error("Failed to create shopping list:", error);
    }
  };

  const handleGenerateList = async () => {
    if (!user || !startDate || !endDate) return;

    try {
      await generateFromPlanned({
        userId: user.id,
        name: `Lista zakupów ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`,
        startDate: startDate.toISOString().split("T")[0],
        endDate: endDate.toISOString().split("T")[0],
      }).unwrap();

      setIsGenerateDialogOpen(false);
    } catch (error) {
      console.error("Failed to generate shopping list:", error);
    }
  };

  const handleDeleteList = async (id: number) => {
    try {
      await deleteShoppingList({ id }).unwrap();
    } catch (error) {
      console.error("Failed to delete shopping list:", error);
    }
  };

  const handleOpenList = (id: number) => {
    navigate(`/shopping-list/${id}`);
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 2,
            background: "linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)",
            color: "white",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <ShoppingCart sx={{ fontSize: 40, mr: 2 }} />
            <Typography variant="h4" component="h1" fontWeight="bold">
              Listy zakupów
            </Typography>
          </Box>
          <Typography variant="body1">
            Twórz listy zakupów dla swoich zaplanowanych posiłków, zarządzaj
            zakupami i śledź postępy w robieniu zakupów.
          </Typography>
        </Paper>
      </motion.div>

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setIsCreateDialogOpen(true)}
        >
          Nowa lista
        </Button>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setIsGenerateDialogOpen(true)}
        >
          Wygeneruj z planu
        </Button>
      </Box>

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : shoppingLists.length === 0 ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          Nie masz jeszcze żadnych list zakupów. Utwórz nową listę lub wygeneruj
          ją z planu posiłków.
        </Alert>
      ) : (
        <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden" }}>
          <List disablePadding>
            {shoppingLists.map((list, index) => (
              <Box key={list.id}>
                {index > 0 && <Divider />}
                <ListItem
                  button
                  onClick={() => handleOpenList(list.id)}
                  sx={{ py: 2 }}
                >
                  <ListItemText
                    primary={list.name}
                    secondary={`Utworzono: ${new Date(list.createdAt).toLocaleDateString()}`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteList(list.id);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              </Box>
            ))}
          </List>
        </Paper>
      )}

      {/* Create New List Dialog */}
      <Dialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
      >
        <DialogTitle>Utwórz nową listę zakupów</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nazwa listy"
            fullWidth
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsCreateDialogOpen(false)}>Anuluj</Button>
          <Button
            onClick={handleCreateList}
            variant="contained"
            disabled={!newListName.trim() || isCreating}
          >
            {isCreating ? <CircularProgress size={24} /> : "Utwórz"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Generate List From Plan Dialog */}
      <Dialog
        open={isGenerateDialogOpen}
        onClose={() => setIsGenerateDialogOpen(false)}
      >
        <DialogTitle>Wygeneruj listę z planu posiłków</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1, minWidth: 300 }}>
            <DatePicker
              label="Data początkowa"
              value={startDate}
              onChange={setStartDate}
              slotProps={{
                textField: {
                  fullWidth: true,
                },
              }}
            />
            <DatePicker
              label="Data końcowa"
              value={endDate}
              onChange={setEndDate}
              slotProps={{
                textField: {
                  fullWidth: true,
                },
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsGenerateDialogOpen(false)}>Anuluj</Button>
          <Button
            onClick={handleGenerateList}
            variant="contained"
            disabled={!startDate || !endDate || isGenerating}
          >
            {isGenerating ? <CircularProgress size={24} /> : "Wygeneruj"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
