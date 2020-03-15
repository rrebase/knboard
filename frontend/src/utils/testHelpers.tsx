import { render } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import { initialState as counterInitialState } from "features/counter/CounterSlice";
import { initialState as boardInitialState } from "features/board/BoardSlice";
import { initialState as columnInitialState } from "features/column/ColumnSlice";
import { initialState as taskInitialState } from "features/task/TaskSlice";
import { BrowserRouter as Router } from "react-router-dom";

const mockStore = configureStore([thunk]);

export const rootInitialState = {
  counter: counterInitialState,
  board: boardInitialState,
  column: columnInitialState,
  task: taskInitialState
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
