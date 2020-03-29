import { createMuiTheme } from "@material-ui/core/styles";

export const LOCAL_STORAGE_KEY = "knboard-v12";
export const TOAST_AUTO_HIDE_DURATION = 4000;

export const grid = 8;
export const borderRadius = 2;
export const imageSize = 40;
export const barHeight = 50;

export const theme = createMuiTheme({
  palette: {},
  transitions: {
    create: () => "none"
  },
  props: {
    MuiButtonBase: {
      disableRipple: true
    }
  },
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
