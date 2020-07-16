import React from "react";
import { render, screen } from "@testing-library/react";
import PriorityOption from "./PriorityOption";
import { PRIO1 } from "utils/colors";

it("should render without errors", () => {
  render(<PriorityOption option={{ value: "H", label: "High" }} />);
  expect(screen.getByText("High")).toBeVisible();
  expect(screen.getByTestId("priority-icon")).toHaveAttribute("color", PRIO1);
});
