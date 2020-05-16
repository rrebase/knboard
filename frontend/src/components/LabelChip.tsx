import React from "react";
import { css } from "@emotion/core";
import { Chip } from "@material-ui/core";
import { getContrastColor, WHITE } from "utils/colors";
import { Label } from "types";

interface Props {
  label: Label;
  size?: "small" | "medium";
  onCard?: boolean;
}

const LabelChip = ({ label, size = "medium", onCard = false }: Props) => {
  return (
    <Chip
      variant="outlined"
      data-testid={`label${label.id}`}
      css={css`
        ${size === "small" && "font-size: 10px; height: unset;"}
        overflow: auto;
        background-color: ${label.color};
        color: ${getContrastColor(label.color)};
        border: ${getContrastColor(label.color) === WHITE && "none"};
        border-radius: 4px;
        ${onCard &&
          "cursor: pointer; max-width: fit-content; margin-bottom: 0.125rem; margin-right: 0.125rem;"}
        .MuiChip-label {
          ${size === "small" &&
            "padding: 1px 0.75em; line-height: 1.5; height: 18px; font-size: 10px;"}
        }
      `}
      label={label.name}
    />
  );
};

export default LabelChip;
