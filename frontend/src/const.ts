import { createMuiTheme } from "@material-ui/core/styles";

export const LOCAL_STORAGE_KEY = "knboard-v12";
export const TOAST_AUTO_HIDE_DURATION = 4000;

export const grid = 8;
export const borderRadius = 4;
export const imageSize = 40;
export const barHeight = 50;
export const sidebarWidth = 120;

export const PRIORITY_1 = "High";
export const PRIORITY_2 = "Medium";
export const PRIORITY_3 = "Low";

export const PRIORITY_OPTIONS = [PRIORITY_1, PRIORITY_2, PRIORITY_3];

export const QUILL_MODULES = {
  toolbar: [
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["code"]
  ]
};

export const QUILL_FORMATS = [
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "bullet",
  "link",
  "code"
];

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
