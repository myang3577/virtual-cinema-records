import { createMuiTheme } from "@material-ui/core/styles";
// https://material-ui.com/customization/color/#color
import { teal, lightGreen } from "@material-ui/core/colors";

export const tealLightGreenTheme = createMuiTheme({
  palette: {
    primary: {
      main: teal[400],
    },
    secondary: {
      main: lightGreen[500],
    },
  },
  overrides: {
    MuiTab: {
      root: {
        "&:hover": {
          color: teal[400],
        },
      },
    },
  },
});
