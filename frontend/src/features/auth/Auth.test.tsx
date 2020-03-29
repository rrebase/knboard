import React from "react";
import { screen, fireEvent, act } from "@testing-library/react";
import axios from "axios";
import { renderWithProviders } from "utils/testHelpers";
import MockAdapter from "axios-mock-adapter";
import Auth from "./Auth";
import { API_LOGIN } from "api";
import { login } from "./AuthSlice";

const axiosMock = new MockAdapter(axios);

beforeEach(() => {
  axiosMock.reset();
});

it("should have knboard text", async () => {
  renderWithProviders(<Auth />);
  expect(screen.getByText("knboard")).toBeVisible();
});

it("should login", async () => {
  const username = "steve@gmail.com";
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
