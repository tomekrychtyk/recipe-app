import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#FFD700",
    },
    background: {
      default: "#000000",
      paper: "#1C1C1C",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#B8B8B8",
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#1C1C1C",
        },
      },
    },
  },
});
