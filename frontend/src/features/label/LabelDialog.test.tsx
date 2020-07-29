/* eslint-disable @typescript-eslint/camelcase */
import React from "react";
import { screen, waitFor, fireEvent } from "@testing-library/react";
import {
  rootInitialState,
  renderWithProviders,
  axiosMock,
} from "utils/testHelpers";
import LabelDialog from "./LabelDialog";
import user from "@testing-library/user-event";
import { API_LABELS } from "api";
import { Label } from "types";
import labelReducer, {
  createLabel,
  deleteLabel,
  patchLabel,
  setDialogOpen,
} from "./LabelSlice";
import { createInfoToast } from "features/toast/ToastSlice";

const boardDetail = {
  id: 1,
  name: "Math",
  owner: 1,
  members: [
    {
      id: 1,
      username: "steve",
      email: "steve@gmail.com",
      first_name: "Steve",
      last_name: "Apple",
      avatar: null,
    },
  ],
};

const docLabel: Label = {
  id: 1,
  name: "Documentation",
  color: "#111fff",
  board: 1,
};

it("should not show dialog", async () => {
  renderWithProviders(<LabelDialog />);
  expect(screen.queryByText(/Edit labels/i)).toBeNull();
});

it("should dispatch createLabel", async () => {
  const { getActionsTypes } = renderWithProviders(<LabelDialog />, {
    ...rootInitialState,
    board: { ...rootInitialState.board, detail: boardDetail },
    label: { ...rootInitialState.label, dialogOpen: true },
  });
  axiosMock.onPost(API_LABELS).reply(201, docLabel);

  expect(screen.getByText(/Edit labels/i)).toBeVisible();
  expect(screen.getByText("0 labels")).toBeVisible();

  expect(screen.queryByText(/Save/i)).toBeNull();
  user.click(screen.getByText(/New label/i));
  fireEvent.change(screen.getByLabelText("Label name"), {
    target: { value: docLabel.name },
  });
  fireEvent.change(screen.getByLabelText("Color"), {
    target: { value: docLabel.color },
  });
  fireEvent.click(screen.getByText(/Save/i));
  await waitFor(() =>
    expect(getActionsTypes().includes(createLabel.fulfilled.type)).toBe(true)
  );
  expect(getActionsTypes()).toEqual([
    createLabel.pending.type,
    createInfoToast.type,
    createLabel.fulfilled.type,
  ]);
});

it("should have one label and dispatch deleteLabel", async () => {
  axiosMock.onDelete(`${API_LABELS}${docLabel.id}/`).reply(204);
  window.confirm = jest.fn().mockImplementation(() => true);
  const { getActionsTypes } = renderWithProviders(<LabelDialog />, {
    ...rootInitialState,
    board: { ...rootInitialState.board, detail: boardDetail },
    label: {
      ...rootInitialState.label,
      dialogOpen: true,
      ids: [docLabel.id],
      entities: { [docLabel.id]: docLabel },
    },
  });
  expect(screen.getByRole("heading", { name: "1 label" })).toBeVisible();
  expect(screen.getByText(docLabel.name)).toBeVisible();
  fireEvent.click(screen.getByRole("button", { name: /delete/i }));
  await waitFor(() =>
    expect(getActionsTypes().includes(deleteLabel.fulfilled.type)).toBe(true)
  );
  expect(getActionsTypes()).toEqual([
    deleteLabel.pending.type,
    createInfoToast.type,
    deleteLabel.fulfilled.type,
  ]);
});

it("should edit a label", async () => {
  axiosMock.onPatch(`${API_LABELS}${docLabel.id}/`).reply(200);
  const { getActionsTypes } = renderWithProviders(<LabelDialog />, {
    ...rootInitialState,
    board: { ...rootInitialState.board, detail: boardDetail },
    label: {
      ...rootInitialState.label,
      dialogOpen: true,
      ids: [docLabel.id],
      entities: { [docLabel.id]: docLabel },
    },
  });
  fireEvent.click(screen.getByText(/^Edit$/i));
  fireEvent.change(screen.getByLabelText("Label name"), {
    target: { value: "New" },
  });
  fireEvent.click(screen.getByText(/Save/i));
  await waitFor(() =>
    expect(getActionsTypes().includes(patchLabel.pending.type)).toBe(true)
  );
  expect(getActionsTypes()).toEqual([
    patchLabel.pending.type,
    createInfoToast.type,
    patchLabel.fulfilled.type,
  ]);
  expect(axiosMock.history.patch[0].data).toEqual(
    JSON.stringify({
      name: "New",
      color: docLabel.color,
      board: docLabel.board,
    })
  );
});

it("should not save invalid and cancel label editing", async () => {
  const { mockStore } = renderWithProviders(<LabelDialog />, {
    ...rootInitialState,
    board: { ...rootInitialState.board, detail: boardDetail },
    label: {
      ...rootInitialState.label,
      dialogOpen: true,
      ids: [docLabel.id],
      entities: { [docLabel.id]: docLabel },
    },
  });
  fireEvent.click(screen.getByText(/^Edit$/i));
  fireEvent.change(screen.getByLabelText("Label name"), {
    target: { value: "New" },
  });
  fireEvent.change(screen.getByLabelText("Color"), {
    target: { value: "#invalid" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Save" }));
  fireEvent.click(screen.getByTestId("random-color"));
  waitFor(() => expect(screen.getByLabelText("Color")).not.toEqual("#invalid"));
  fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
  expect(screen.queryByRole("button", { name: "Save" })).toBeNull();
  expect(screen.getByText(docLabel.name)).toBeVisible();
  expect(mockStore.getActions()).toHaveLength(0);
  expect(axiosMock.history.patch).toHaveLength(0);
});

it("should search from multiple labels", async () => {
  const designLabel = { ...docLabel, id: docLabel.id + 1, name: "Design" };
  const { mockStore } = renderWithProviders(<LabelDialog />, {
    ...rootInitialState,
    board: { ...rootInitialState.board, detail: boardDetail },
    label: {
      ...rootInitialState.label,
      dialogOpen: true,
      ids: [docLabel.id, designLabel.id],
      entities: {
        [docLabel.id]: docLabel,
        [designLabel.id]: designLabel,
      },
    },
  });
  expect(screen.getByText("2 labels")).toBeVisible();
  expect(screen.getByText(docLabel.name)).toBeVisible();
  expect(screen.getByText(designLabel.name)).toBeVisible();
  expect(mockStore.getActions()).toHaveLength(0);

  fireEvent.change(screen.getByPlaceholderText("Search labels"), {
    target: { value: "d" },
  });
  expect(screen.getByText("2 labels")).toBeVisible();
  expect(screen.getByText(docLabel.name)).toBeVisible();
  expect(screen.getByText(designLabel.name)).toBeVisible();

  fireEvent.change(screen.getByPlaceholderText("Search labels"), {
    target: { value: "Document" },
  });
  expect(screen.getByText("1 label")).toBeVisible();
  expect(screen.getByText(docLabel.name)).toBeVisible();
  expect(screen.queryByText(designLabel.name)).toBeNull();

  fireEvent.change(screen.getByPlaceholderText("Search labels"), {
    target: { value: "Nothing to see" },
  });
  expect(screen.getByText("0 labels")).toBeVisible();
  expect(screen.queryByText(docLabel.name)).toBeNull();
  expect(screen.queryByText(designLabel.name)).toBeNull();
});

describe("LabelSlice", () => {
  it("should set dialog state", () => {
    const initial = rootInitialState.label;
    const result = {
      ...rootInitialState.label,
      dialogOpen: true,
    };
    expect(
      labelReducer(initial, { type: setDialogOpen.type, payload: true })
    ).toEqual(result);
  });

  it("should add label", () => {
    const initial = rootInitialState.label;
    const result = {
      ...rootInitialState.label,
      ids: [docLabel.id],
      entities: { [docLabel.id]: docLabel },
    };
    expect(
      labelReducer(initial, {
        type: createLabel.fulfilled.type,
        payload: docLabel,
      })
    ).toEqual(result);
  });

  it("should update label", () => {
    const updatedName = "Fresh";
    const initial = {
      ...rootInitialState.label,
      ids: [docLabel.id],
      entities: { [docLabel.id]: docLabel },
    };
    const result = {
      ...rootInitialState.label,
      ids: [docLabel.id],
      entities: { [docLabel.id]: { ...docLabel, name: updatedName } },
    };
    expect(
      labelReducer(initial, {
        type: patchLabel.fulfilled.type,
        payload: { id: docLabel.id, color: docLabel.color, name: updatedName },
      })
    ).toEqual(result);
  });

  it("should delete label", () => {
    const initial = {
      ...rootInitialState.label,
      ids: [docLabel.id],
      entities: { [docLabel.id]: docLabel },
    };
    const result = {
      ...rootInitialState.label,
      ids: [],
      entities: {},
    };
    expect(
      labelReducer(initial, {
        type: deleteLabel.fulfilled.type,
        payload: docLabel.id,
      })
    ).toEqual(result);
  });
});
