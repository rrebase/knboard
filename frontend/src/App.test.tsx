import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders initial count", () => {
  render(<App />);
  const zero = screen.getByText("0");
  expect(zero).toBeInTheDocument();
});
