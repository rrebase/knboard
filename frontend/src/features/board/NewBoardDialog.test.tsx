import React from "react";
import { screen, fireEvent } from "@testing-library/react";
import axios from "axios";
import { rootInitialState, renderWithProviders } from "utils/testHelpers";
import MockAdapter from "axios-mock-adapter";
import NewBoardDialog from "./NewBoardDialog";
import { createBoard } from "./BoardSlice";

const axiosMock = new MockAdapter(axios);

beforeEach(() => {
  axiosMock.reset();
});

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
