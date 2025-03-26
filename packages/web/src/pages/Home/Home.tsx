import { Box, Typography, Button, keyframes } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Payments as PaymentsIcon } from "@mui/icons-material";

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

const emojiStyle = {
  fontSize: "64px",
  animation: `${float} 3s ease-in-out infinite`,
  display: "inline-block",
  margin: "0 16px",
};

const staggerAnimation = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.3,
      duration: 0.5,
    },
  }),
};

export function HomePage() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "calc(100vh - 200px)", // Account for header/footer
        textAlign: "center",
        px: 3,
      }}
    >
      <Box sx={{ mb: 6 }}>
        <span style={emojiStyle}>🥗</span>
        <span style={{ ...emojiStyle, animationDelay: "0.5s" }}>👩‍🍳</span>
        <span style={{ ...emojiStyle, animationDelay: "1s" }}>🍽️</span>
      </Box>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerAnimation}
        custom={0}
      >
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{
            background: "linear-gradient(45deg, #FFD700 30%, #FFA500 90%)",
            backgroundClip: "text",
            textFillColor: "transparent",
            fontWeight: "bold",
          }}
        >
          Witaj w dabelo.pl! 🌟
        </Typography>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerAnimation}
        custom={1}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            color: "text.secondary",
            maxWidth: 800,
          }}
        >
          Twój osobisty asystent zdrowego odżywiania
        </Typography>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerAnimation}
        custom={2}
      >
        <Typography
          variant="body1"
          paragraph
          sx={{
            color: "text.secondary",
            maxWidth: 600,
          }}
        >
          Odkryj świat świadomego odżywiania! Nasza aplikacja pomoże Ci śledzić
          wartości odżywcze, planować posiłki i osiągać cele żywieniowe.
          Przestań zgadywać - zacznij świadomie komponować swoje posiłki z
          precyzyjnymi danymi o składnikach.
        </Typography>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerAnimation}
        custom={3}
      >
        <Typography
          variant="body1"
          paragraph
          sx={{
            color: "text.secondary",
            maxWidth: 600,
          }}
        >
          Rozpocznij już dziś:
          <ul style={{ listStyleType: "none", padding: 0 }}>
            <li>📊 Monitoruj makro i mikroskładniki</li>
            <li>🥗 Twórz zbilansowane posiłki</li>
            <li>📱 Śledź swoje postępy</li>
            <li>💪 Osiągaj cele żywieniowe</li>
          </ul>
        </Typography>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerAnimation}
        custom={4}
      >
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate("/pricing")}
          startIcon={<PaymentsIcon />}
          sx={{
            mt: 4,
            py: 2,
            px: 6,
            fontSize: "1.2rem",
            borderRadius: 2,
            background: "linear-gradient(45deg, #FFD700 30%, #FFA500 90%)",
            color: "#1c1c1c",
            fontWeight: "bold",
            textTransform: "none",
            boxShadow: "0 4px 20px rgba(255, 215, 0, 0.25)",
            transition: "all 0.3s ease-in-out",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 6px 25px rgba(255, 215, 0, 0.35)",
            },
          }}
        >
          Już dziś zacznij zdrowo żyć!
        </Button>
      </motion.div>
    </Box>
  );
}
