import React from "react";
import { fireEvent, screen } from "@testing-library/react";
import Toast from "./Toast";
import toastReducer, {
  createSuccessToast,
  createInfoToast,
  createErrorToast,
  clearToast,
} from "./ToastSlice";
import { renderWithProviders, rootInitialState } from "utils/testHelpers";
import { TOAST_AUTO_HIDE_DURATION } from "const";

it("should show toast and auto hide", () => {
  jest.useFakeTimers();
  const { mockStore } = renderWithProviders(<Toast />, {
    ...rootInitialState,
    toast: {
      ...rootInitialState.toast,
      open: true,
      message: "Ready!",
      severity: "success",
    },
  });
  expect(screen.getByText("Ready!")).toBeVisible();
  fireEvent.click(screen.getByTestId("toast-close"));
  expect(mockStore.getActions()).toMatchSnapshot();

  mockStore.clearActions();
  jest.advanceTimersByTime(TOAST_AUTO_HIDE_DURATION);
  expect(mockStore.getActions()).toMatchSnapshot();
});

it("should create success toast", () => {
  expect(
    toastReducer(rootInitialState.toast, {
      type: createSuccessToast.type,
      payload: "Ready!",
    })
  ).toEqual({
    ...rootInitialState.toast,
    open: true,
    message: "Ready!",
    severity: "success",
  });
});

it("should create info toast", () => {
  expect(
    toastReducer(rootInitialState.toast, {
      type: createInfoToast.type,
      payload: "Update available!",
    })
  ).toEqual({
    ...rootInitialState.toast,
    open: true,
    message: "Update available!",
    severity: "info",
  });
});

it("should create error toast", () => {
  expect(
    toastReducer(rootInitialState.toast, {
      type: createErrorToast.type,
      payload: "Failed!",
    })
  ).toEqual({
    ...rootInitialState.toast,
    open: true,
    message: "Failed!",
    severity: "error",
  });
});

it("should clear toast", () => {
  expect(
    toastReducer(
      { ...rootInitialState.toast, open: true },
      {
        type: clearToast.type,
        payload: undefined,
      }
    )
  ).toEqual({
    ...rootInitialState.toast,
    open: false,
  });
});
