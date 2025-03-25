import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";
import { Google as GoogleIcon } from "@mui/icons-material";
import { Box, Typography, Button, Paper } from "@mui/material";

export function LoginPage() {
  const { signInWithGoogle, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleGoogleSignIn = async () => {
    await signInWithGoogle();
    navigate(from, { replace: true });
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

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Typography
                color="error"
                align="center"
                sx={{ mb: 2, fontSize: "0.875rem" }}
              >
                {error}
              </Typography>
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

          <motion.div variants={itemVariants}>
            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
              sx={{ mt: 4 }}
            >
              Zaloguj się, aby uzyskać dostęp do swoich planów posiłków i
              przepisów
            </Typography>
          </motion.div>
        </Paper>
      </motion.div>
    </Box>
  );
}
