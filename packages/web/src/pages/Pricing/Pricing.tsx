import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
} from "@mui/material";
import { Check as CheckIcon, Close as CloseIcon } from "@mui/icons-material";

interface PlanFeature {
  name: string;
  free: boolean;
  active: boolean;
}

const features: PlanFeature[] = [
  { name: "Podstawowe wpisy w dzienniku żywienia", free: true, active: true },
  { name: "Podstawowe śledzenie żywienia", free: true, active: true },
  { name: "Dostęp do publicznej bazy przepisów", free: true, active: true },
  { name: "Podstawowa baza składników", free: true, active: true },
  { name: "Ograniczenie do 5 wpisów na dzień", free: true, active: false },
  {
    name: "Nieograniczone wpisy w dzienniku żywienia",
    free: false,
    active: true,
  },
  { name: "Szczegółowe rozkłady składników", free: false, active: true },
  {
    name: "Tworzenie własnych przepisów & prywatna biblioteka",
    free: false,
    active: true,
  },
  {
    name: "Planowanie posiłków & harmonogramowanie",
    free: false,
    active: true,
  },
  { name: "Eksportowanie danych żywienia", free: false, active: true },
  { name: "Priorytetowa obsługa klienta", free: false, active: true },
  { name: "Zaawansowane analizy i trendy", free: false, active: true },
  { name: "Generowanie listy zakupów", free: false, active: true },
  { name: "Sugestie przepisów", free: false, active: true },
  {
    name: "Współdzielenie posiłków z innymi użytkownikami",
    free: false,
    active: true,
  },
];

export function Pricing() {
  const FeatureIcon = ({ included }: { included: boolean }) => (
    <ListItemIcon>
      {included ? (
        <CheckIcon sx={{ color: "success.main" }} />
      ) : (
        <CloseIcon sx={{ color: "error.main" }} />
      )}
    </ListItemIcon>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box textAlign="center" mb={8}>
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{
            fontSize: { xs: "2.5rem", md: "3.5rem" },
            fontWeight: "bold",
          }}
        >
          Wybierz swój plan
        </Typography>
        <Typography
          variant="h5"
          color="text.secondary"
          sx={{ maxWidth: 600, mx: "auto" }}
        >
          Wybierz plan, który najbardziej odpowiada Twoim potrzebom
        </Typography>
      </Box>

      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={6} lg={5}>
          <Card
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              transition: "transform 0.2s",
              "&:hover": {
                transform: "translateY(-4px)",
              },
            }}
          >
            <CardHeader
              title="Plan Bezpłatny"
              subheader="Rozpocznij z podstawowymi funkcjami"
              titleTypography={{ variant: "h4" }}
              sx={{
                bgcolor: "grey.50",
                textAlign: "center",
                py: 4,
                color: "black",
              }}
            />
            <CardContent
              sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
            >
              <Typography
                variant="h3"
                component="div"
                sx={{ textAlign: "center", mb: 3 }}
              >
                $0
                <Typography
                  component="span"
                  variant="h6"
                  color="text.secondary"
                >
                  /miesiąc
                </Typography>
              </Typography>
              <List>
                {features.map((feature, index) => (
                  <ListItem key={index}>
                    <FeatureIcon included={feature.free} />
                    <ListItemText
                      primary={feature.name}
                      sx={{
                        "& .MuiListItemText-primary": {
                          color: feature.free
                            ? "text.primary"
                            : "text.disabled",
                        },
                      }}
                    />
                  </ListItem>
                ))}
              </List>
              <Box sx={{ mt: "auto", textAlign: "center", pt: 3 }}>
                <Button variant="outlined" size="large" sx={{ px: 6 }}>
                  Zacznij za darmo
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Active Plan */}
        <Grid item xs={12} md={6} lg={5}>
          <Card
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              transition: "transform 0.2s",
              "&:hover": {
                transform: "translateY(-4px)",
              },
              border: 2,
              borderColor: "primary.main",
            }}
          >
            <CardHeader
              title="Plan Aktywny"
              subheader="Dla osób, których priorytetem jest zdrowa dieta"
              titleTypography={{ variant: "h4" }}
              sx={{
                bgcolor: "primary.main",
                color: "primary.contrastText",
                textAlign: "center",
                py: 4,
                "& .MuiCardHeader-subheader": {
                  color: "primary.contrastText",
                },
              }}
            />
            <CardContent
              sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
            >
              <Typography
                variant="h3"
                component="div"
                sx={{ textAlign: "center", mb: 3 }}
              >
                $9.99
                <Typography
                  component="span"
                  variant="h6"
                  color="text.secondary"
                >
                  /miesiąc
                </Typography>
              </Typography>
              <List>
                {features.map((feature, index) => (
                  <ListItem key={index}>
                    <FeatureIcon included={feature.active} />
                    <ListItemText primary={feature.name} />
                  </ListItem>
                ))}
              </List>
              <Box sx={{ mt: "auto", textAlign: "center", pt: 3 }}>
                <Button variant="contained" size="large" sx={{ px: 6 }}>
                  Zacznij aktwnie
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
