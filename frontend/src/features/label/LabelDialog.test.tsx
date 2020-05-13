/* eslint-disable @typescript-eslint/camelcase */
import React from "react";
import { screen, waitFor, fireEvent } from "@testing-library/react";
import {
  rootInitialState,
  renderWithProviders,
  axiosMock
} from "utils/testHelpers";
import LabelsDialog from "./LabelsDialog";
import user from "@testing-library/user-event";
import { API_LABELS } from "api";
import { Label } from "types";
import { createLabel, deleteLabel, patchLabel } from "./LabelSlice";
import { createInfoToast } from "features/toast/ToastSlice";

const boardDetail = {
  id: 1,
  name: "Math",
  owner: {
    id: 1
  },
  members: [
    {
      id: 1,
      username: "steve",
      email: "steve@gmail.com",
      first_name: "Steve",
      last_name: "Apple",
      avatar: null
    }
  ]
};

const docLabel: Label = {
  id: 1,
  name: "Documentation",
  color: "#111fff",
  board: 1
};

it("should not show dialog", async () => {
  renderWithProviders(<LabelsDialog />);
  expect(screen.queryByText(/Edit labels/i)).toBeNull();
});

it("should dispatch createLabel", async () => {
  const { mockStore } = renderWithProviders(<LabelsDialog />, {
    ...rootInitialState,
    board: { ...rootInitialState.board, detail: boardDetail },
    label: { ...rootInitialState.label, dialogOpen: true }
  });
  axiosMock.onPost(API_LABELS).reply(201, docLabel);

  expect(screen.getByText(/Edit labels/i)).toBeVisible();
  expect(screen.getByText("0 labels")).toBeVisible();

  expect(screen.queryByText(/Save/i)).toBeNull();
  user.click(screen.getByText(/New label/i));
  fireEvent.change(screen.getByLabelText("Label name"), {
    target: { value: docLabel.name }
  });
  fireEvent.change(screen.getByLabelText("Color"), {
    target: { value: docLabel.color }
  });
  fireEvent.click(screen.getByText(/Save/i));
  await waitFor(() =>
    expect(
      mockStore
        .getActions()
        .map(a => a.type)
        .includes(createLabel.fulfilled.type)
    ).toBe(true)
  );
  expect(mockStore.getActions().map(a => a.type)).toEqual([
    createLabel.pending.type,
    createInfoToast.type,
    createLabel.fulfilled.type
  ]);
});

it("should have one label and dispatch deleteLabel", async () => {
  axiosMock.onDelete(`${API_LABELS}${docLabel.id}/`).reply(204);
  window.confirm = jest.fn().mockImplementation(() => true);
  const { mockStore } = renderWithProviders(<LabelsDialog />, {
    ...rootInitialState,
    board: { ...rootInitialState.board, detail: boardDetail },
    label: {
      ...rootInitialState.label,
      dialogOpen: true,
      ids: [docLabel.id],
      entities: { [docLabel.id]: docLabel }
    }
  });
  expect(screen.getByText("1 label")).toBeVisible();
  expect(screen.getByText(docLabel.name)).toBeVisible();
  fireEvent.click(screen.getByText(/Delete/i));
  await waitFor(() =>
    expect(
      mockStore
        .getActions()
        .map(a => a.type)
        .includes(deleteLabel.fulfilled.type)
    ).toBe(true)
  );
  expect(mockStore.getActions().map(a => a.type)).toEqual([
    deleteLabel.pending.type,
    createInfoToast.type,
    deleteLabel.fulfilled.type
  ]);
});

it("should edit a label", async () => {
  axiosMock.onPatch(`${API_LABELS}${docLabel.id}/`).reply(200);
  const { mockStore } = renderWithProviders(<LabelsDialog />, {
    ...rootInitialState,
    board: { ...rootInitialState.board, detail: boardDetail },
    label: {
      ...rootInitialState.label,
      dialogOpen: true,
      ids: [docLabel.id],
      entities: { [docLabel.id]: docLabel }
    }
  });
  fireEvent.click(screen.getByText(/^Edit$/i));
  fireEvent.change(screen.getByLabelText("Label name"), {
    target: { value: "New" }
  });
  fireEvent.click(screen.getByText(/Save/i));
  await waitFor(() =>
    expect(
      mockStore
        .getActions()
        .map(a => a.type)
        .includes(patchLabel.pending.type)
    ).toBe(true)
  );
  expect(mockStore.getActions().map(a => a.type)).toEqual([
    patchLabel.pending.type,
    createInfoToast.type,
    patchLabel.fulfilled.type
  ]);
  expect(axiosMock.history.patch[0].data).toEqual(
    JSON.stringify({
      name: "New",
      color: docLabel.color,
      board: docLabel.board
    })
  );
});

it("should cancel label editing", async () => {
  const { mockStore } = renderWithProviders(<LabelsDialog />, {
    ...rootInitialState,
    board: { ...rootInitialState.board, detail: boardDetail },
    label: {
      ...rootInitialState.label,
      dialogOpen: true,
      ids: [docLabel.id],
      entities: { [docLabel.id]: docLabel }
    }
  });
  fireEvent.click(screen.getByText(/^Edit$/i));
  fireEvent.change(screen.getByLabelText("Label name"), {
    target: { value: "New" }
  });
  fireEvent.click(screen.getByText(/Cancel/i));
  expect(screen.queryByText(/Save/i)).toBeNull();
  expect(screen.getByText(docLabel.name)).toBeVisible();
  expect(mockStore.getActions()).toHaveLength(0);
  expect(axiosMock.history.patch).toHaveLength(0);
});

it("should search from multiple labels", async () => {
  const designLabel = { ...docLabel, id: docLabel.id + 1, name: "Design" };
  const { mockStore } = renderWithProviders(<LabelsDialog />, {
    ...rootInitialState,
    board: { ...rootInitialState.board, detail: boardDetail },
    label: {
      ...rootInitialState.label,
      dialogOpen: true,
      ids: [docLabel.id, designLabel.id],
      entities: {
        [docLabel.id]: docLabel,
        [designLabel.id]: designLabel
      }
    }
  });
  expect(screen.getByText("2 labels")).toBeVisible();
  expect(screen.getByText(docLabel.name)).toBeVisible();
  expect(screen.getByText(designLabel.name)).toBeVisible();
  expect(mockStore.getActions()).toHaveLength(0);

  fireEvent.change(screen.getByPlaceholderText("Search labels"), {
    target: { value: "d" }
  });
  expect(screen.getByText("2 labels")).toBeVisible();
  expect(screen.getByText(docLabel.name)).toBeVisible();
  expect(screen.getByText(designLabel.name)).toBeVisible();

  fireEvent.change(screen.getByPlaceholderText("Search labels"), {
    target: { value: "Document" }
  });
  expect(screen.getByText("1 label")).toBeVisible();
  expect(screen.getByText(docLabel.name)).toBeVisible();
  expect(screen.queryByText(designLabel.name)).toBeNull();

  fireEvent.change(screen.getByPlaceholderText("Search labels"), {
    target: { value: "Nothing to see" }
  });
  expect(screen.getByText("0 labels")).toBeVisible();
  expect(screen.queryByText(docLabel.name)).toBeNull();
  expect(screen.queryByText(designLabel.name)).toBeNull();
});
