import { createMuiTheme } from "@material-ui/core/styles";
import { Priority, PriorityValue } from "types";
import { PRIO1, PRIO2, PRIO3, PRIMARY, SECONDARY } from "utils/colors";

export const LOCAL_STORAGE_KEY = "knboard-v12";
export const TOAST_AUTO_HIDE_DURATION = 4000;

export const grid = 8;
export const borderRadius = 4;
export const imageSize = 40;
export const barHeight = 50;
export const sidebarWidth = 120;

export const PRIORITY_1: Priority = { value: "H", label: "High" };
export const PRIORITY_2: Priority = { value: "M", label: "Medium" };
export const PRIORITY_3: Priority = { value: "L", label: "Low" };

export const PRIORITY_OPTIONS: Priority[] = [
  PRIORITY_1,
  PRIORITY_2,
  PRIORITY_3
];

export const PRIORITY_MAP = PRIORITY_OPTIONS.reduce((acc, curr) => {
  acc[curr.value] = curr;
  return acc;
}, {} as Record<PriorityValue, Priority>);

export const PRIO_COLORS = {
  H: PRIO1,
  M: PRIO2,
  L: PRIO3
};

export const MD_EDITOR_PLUGINS = [
  "header",
  "fonts",
  "table",
  "link",
  "mode-toggle",
  "full-screen"
];

export const MD_EDITOR_CONFIG = {
  view: {
    menu: true,
    md: true,
    html: false
  },
  canView: {
    menu: true,
    md: true,
    html: true,
    fullScreen: true,
    hideMenu: false
  }
};

export const MD_EDITING_CONFIG = {
  view: {
    menu: false,
    md: true,
    html: false
  },
  canView: {
    menu: false,
    md: true,
    html: false,
    fullScreen: false,
    hideMenu: false
  }
};

export const MD_READ_ONLY_CONFIG = {
  view: {
    menu: false,
    md: false,
    html: true
  },
  canView: {
    menu: false,
    md: false,
    html: true,
    fullScreen: false,
    hideMenu: false
  }
};

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
  palette: {
    primary: {
      main: PRIMARY
    },
    secondary: {
      main: SECONDARY
    }
  },
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

export const modalPopperIndex = theme.zIndex.modal + 100;
export const modalPopperAutocompleteIndex = modalPopperIndex + 100;
export const modalPopperWidth = 300;

export enum Key {
  Enter = 13,
  Escape = 27
}
