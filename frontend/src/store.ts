import { loadState, saveState } from "./utils/localStorage";
import { Action, configureStore, combineReducers } from "@reduxjs/toolkit";
import { ThunkAction } from "redux-thunk";

import authReducer from "./features/auth/AuthSlice";
import profileReducer from "./features/profile/ProfileSlice";
import toastReducer from "./features/toast/ToastSlice";
import boardReducer from "./features/board/BoardSlice";
import columnReducer from "./features/column/ColumnSlice";
import taskReducer from "./features/task/TaskSlice";
import commentReducer from "./features/comment/CommentSlice";
import labelReducer from "./features/label/LabelSlice";
import memberReducer from "./features/member/MemberSlice";
import responsiveReducer from "./features/responsive/ResponsiveSlice";

import authInitialState from "./features/auth/AuthSlice";
import { setupInterceptors } from "api";

export const rootReducer = combineReducers({
  auth: authReducer,
  profile: profileReducer,
  toast: toastReducer,
  board: boardReducer,
  column: columnReducer,
  task: taskReducer,
  comment: commentReducer,
  member: memberReducer,
  label: labelReducer,
  responsive: responsiveReducer,
});

const store = configureStore({
  devTools: process.env.NODE_ENV !== "production",
  preloadedState: loadState() || {},
  reducer: rootReducer,
});

store.subscribe(() => {
  const state = store.getState();
  saveState({
    auth: {
      ...authInitialState,
      user: state.auth.user,
    },
  });
});

setupInterceptors(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppThunk = ThunkAction<void, RootState, null, Action<string>>;
export type AppDispatch = typeof store.dispatch;

export default store;
