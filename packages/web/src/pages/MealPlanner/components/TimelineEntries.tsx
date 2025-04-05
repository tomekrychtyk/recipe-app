import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from "@mui/lab";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  CircularProgress,
  Button,
  Tooltip,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  PlaylistAdd,
  ShoppingCart as ShoppingCartIcon,
} from "@mui/icons-material";
import type { PlannedMealResponse } from "../types";
import {
  formatTime,
  calculateEntryNutrition,
  sortEntriesByTime,
} from "../utils";

interface Props {
  entries: PlannedMealResponse[];
  onDelete: (id: number) => void;
  onAddToDiary: (id: number) => void;
  onAddToShoppingList?: (id: number) => void;
  isSelectedDateToday: boolean;
  isLoading?: boolean;
}

export function TimelineEntries({
  entries,
  onDelete,
  onAddToDiary,
  onAddToShoppingList,
  isSelectedDateToday,
  isLoading = false,
}: Props) {
  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (entries.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="body1" color="text.secondary">
          Brak zaplanowanych posiłków na ten dzień
        </Typography>
      </Box>
    );
  }

  return (
    <Timeline
      sx={{
        p: 0,
        "& .MuiTimelineItem-root:before": {
          flex: 0,
          p: 0,
        },
      }}
    >
      {sortEntriesByTime(entries).map((entry) => {
        const nutrition = calculateEntryNutrition(entry.ingredients);
        return (
          <TimelineItem key={entry.id}>
            <TimelineOppositeContent
              sx={{
                flex: "0 0 50px",
                py: 1.5,
                "@media (max-width: 600px)": {
                  flex: "0 0 40px",
                },
              }}
            >
              <Typography variant="body2" color="text.secondary">
                {formatTime(entry.time)}
              </Typography>
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot color="primary" />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent sx={{ py: 1.5, px: 2 }}>
              <Paper
                elevation={1}
                sx={{
                  p: { xs: 1, sm: 2 },
                  bgcolor: "background.paper",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    component="div"
                    sx={{
                      fontSize: { xs: "1rem", sm: "1.25rem" },
                      wordBreak: "break-word",
                      pr: 1,
                    }}
                  >
                    {entry.name}
                  </Typography>
                  <Box display="flex">
                    {isSelectedDateToday && (
                      <IconButton
                        size="small"
                        onClick={() => onAddToDiary(entry.id)}
                        sx={{
                          color: "primary.main",
                          mr: 1,
                          "&:hover": {
                            bgcolor: "primary.light",
                            color: "primary.dark",
                          },
                        }}
                      >
                        <PlaylistAdd />
                      </IconButton>
                    )}
                    <IconButton
                      size="small"
                      onClick={() => onDelete(entry.id)}
                      sx={{
                        color: "error.main",
                        "&:hover": {
                          bgcolor: "error.light",
                          color: "error.dark",
                        },
                        flexShrink: 0,
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
                <List dense disablePadding>
                  {entry.ingredients.map((ingredient, index) => (
                    <ListItem key={index} sx={{ py: 0 }}>
                      <ListItemText
                        primary={`${ingredient.ingredient.name} - ${ingredient.amount}g`}
                      />
                    </ListItem>
                  ))}
                </List>
                <Divider sx={{ my: 1 }} />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      flexWrap: "wrap",
                      fontSize: "0.875rem",
                      color: "text.secondary",
                    }}
                  >
                    <Typography variant="body2">
                      {nutrition.calories.toFixed(1)} kcal
                    </Typography>
                    <Typography variant="body2">
                      B: {nutrition.proteins.toFixed(1)}g
                    </Typography>
                    <Typography variant="body2">
                      W: {nutrition.carbs.toFixed(1)}g
                    </Typography>
                    <Typography variant="body2">
                      T: {nutrition.fats.toFixed(1)}g
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    {isSelectedDateToday && (
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => onAddToDiary(entry.id)}
                        sx={{ display: { xs: "none", sm: "flex" } }}
                        startIcon={<PlaylistAdd />}
                      >
                        Dodaj do dziennika
                      </Button>
                    )}
                    {onAddToShoppingList && (
                      <Tooltip title="Dodaj do listy zakupów">
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => onAddToShoppingList(entry.id)}
                          sx={{ display: { xs: "none", sm: "flex" } }}
                          startIcon={<ShoppingCartIcon />}
                          color="success"
                        >
                          Do zakupów
                        </Button>
                      </Tooltip>
                    )}
                  </Box>
                </Box>
              </Paper>
            </TimelineContent>
          </TimelineItem>
        );
      })}
    </Timeline>
  );
}
