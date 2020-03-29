import { saveState, loadState } from "utils/localStorage";
import { LOCAL_STORAGE_KEY } from "const";

beforeEach(() => {
  localStorage.clear();
});

describe("loadState", () => {
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
});

describe("saveState", () => {
  it("should save data", () => {
    const stateToSave = { message: "Fix covid-19" };
    saveState(stateToSave);
    expect(localStorage.__STORE__[LOCAL_STORAGE_KEY]).toBe(
      JSON.stringify(stateToSave)
    );
  });
});
