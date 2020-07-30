/* eslint-disable @typescript-eslint/camelcase */
import React from "react";
import { screen, fireEvent } from "@testing-library/react";
import { rootInitialState, renderWithProviders } from "utils/testHelpers";
import MemberListDialog from "./MemberList";

const member1 = {
  id: 1,
  username: "testuser",
  email: "t@t.com",
  first_name: "Ragnar",
  last_name: "Rebase",
  avatar: null,
};

const member2 = {
  id: 2,
  username: "steveapple1",
  email: "steve@gmail.com",
  first_name: "Steve",
  last_name: "Apple",
  avatar: null,
};

it("should display and search members", async () => {
  renderWithProviders(<MemberListDialog />, {
    ...rootInitialState,
    member: {
      ...rootInitialState.member,
      memberListOpen: true,
      ids: [member1.id, member2.id],
      entities: { [member1.id]: member1, [member2.id]: member2 },
    },
  });
  expect(screen.getByText("2 members")).toBeVisible();
  expect(screen.getByText(member1.username)).toBeVisible();
  expect(screen.getByText(member2.username)).toBeVisible();

  fireEvent.change(screen.getByPlaceholderText("Search members"), {
    target: { value: member1.username },
  });

  expect(screen.getByText("1 member")).toBeVisible();
  expect(screen.getByText(member1.username)).toBeVisible();
  expect(screen.queryByText(member2.username)).toBeNull();

  fireEvent.change(screen.getByPlaceholderText("Search members"), {
    target: { value: "match nothing" },
  });

  expect(screen.getByText("0 members")).toBeVisible();
  expect(screen.queryByText(member1.username)).toBeNull();
  expect(screen.queryByText(member2.username)).toBeNull();
});
