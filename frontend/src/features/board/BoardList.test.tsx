import React from "react";
import { screen, fireEvent } from "@testing-library/react";
import BoardList from "./BoardList";
import {
  renderWithProviders,
  rootInitialState,
  axiosMock,
} from "utils/testHelpers";
import { fetchAllBoards } from "./BoardSlice";
import { API_BOARDS } from "api";
import boardReducer from "features/board/BoardSlice";
import { Board } from "types";

const boards: Board[] = [{ id: 1, name: "Internals", owner: 1, members: [] }];

it("should fetch and render board list", async () => {
  axiosMock.onGet(API_BOARDS).reply(200, boards);
  const { mockStore } = renderWithProviders(<BoardList />, {
    ...rootInitialState,
    board: { ...rootInitialState.board, all: boards },
  });

  expect(screen.getByText(/All Boards/i)).toBeVisible();
  expect(screen.getByText(/Create new board/i)).toBeVisible();

  await screen.findByText("Internals");

  expect(screen.queryAllByTestId("fade")).toHaveLength(0);
  fireEvent.mouseOver(screen.getByText("Internals"));
  expect(screen.queryAllByTestId("fade")).toHaveLength(1);
  fireEvent.mouseLeave(screen.getByText("Internals"));
  expect(screen.queryAllByTestId("fade")).toHaveLength(0);

  const actions = mockStore.getActions();
  expect(actions[0].type).toEqual(fetchAllBoards.pending.type);
  expect(actions[1].type).toEqual(fetchAllBoards.fulfilled.type);
  expect(actions[1].payload).toEqual(boards);
});

it("should handle failure to fetch boards", async () => {
  axiosMock.onGet(API_BOARDS).networkErrorOnce();
  const { mockStore } = renderWithProviders(<BoardList />);

  // failure is not dispatched yet
  expect(mockStore.getActions()[0].type).toEqual(fetchAllBoards.pending.type);
});

it("should set loading start on start", () => {
  expect(
    boardReducer(
      { ...rootInitialState.board, fetchLoading: false },
      fetchAllBoards.pending
    )
  ).toEqual({ ...rootInitialState.board, fetchLoading: true });
});

it("should set boards on success", () => {
  const boards = [{ id: 1, name: "Internals" }];
  expect(
    boardReducer(
      { ...rootInitialState.board, fetchLoading: true, all: [] },
      { type: fetchAllBoards.fulfilled, payload: boards }
    )
  ).toEqual({
    ...rootInitialState.board,
    fetchLoading: false,
    all: boards,
  });
});

it("should set error on fail", () => {
  const errorMsg = "Failed to fetch boards.";
  expect(
    boardReducer(
      { ...rootInitialState.board, fetchLoading: true, fetchError: null },
      { type: fetchAllBoards.rejected, payload: errorMsg }
    )
  ).toEqual({
    ...rootInitialState.board,
    fetchLoading: false,
    fetchError: errorMsg,
  });
});
