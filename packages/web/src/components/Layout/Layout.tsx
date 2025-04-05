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
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Tooltip,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import MenuIcon from "@mui/icons-material/Menu";
import {
  FoodBank,
  CalendarMonth,
  Add as AddIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  Payments as PaymentsIcon,
  Kitchen as KitchenIcon,
  ShoppingCart as ShoppingCartIcon,
} from "@mui/icons-material";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

interface LayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  { text: "Home", path: "/", icon: <HomeIcon /> },
  { text: "Przepisy", path: "/meals", icon: <RestaurantIcon /> },
  { text: "Wybierz plan", path: "/pricing", icon: <PaymentsIcon /> },
  {
    text: "Sugeruj posiłek",
    path: "/meal-suggestions",
    icon: <RestaurantIcon />,
  },
];

export function Layout({ children }: LayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut, isAdmin } = useAuth();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (mobileOpen) {
      handleDrawerToggle();
    }
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    await signOut();
    handleClose();
    navigate("/login");
  };

  const navigationItems = (
    <Box
      sx={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        gap: 2,
      }}
    >
      {menuItems.map((item) => (
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

  const authSection = user ? (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Tooltip title="Dziennik posiłków">
        <IconButton
          onClick={() => navigate("/food-diary")}
          sx={{
            color:
              location.pathname === "/food-diary"
                ? "primary.main"
                : "text.primary",
          }}
        >
          <FoodBank sx={{ fontSize: 24 }} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Plan posiłków">
        <IconButton
          onClick={() => navigate("/meal-planner")}
          sx={{
            color:
              location.pathname === "/meal-planner"
                ? "primary.main"
                : "text.primary",
          }}
        >
          <CalendarMonth sx={{ fontSize: 24 }} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Lista zakupów">
        <IconButton
          onClick={() => navigate("/shopping-list")}
          sx={{
            color:
              location.pathname === "/shopping-list"
                ? "primary.main"
                : "text.primary",
          }}
        >
          <ShoppingCartIcon sx={{ fontSize: 24 }} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Moje przepisy">
        <IconButton
          onClick={() => navigate("/my-meals")}
          sx={{
            color:
              location.pathname === "/my-meals"
                ? "primary.main"
                : "text.primary",
          }}
        >
          <MenuBookIcon sx={{ fontSize: 24 }} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Dodaj przepis">
        <IconButton
          onClick={() => navigate("/meals/new")}
          sx={{
            color:
              location.pathname === "/meals/new"
                ? "primary.main"
                : "text.primary",
          }}
        >
          <AddIcon sx={{ fontSize: 24 }} />
        </IconButton>
      </Tooltip>
      <IconButton
        onClick={handleMenu}
        sx={{
          border: "2px solid",
          borderColor: "primary.main",
        }}
      >
        <Avatar
          sx={{
            width: 32,
            height: 32,
            bgcolor: "primary.main",
            color: "background.paper",
          }}
        >
          {user.email?.[0].toUpperCase()}
        </Avatar>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem disabled>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          {user.email}
        </MenuItem>
        {isAdmin && (
          <MenuItem onClick={() => navigate("/ingredients")}>
            <ListItemIcon>
              <KitchenIcon fontSize="small" />
            </ListItemIcon>
            Składniki
          </MenuItem>
        )}
        <MenuItem onClick={handleSignOut}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Wyloguj się
        </MenuItem>
      </Menu>
    </Box>
  ) : (
    <Button
      color="inherit"
      onClick={() => navigate("/login")}
      sx={{
        ml: 2,
        borderColor: "primary.main",
        color: "primary.main",
        "&:hover": {
          borderColor: "primary.light",
          color: "primary.light",
        },
      }}
      variant="outlined"
    >
      Zaloguj się
    </Button>
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
            <>
              <Box sx={{ flexGrow: 1 }} />
              {authSection}
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ ml: 2 }}
              >
                <MenuIcon />
              </IconButton>
            </>
          ) : (
            <>
              <Box sx={{ flexGrow: 1, display: "flex", gap: 2 }}>
                {navigationItems}
              </Box>
              {authSection}
            </>
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
            keepMounted: true,
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
            {" 🍽️ Stworzone z ❤️ dla miłośników jedzenia"}
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
