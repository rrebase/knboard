import { fireEvent, screen } from "@testing-library/react";
import React from "react";
import { renderWithProviders } from "utils/testHelpers";
import CommentSection from "./CommentSection";
import { createComment, fetchComments } from "./CommentSlice";

const taskId = 1;

it("should render comment section without errors", () => {
  renderWithProviders(<CommentSection taskId={taskId} />);
  expect(screen.getByText("Discussion")).toBeVisible();
});

it("should dispatch fetchComments for current task", () => {
  const { mockStore } = renderWithProviders(<CommentSection taskId={taskId} />);
  expect(
    mockStore
      .getActions()
      .filter((t) => t.type === fetchComments.pending.type)[0].meta.arg
  ).toEqual(taskId);
});

it("should dispatch createComment on button press", () => {
  const { mockStore } = renderWithProviders(<CommentSection taskId={taskId} />);
  const postBtn = screen.getByRole("button", { name: /post comment/i });
  const textarea = screen.getByRole("textbox", { name: /comment/i });

  // Should not dispatch an API call with empty text
  fireEvent.click(postBtn);
  expect(
    mockStore.getActions().filter((t) => t.type === createComment.pending.type)
  ).toHaveLength(0);

  // Should dispatch createComment with correct args
  fireEvent.change(textarea, { target: { value: "some comment" } });
  fireEvent.click(postBtn);
  expect(
    mockStore
      .getActions()
      .filter((t) => t.type === createComment.pending.type)[0].meta.arg
  ).toEqual({ text: "some comment", task: taskId });
});
