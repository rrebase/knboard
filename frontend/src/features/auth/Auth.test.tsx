import React from "react";
import { screen, fireEvent, act } from "@testing-library/react";
import {
  renderWithProviders,
  axiosMock,
  rootInitialState
} from "utils/testHelpers";
import Auth from "./Auth";
import { API_LOGIN, API_REGISTER } from "api";
import { login, register, clearErrors } from "./AuthSlice";

it("should have Knboard text", async () => {
  renderWithProviders(<Auth />);
  expect(screen.getByText("Knboard")).toBeVisible();
});

it("should login", async () => {
  const username = "steve15";
  const password = "secretpassword";
  const credentials = { username, password };

  axiosMock.onPost(API_LOGIN).reply(200, credentials);
  const { mockStore } = renderWithProviders(<Auth />);

  await act(async () => {
    fireEvent.click(screen.getByTestId("open-login-btn"));
    const usernameInput = await screen.findByLabelText("Username");

    fireEvent.change(usernameInput, {
      target: { value: username }
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: password }
    });
    fireEvent.click(screen.getByTestId("submit-login-btn"));
  });
  expect(JSON.parse(axiosMock.history.post[0].data)).toEqual(credentials);

  const actions = mockStore.getActions();
  expect(actions[0].type).toEqual(login.pending.type);
  expect(actions[1].type).toEqual(login.fulfilled.type);
  expect(actions[1].payload).toEqual(credentials);
});

it("should show login api errors", async () => {
  const errorMsg = "Bad credentials";

  const { mockStore } = renderWithProviders(<Auth />, {
    ...rootInitialState,
    auth: {
      ...rootInitialState.auth,
      // eslint-disable-next-line @typescript-eslint/camelcase
      loginErrors: { non_field_errors: [errorMsg] }
    }
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId("open-login-btn"));
    expect(await screen.findByText(errorMsg)).toBeVisible();
    const closeElem = await screen.findByTestId("close-dialog");
    fireEvent.click(closeElem);
  });
  expect(mockStore.getActions()).toHaveLength(1);
  expect(mockStore.getActions()[0].type === clearErrors.type);
});

it("should register", async () => {
  const username = "steve15";
  const email = "steve15@gmail.com";
  const password = "secretpassword";
  const credentials = {
    username,
    email,
    password1: password,
    password2: password
  };

  axiosMock.onPost(API_REGISTER).reply(201);
  const { mockStore } = renderWithProviders(<Auth />);

  await act(async () => {
    fireEvent.click(screen.getByTestId("open-register-btn"));
    const usernameInput = await screen.findByLabelText("Username");

    fireEvent.change(usernameInput, {
      target: { value: username }
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: email }
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: password }
    });
    fireEvent.change(screen.getByLabelText("Confirm Password"), {
      target: { value: password }
    });
    fireEvent.click(screen.getByTestId("submit-register-btn"));
  });
  expect(JSON.parse(axiosMock.history.post[0].data)).toEqual(credentials);

  const actions = mockStore.getActions();
  expect(actions[0].type).toEqual(register.pending.type);
  expect(actions[1].type).toEqual(register.fulfilled.type);
  expect(actions[1].payload).toEqual(undefined);
});

it("should show register api errors", async () => {
  const errorMsg = "Passwords don't match";

  const { mockStore } = renderWithProviders(<Auth />, {
    ...rootInitialState,
    auth: {
      ...rootInitialState.auth,
      // eslint-disable-next-line @typescript-eslint/camelcase
      registerErrors: { non_field_errors: [errorMsg] }
    }
  });

  await act(async () => {
    fireEvent.click(screen.getByTestId("open-register-btn"));
    expect(await screen.findByText(errorMsg)).toBeVisible();
    const closeElem = await screen.findByTestId("close-dialog");
    fireEvent.click(closeElem);
  });
  expect(mockStore.getActions()).toHaveLength(1);
  expect(mockStore.getActions()[0].type === clearErrors.type);
});
