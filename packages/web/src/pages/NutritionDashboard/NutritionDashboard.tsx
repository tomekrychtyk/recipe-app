import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent,
  Divider,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { useGetFoodDiaryEntriesQuery } from "@/store/api/foodDiary";
import { DailyMacroChart } from "./components/DailyMacroChart";
import { WeeklyCaloriesChart } from "./components/WeeklyCaloriesChart";
import { MonthlyNutrientChart } from "./components/MonthlyNutrientChart";
import { NutritionSummaryCards } from "./components/NutritionSummaryCards";
import { NutrientDistributionChart } from "./components/NutrientDistributionChart";
import { VitaminsMineralsChart } from "./components/VitaminsMineralsChart";
import {
  subDays,
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import { pl } from "date-fns/locale";

type TimeRange = "day" | "week" | "month";
type ActiveTab =
  | "overview"
  | "calories"
  | "nutrients"
  | "trends"
  | "micronutrients";

export function NutritionDashboard() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [timeRange, setTimeRange] = useState<TimeRange>("week");
  const [activeTab, setActiveTab] = useState<ActiveTab>("overview");

  // Calculate date range based on selected date and time range
  const getDateRange = () => {
    const endDate = new Date(selectedDate);
    let startDate: Date;

    switch (timeRange) {
      case "day":
        startDate = new Date(selectedDate);
        break;
      case "week":
        startDate = startOfWeek(selectedDate, { locale: pl });
        endDate.setTime(endOfWeek(selectedDate, { locale: pl }).getTime());
        break;
      case "month":
        startDate = startOfMonth(selectedDate);
        endDate.setTime(endOfMonth(selectedDate).getTime());
        break;
      default:
        startDate = subDays(selectedDate, 7);
    }

    return {
      startDate: format(startDate, "yyyy-MM-dd"),
      endDate: format(endDate, "yyyy-MM-dd"),
    };
  };

  const dateRange = getDateRange();

  // Fetch food diary data
  const {
    data: entries = [],
    isLoading,
    error,
  } = useGetFoodDiaryEntriesQuery(
    {
      userId: user?.id || "",
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
    },
    {
      skip: !user?.id,
    }
  );

  // Handle time range change
  const handleTimeRangeChange = (
    _event: React.MouseEvent<HTMLElement>,
    newTimeRange: TimeRange | null
  ) => {
    if (newTimeRange !== null) {
      setTimeRange(newTimeRange);
    }
  };

  // Handle tab change
  const handleTabChange = (
    _event: React.SyntheticEvent,
    newValue: ActiveTab
  ) => {
    setActiveTab(newValue);
  };

  if (!user) {
    return (
      <Box sx={{ maxWidth: 1200, mx: "auto", p: { xs: 1, sm: 3 } }}>
        <Alert severity="info">
          Zaloguj się, aby korzystać z panelu analitycznego
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: { xs: 1, sm: 3 } }}>
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
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            fontWeight="bold"
          >
            Panel analityczny
          </Typography>
          <Typography variant="body1">
            Śledź swoje nawyki żywieniowe i analizuj trendy w przyjmowaniu
            składników odżywczych na przestrzeni czasu.
          </Typography>
        </Paper>
      </motion.div>

      <Box
        sx={{
          mb: 4,
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          alignItems: { xs: "stretch", sm: "center" },
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <DatePicker
            label="Data"
            value={selectedDate}
            onChange={(newDate) => newDate && setSelectedDate(newDate)}
            slotProps={{
              textField: {
                size: "small",
                sx: { minWidth: { xs: "100%", sm: 180 } },
              },
            }}
          />

          <ToggleButtonGroup
            value={timeRange}
            exclusive
            onChange={handleTimeRangeChange}
            aria-label="zakres czasu"
            size="small"
            sx={{ height: 40 }}
          >
            <ToggleButton value="day">Dzień</ToggleButton>
            <ToggleButton value="week">Tydzień</ToggleButton>
            <ToggleButton value="month">Miesiąc</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: { xs: 1, sm: 0 } }}
        >
          {timeRange === "day" &&
            format(selectedDate, "d MMMM yyyy", { locale: pl })}
          {timeRange === "week" &&
            `${format(startOfWeek(selectedDate, { locale: pl }), "d MMM", { locale: pl })} - ${format(endOfWeek(selectedDate, { locale: pl }), "d MMM yyyy", { locale: pl })}`}
          {timeRange === "month" &&
            format(selectedDate, "MMMM yyyy", { locale: pl })}
        </Typography>
      </Box>

      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        sx={{ mb: 4, borderBottom: 1, borderColor: "divider" }}
      >
        <Tab label="Przegląd" value="overview" />
        <Tab label="Kalorie" value="calories" />
        <Tab label="Makroskładniki" value="nutrients" />
        <Tab label="Mikroskładniki" value="micronutrients" />
        <Tab label="Trendy" value="trends" />
      </Tabs>

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 4 }}>
          Wystąpił błąd podczas ładowania danych
        </Alert>
      ) : entries.length === 0 ? (
        <Alert severity="info" sx={{ mb: 4 }}>
          Brak danych dla wybranego okresu
        </Alert>
      ) : (
        <Box>
          {activeTab === "overview" && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <NutritionSummaryCards
                  entries={entries}
                  timeRange={timeRange}
                />
              </Grid>
              <Grid item xs={12} md={12}>
                <Card elevation={2} sx={{ height: "100%" }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Wykres kalorii
                    </Typography>
                    <WeeklyCaloriesChart
                      entries={entries}
                      timeRange={timeRange}
                    />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}

          {activeTab === "calories" && (
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Szczegółowy wykres kalorii
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Śledź dzienne spożycie kalorii w czasie
                </Typography>
                <Box sx={{ height: 400 }}>
                  <WeeklyCaloriesChart
                    entries={entries}
                    timeRange={timeRange}
                    detailedView
                  />
                </Box>
              </CardContent>
            </Card>
          )}

          {activeTab === "nutrients" && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card elevation={2}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Dzienne rozkłady makroskładników
                    </Typography>
                    <Box sx={{ height: 400 }}>
                      <DailyMacroChart
                        entries={entries}
                        timeRange={timeRange}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card elevation={2}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Proporcje makroskładników
                    </Typography>
                    <Box sx={{ height: 400 }}>
                      <NutrientDistributionChart
                        entries={entries}
                        detailedView
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}

          {activeTab === "micronutrients" && (
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Witaminy i minerały
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  Analiza spożycia witamin i minerałów w stosunku do dziennego
                  zapotrzebowania
                </Typography>
                <VitaminsMineralsChart entries={entries} />
              </CardContent>
            </Card>
          )}

          {activeTab === "trends" && (
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Trendy składników odżywczych
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Analizuj trendy w spożyciu składników odżywczych w czasie
                </Typography>
                <Box sx={{ height: 400 }}>
                  <MonthlyNutrientChart entries={entries} />
                </Box>
              </CardContent>
            </Card>
          )}
        </Box>
      )}
    </Box>
  );
}
