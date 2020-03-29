import React from "react";
import { screen, fireEvent } from "@testing-library/react";
import { rootInitialState, renderWithProviders } from "utils/testHelpers";
import NewBoardDialog from "./NewBoardDialog";
import { createBoard } from "./BoardSlice";

it("should not show dialog", async () => {
  renderWithProviders(<NewBoardDialog />);
  expect(screen.queryByText(/Create a new private board./i)).toBeNull();
});

it("should show dialog", async () => {
  const { mockStore } = renderWithProviders(<NewBoardDialog />, {
    ...rootInitialState,
    board: { ...rootInitialState.board, createDialogOpen: true }
  });
  expect(screen.getByText(/Create a new private board./i)).toBeVisible();
  fireEvent.change(screen.getByLabelText("Board name"), {
    target: { value: "Science" }
  });
  fireEvent.click(screen.getByTestId("create-board-btn"));

  expect(mockStore.getActions()[0].type).toEqual(createBoard.pending.type);
});
