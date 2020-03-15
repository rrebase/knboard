import React from "react";
import { screen, fireEvent, wait } from "@testing-library/react";
import BoardList from "./BoardList";
import axios from "axios";
import { renderWithRedux, rootInitialState } from "utils/testHelpers";
import { getBoardsStart, getBoardsSuccess, getBoardsFail } from "./BoardSlice";
import { API_BOARDS } from "api";
import boardReducer from "features/board/BoardSlice";
import MockAdapter from "axios-mock-adapter";

const axiosMock = new MockAdapter(axios);

const boards = [{ id: 1, name: "Internals" }];

beforeEach(() => {
  axiosMock.reset();
});

it("should fetch and render board list", async () => {
  axiosMock.onGet(API_BOARDS).reply(200, boards);
  const { mockStore } = renderWithRedux(<BoardList />, {
    ...rootInitialState,
    board: { ...rootInitialState.board, entities: boards }
  });

  expect(screen.getByText(/My boards/i)).toBeVisible();
  expect(screen.getByText(/Create new board/i)).toBeVisible();

  await wait(() => screen.getByText("Internals"));

  expect(screen.queryAllByTestId("fade")).toHaveLength(0);
  fireEvent.mouseOver(screen.getByText("Internals"));
  expect(screen.queryAllByTestId("fade")).toHaveLength(1);
  fireEvent.mouseLeave(screen.getByText("Internals"));
  expect(screen.queryAllByTestId("fade")).toHaveLength(0);

  expect(mockStore.getActions()).toEqual([
    { type: getBoardsStart.type, payload: undefined },
    { type: getBoardsSuccess.type, payload: boards }
  ]);
});

it("should handle failure to fetch boards", async () => {
  axiosMock.onGet(API_BOARDS).networkErrorOnce();
  const { mockStore } = renderWithRedux(<BoardList />);

  // failure is not dispatched yet
  expect(mockStore.getActions()).toEqual([
    { type: getBoardsStart.type, payload: undefined }
  ]);
});

it("should set loading start on start", () => {
  expect(
    boardReducer(
      { ...rootInitialState.board, fetchLoading: false },
      getBoardsStart
    )
  ).toEqual({ ...rootInitialState.board, fetchLoading: true });
});

it("should set boards on success", () => {
  const boards = [{ id: 1, name: "Internals" }];
  expect(
    boardReducer(
      { ...rootInitialState.board, fetchLoading: true, entities: [] },
      { type: getBoardsSuccess, payload: boards }
    )
  ).toEqual({
    ...rootInitialState.board,
    fetchLoading: false,
    entities: boards
  });
});

it("should set error on fail", () => {
  const errorMsg = "Failed to fetch boards.";
  expect(
    boardReducer(
      { ...rootInitialState.board, fetchLoading: true, fetchError: null },
      { type: getBoardsFail, payload: errorMsg }
    )
  ).toEqual({
    ...rootInitialState.board,
    fetchLoading: false,
    fetchError: errorMsg
  });
});
