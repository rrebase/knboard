import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Footer from "./Footer";

it("should open popover and have text visible", () => {
  render(<Footer />);
  fireEvent.click(screen.getByRole("button", { name: "About" }));
  expect(screen.getByRole("link", { name: "GitHub" })).toBeVisible();
});

it("should render github link correctly", async () => {
  render(<Footer />);
  fireEvent.click(screen.getByText("About"));
  await waitFor(() => {
    expect(screen.getByRole("alert")).toBeVisible();
  });
  expect(screen.getByRole("link", { name: "GitHub" })).toMatchSnapshot();
});
