import { loadState, saveState } from "./utils/localStorage";
import { configureStore } from "@reduxjs/toolkit";
import { Action, combineReducers } from "@reduxjs/toolkit";
import { ThunkAction } from "redux-thunk";
import counterReducer from "./features/counter/CounterSlice";
import boardReducer from "./features/board/BoardSlice";
import columnReducer from "./features/column/ColumnSlice";
import taskReducer from "./features/task/TaskSlice";

export const rootReducer = combineReducers({
  counter: counterReducer,
  board: boardReducer,
  column: columnReducer,
  task: taskReducer
});

const store = configureStore({
  devTools: process.env.NODE_ENV !== "production",
  preloadedState: loadState() || {},
  reducer: rootReducer
});

store.subscribe(() => {
  const state = store.getState();

  saveState({
    ...state,
    board: state.board
  });
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppThunk = ThunkAction<void, RootState, null, Action<string>>;
export type AppDispatch = typeof store.dispatch;

export default store;
