import { render } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import { initialState as authInitialState } from "features/auth/AuthSlice";
import { initialState as toastInitialState } from "features/toast/ToastSlice";
import { initialState as boardInitialState } from "features/board/BoardSlice";
import { initialState as columnInitialState } from "features/column/ColumnSlice";
import { initialState as taskInitialState } from "features/task/TaskSlice";
import { initialState as memberInitialState } from "features/member/MemberSlice";
import { BrowserRouter as Router } from "react-router-dom";

const mockStore = configureStore([thunk]);

export const rootInitialState = {
  auth: authInitialState,
  toast: toastInitialState,
  board: boardInitialState,
  column: columnInitialState,
  task: taskInitialState,
  member: memberInitialState
};

export const renderWithRedux = (
  ui: JSX.Element,
  initialState: object = rootInitialState
) => {
  const store = mockStore(initialState);
  return {
    ...render(
      <Router>
        <Provider store={store}>{ui}</Provider>
      </Router>
    ),
    mockStore: store
  };
};
