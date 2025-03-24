import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  Container,
  Drawer,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import MenuIcon from "@mui/icons-material/Menu";
import { FoodBank } from "@mui/icons-material";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { text: "Home", icon: <HomeIcon />, path: "/" },
  { text: "Składniki", icon: <RestaurantIcon />, path: "/ingredients" },
  { text: "Przepisy", icon: <MenuBookIcon />, path: "/meals" },
  {
    text: "Sugestie posiłków",
    path: "/meal-suggestions",
    icon: <FoodBank />,
  },
];

export function Layout({ children }: LayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (mobileOpen) {
      handleDrawerToggle();
    }
  };

  const navigationItems = (
    <Box
      sx={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        gap: 2,
      }}
    >
      {navItems.map((item) => (
        <Button
          key={item.text}
          startIcon={item.icon}
          fullWidth={isMobile}
          onClick={() => handleNavigation(item.path)}
          sx={{
            color:
              location.pathname === item.path ? "primary.main" : "text.primary",
            justifyContent: isMobile ? "flex-start" : "center",
            "&:hover": {
              color: "primary.main",
            },
          }}
        >
          {item.text}
        </Button>
      ))}
    </Box>
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        width: "100%",
        maxWidth: "100%",
        overflow: "hidden",
      }}
    >
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          borderBottom: "1px solid rgba(255, 215, 0, 0.12)",
          width: "100%",
        }}
      >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 0, mr: 3 }}>
            🌟 dabelo.pl
          </Typography>

          {isMobile ? (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ ml: "auto" }}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <Box sx={{ flexGrow: 1, display: "flex", gap: 2 }}>
              {navigationItems}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {isMobile && (
        <Drawer
          variant="temporary"
          anchor="right"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: 240,
              backgroundColor: "background.paper",
            },
          }}
        >
          <Box sx={{ p: 2, mt: 8 }}>{navigationItems}</Box>
        </Drawer>
      )}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "background.default",
          width: "100%",
        }}
      >
        {children}
      </Box>

      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: "auto",
          backgroundColor: "background.paper",
          borderTop: "1px solid rgba(255, 215, 0, 0.12)",
          width: "100%",
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="body2" color="text.secondary" align="center">
            {"Copyright © dabelo.pl "}
            {new Date().getFullYear()}
            {" 🍽️ Made with ❤️ for food lovers"}
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
