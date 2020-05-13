import { render } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

import { initialState as authInitialState } from "features/auth/AuthSlice";
import { initialState as profileInitialState } from "features/profile/ProfileSlice";
import { initialState as toastInitialState } from "features/toast/ToastSlice";
import { initialState as boardInitialState } from "features/board/BoardSlice";
import { initialState as columnInitialState } from "features/column/ColumnSlice";
import { initialState as taskInitialState } from "features/task/TaskSlice";
import { initialState as memberInitialState } from "features/member/MemberSlice";
import { initialState as labelInitialState } from "features/label/LabelSlice";
import { MemoryRouter } from "react-router-dom";
import { RootState } from "store";

export const rootInitialState = {
  auth: authInitialState,
  profile: profileInitialState,
  toast: toastInitialState,
  board: boardInitialState,
  column: columnInitialState,
  task: taskInitialState,
  member: memberInitialState,
  label: labelInitialState
};

export const axiosMock = new MockAdapter(axios);

export const renderWithProviders = (
  ui: React.ReactNode,
  initialState: RootState = rootInitialState
) => {
  const store = configureStore([thunk])(initialState);
  return {
    ...render(
      <MemoryRouter>
        <Provider store={store}>{ui}</Provider>
      </MemoryRouter>
    ),
    mockStore: store
  };
};
