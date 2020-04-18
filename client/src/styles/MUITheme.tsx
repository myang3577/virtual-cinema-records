import { createMuiTheme } from "@material-ui/core/styles";
// https://material-ui.com/customization/color/#color
import { teal, lightGreen } from "@material-ui/core/colors";

export const tealLimeTheme = createMuiTheme({
  palette: {
    primary: {
      main: teal[400],
    },
    secondary: {
      main: lightGreen[500],
    },
  },
});
