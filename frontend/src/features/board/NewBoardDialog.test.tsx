import React from "react";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import {
  rootInitialState,
  renderWithProviders,
  axiosMock,
} from "utils/testHelpers";
import NewBoardDialog from "./NewBoardDialog";
import { createBoard } from "./BoardSlice";
import { API_BOARDS } from "api";

it("should not show dialog", async () => {
  renderWithProviders(<NewBoardDialog />);
  expect(screen.queryByText(/Create a new private board./i)).toBeNull();
});

it("should show dialog", async () => {
  axiosMock
    .onPost(API_BOARDS)
    .reply(201, { id: 50, name: "Recipes", owner: 1 });
  const { getActionsTypes } = renderWithProviders(<NewBoardDialog />, {
    ...rootInitialState,
    board: { ...rootInitialState.board, createDialogOpen: true },
  });
  expect(screen.getByText(/Create a new private board./i)).toBeVisible();
  fireEvent.change(screen.getByLabelText("Board name"), {
    target: { value: "Science" },
  });
  fireEvent.click(screen.getByTestId("create-board-btn"));

  await waitFor(() =>
    expect(getActionsTypes().includes(createBoard.fulfilled.type)).toBe(true)
  );

  expect(getActionsTypes()).toEqual([
    createBoard.pending.type,
    createBoard.fulfilled.type,
  ]);
});
