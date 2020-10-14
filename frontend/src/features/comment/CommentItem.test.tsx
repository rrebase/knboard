/* eslint-disable @typescript-eslint/camelcase */
import { screen } from "@testing-library/react";
import { formatISO } from "date-fns";
import React from "react";
import { BoardMember, TaskComment } from "types";
import { renderWithProviders, rootInitialState } from "utils/testHelpers";
import CommentItem from "./CommentItem";

const member: BoardMember = {
  id: 1,
  username: "foobar",
  email: "foobar@gmail.com",
  first_name: "Foo",
  last_name: "Bar",
  avatar: null,
};

const comment: TaskComment = {
  id: 1,
  author: 1,
  created: formatISO(new Date(2012, 8, 18, 19, 0, 52)),
  modified: formatISO(new Date(2015, 9, 15, 20, 2, 53)),
  task: 1,
  text: "foobar",
};

const initialReduxState = {
  ...rootInitialState,
  member: {
    ...rootInitialState.member,
    ids: [member.id],
    entities: { [member.id]: member },
  },
};

it("should render comment text and author first name", () => {
  renderWithProviders(<CommentItem comment={comment} />, initialReduxState);
  expect(screen.getByText(comment.text)).toBeVisible();
  expect(screen.getByText(member.first_name)).toBeVisible();
});

it("should be empty with invalid author", () => {
  const { container } = renderWithProviders(<CommentItem comment={comment} />);
  expect(container).toMatchInlineSnapshot(`<div />`);
});
