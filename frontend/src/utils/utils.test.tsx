import { saveState, loadState } from "utils/localStorage";
import { LOCAL_STORAGE_KEY } from "const";
import { getContrastColor, getRandomHexColor } from "./colors";

describe("localStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should handle empty data", () => {
    loadState();
    expect(window.localStorage.getItem).toBeCalled();
    expect(loadState()).toBeUndefined();
  });

  it("should handle valid data", () => {
    const data = { message: "hello" };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));

    loadState();
    expect(window.localStorage.getItem).toBeCalled();
    expect(loadState()).toEqual(data);
  });

  it("should handle bad data", () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, "$");
    const result = loadState();
    expect(result).toBeUndefined();
  });

  it("should save data", () => {
    const stateToSave = { message: "Fix covid-19" };
    saveState(stateToSave);
    expect(localStorage.__STORE__[LOCAL_STORAGE_KEY]).toBe(
      JSON.stringify(stateToSave)
    );
  });
});

describe("color utilities", () => {
  it("should return white as contrast for black and vice versa", () => {
    expect(getContrastColor("#FFFFFF")).toEqual("#000000");
    expect(getContrastColor("#000000")).toEqual("#FFFFFF");
  });

  it("should return a valid random hex color", () => {
    expect(/^#(?:[0-9a-fA-F]{3}){1,2}$/.test(getRandomHexColor())).toBeTruthy();
  });
});
