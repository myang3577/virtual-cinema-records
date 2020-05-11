import { createMuiTheme } from "@material-ui/core/styles";
// https://material-ui.com/customization/color/#color
import { teal, lightGreen } from "@material-ui/core/colors";

export const tealLightGreenTheme = createMuiTheme({
  typography: {
    fontFamily: ["Khand"].join(","),
  },
  palette: {
    primary: {
      main: teal[400],
    },
    secondary: {
      main: lightGreen[500],
    },
  },
  overrides: {
    MuiTabs: {
      root: {
        minHeight: 0,
      },
    },
    MuiTab: {
      root: {
        "&:hover": {
          color: teal[400],
        },
        minHeight: 0,
      },
    },
    MuiCard: {
      root: {
        width: "100%",
        height: "auto",
      },
    },
    MuiCardHeader: {
      root: {
        width: "100%",
        height: 100,
      },
    },
    MuiCardContent: {
      root: {
        width: "80%",
        height: 50,
      },
    },
    MuiCardMedia: {
      media: {
        objectFit: "contain",
        height: 400,
        width: "100%",
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 800,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
});
