import React from "react";
import { screen } from "@testing-library/react";
import Home from "./Home";
import { renderWithProviders } from "utils/testHelpers";

it("should have visit boards", () => {
  renderWithProviders(<Home />);
  expect(screen.getByText(/View Boards/i)).toBeVisible();
});
