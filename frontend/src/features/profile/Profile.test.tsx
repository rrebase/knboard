import React from "react";
import { screen, fireEvent, act } from "@testing-library/react";
import Profile from "./Profile";
import {
  renderWithProviders,
  rootInitialState,
  axiosMock
} from "utils/testHelpers";
import { API_USERS } from "api";
import { User, UserDetail } from "types";

/* eslint-disable @typescript-eslint/camelcase */
const steveDetail: UserDetail = {
  id: 1,
  username: "steve",
  first_name: "Steve",
  last_name: "Apple",
  email: "steve@gmail.com",
  avatar: null,
  date_joined: new Date().toISOString()
};

const steveAuthUser: User = {
  key: "627a1758dff1cdde4f52578b0b6fdbf7b1c6d9b6",
  id: 1,
  username: "steve",
  photo_url: null
};

it("should handle null userDetail", () => {
  renderWithProviders(<Profile />);
  expect(screen.queryByText("about")).toBeNull();
});

it("should render default values", () => {
  renderWithProviders(<Profile />, {
    ...rootInitialState,
    profile: {
      ...rootInitialState.profile,
      userDetail: steveDetail
    }
  });
  expect(screen.getByText(/About/i)).toBeVisible();

  expect(screen.getByLabelText("Username")).toHaveValue("steve");
  expect(screen.getByLabelText("First name")).toHaveValue("Steve");
  expect(screen.getByLabelText("Last name")).toHaveValue("Apple");
  expect(screen.getByLabelText("Email")).toHaveValue("steve@gmail.com");
});

it("should update username", async () => {
  axiosMock.onPut(`${API_USERS}${steveDetail.id}/`).reply(200, {
    ...steveDetail,
    username: "newsteve"
  });

  renderWithProviders(<Profile />, {
    ...rootInitialState,
    auth: {
      ...rootInitialState.auth,
      user: steveAuthUser
    },
    profile: {
      ...rootInitialState.profile,
      userDetail: steveDetail
    }
  });

  fireEvent.change(screen.getByLabelText("Username"), {
    target: { value: "newsteve" }
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId("profile-save"));
  });
});

it("should show validation error for email field", async () => {
  renderWithProviders(<Profile />, {
    ...rootInitialState,
    auth: {
      ...rootInitialState.auth,
      user: steveAuthUser
    },
    profile: {
      ...rootInitialState.profile,
      userDetail: steveDetail
    }
  });

  await act(async () => {
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "bad@." }
    });
    fireEvent.click(screen.getByTestId("profile-save"));
  });
  expect(screen.getByText(/invalid email/i)).toBeVisible();
});
