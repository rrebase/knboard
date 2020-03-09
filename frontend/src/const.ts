import { createMuiTheme } from "@material-ui/core/styles";

export const LOCAL_STORAGE_KEY = "knboard-v5";

export const grid = 8;
export const borderRadius = 2;
export const imageSize = 40;

export const theme = createMuiTheme({
  palette: {},
  overrides: {
    MuiButton: {
      root: {
        "&:hover": {
          transition: "none"
        }
      }
    }
  }
});
