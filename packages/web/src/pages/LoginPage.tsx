import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";
import { Google as GoogleIcon, Email as EmailIcon } from "@mui/icons-material";
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
  Divider,
} from "@mui/material";

type AuthTab = "signin" | "signup" | "magic";

export function LoginPage() {
  const {
    signInWithGoogle,
    signInWithEmail,
    signInWithEmailPassword,
    signUpWithEmail,
    error,
    loading,
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<AuthTab>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState(false);

  const from = location.state?.from?.pathname || "/";

  const handleGoogleSignIn = async () => {
    await signInWithGoogle();
    navigate(from, { replace: true });
  };

  const handleEmailAuth = async () => {
    setLocalError(null);

    if (!email) {
      setLocalError("Email jest wymagany");
      return;
    }

    if (activeTab === "magic") {
      // Magic link authentication
      const { error } = await signInWithEmail(email);
      if (error) {
        setLocalError(error);
      } else {
        setAuthSuccess(true);
      }
    } else if (activeTab === "signin") {
      // Password authentication
      if (!password) {
        setLocalError("Hasło jest wymagane");
        return;
      }

      const { error } = await signInWithEmailPassword(email, password);
      if (error) {
        setLocalError(error);
      } else {
        navigate(from, { replace: true });
      }
    } else if (activeTab === "signup") {
      // Sign up with email and password
      if (!password) {
        setLocalError("Hasło jest wymagane");
        return;
      }

      if (password !== confirmPassword) {
        setLocalError("Hasła nie pasują do siebie");
        return;
      }

      if (password.length < 6) {
        setLocalError("Hasło musi mieć co najmniej 6 znaków");
        return;
      }

      const { error } = await signUpWithEmail(email, password);
      if (error) {
        setLocalError(error);
      } else {
        setAuthSuccess(true);
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  if (authSuccess) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "background.default",
          p: 3,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 2,
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
            maxWidth: "440px",
            width: "100%",
          }}
        >
          <Typography variant="h5" align="center" gutterBottom>
            Sprawdź swoją skrzynkę email
          </Typography>
          <Typography variant="body1" align="center" sx={{ mb: 3 }}>
            Wysłaliśmy link do zalogowania się na adres {email}. Kliknij w link,
            aby dokończyć proces logowania.
          </Typography>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => {
              setAuthSuccess(false);
              setEmail("");
              setPassword("");
              setConfirmPassword("");
              setActiveTab("signin");
            }}
          >
            Powrót do logowania
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        p: 3,
      }}
    >
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        style={{ width: "100%", maxWidth: "440px" }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 2,
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <motion.div variants={itemVariants}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mb: 4,
              }}
            >
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  mb: 1,
                  fontSize: { xs: "2rem", sm: "2rem" },
                  background:
                    "linear-gradient(45deg, #FFD700 30%, #FFA500 90%)",
                  backgroundClip: "text",
                  textFillColor: "transparent",
                  fontWeight: "bold",
                }}
              >
                Witaj z powrotem 👋
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                align="center"
                sx={{ mt: 2, mb: 3 }}
              >
                Zaloguj się, aby uzyskać dostęp do swoich planów posiłków i
                przepisów
              </Typography>
            </Box>
          </motion.div>

          {(error || localError) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Alert severity="error" sx={{ mb: 2 }}>
                {localError || error}
              </Alert>
            </motion.div>
          )}

          <motion.div variants={itemVariants}>
            <Button
              onClick={handleGoogleSignIn}
              variant="contained"
              fullWidth
              size="large"
              startIcon={<GoogleIcon />}
              sx={{
                mt: 2,
                bgcolor: "primary.main",
                color: "background.paper",
                py: 1.5,
                transition: "all 0.2s ease-in-out",
                transform: "scale(1)",
                "&:hover": {
                  bgcolor: "primary.dark",
                  transform: "scale(1.02)",
                },
              }}
            >
              Zaloguj się przez Google
            </Button>
          </motion.div>

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              lub użyj email
            </Typography>
          </Divider>

          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            centered
            sx={{ mb: 3 }}
          >
            <Tab label="Zaloguj się" value="signin" />
            <Tab label="Zarejestruj się" value="signup" />
            <Tab label="Magic Link" value="magic" />
          </Tabs>

          <Box sx={{ mb: 3 }}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={{
                "& .MuiOutlinedInput-input": {
                  backgroundColor: "black",
                },
              }}
            />

            {activeTab !== "magic" && (
              <TextField
                label="Hasło"
                type="password"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                InputProps={{
                  sx: { bgcolor: "#2b2b2b" },
                }}
              />
            )}

            {activeTab === "signup" && (
              <TextField
                label="Potwierdź hasło"
                type="password"
                fullWidth
                margin="normal"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                InputProps={{
                  sx: { bgcolor: "#2b2b2b" },
                }}
              />
            )}
          </Box>

          <Button
            onClick={handleEmailAuth}
            variant="contained"
            fullWidth
            size="large"
            startIcon={<EmailIcon />}
            disabled={loading}
            sx={{
              mt: 2,
              py: 1.5,
            }}
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : activeTab === "signin" ? (
              "Zaloguj się"
            ) : activeTab === "signup" ? (
              "Zarejestruj się"
            ) : (
              "Wyślij Magic Link"
            )}
          </Button>

          <motion.div variants={itemVariants}>
            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
              sx={{ mt: 4 }}
            >
              Po zalogowaniu będziesz mieć pełny dostęp do wszystkich funkcji
              aplikacji
            </Typography>
          </motion.div>
        </Paper>
      </motion.div>
    </Box>
  );
}
