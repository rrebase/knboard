import { LOCAL_STORAGE_KEY } from "const";

export const loadState = () => {
  try {
    const serializedState = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

export const saveState = (state: any) => {
  const serializedState = JSON.stringify(state);
  localStorage.setItem(LOCAL_STORAGE_KEY, serializedState);
};

export default { loadState, saveState };
