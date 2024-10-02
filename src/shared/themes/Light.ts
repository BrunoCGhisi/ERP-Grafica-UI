import { createTheme } from "@mui/material";
import { orange, cyan } from "@mui/material/colors";

export const LightTheme = createTheme({
  palette: {
    primary: {
      main: orange[400],
      dark: orange[500],
      light: orange[300],
      contrastText: "#fff",
    },
    secondary: {
      main: cyan[400],
      dark: cyan[700],
      light: cyan[200],
      contrastText: "#fff",
    },
    background: {
      paper: "#fff",
      default: "#f7f6f3",
    },
  },
});
