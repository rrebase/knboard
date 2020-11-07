import React from "react";
import { css } from "@emotion/core";
import { Chip, ChipProps } from "@material-ui/core";
import { getContrastColor, WHITE } from "utils/colors";
import { Label } from "types";

interface Props extends ChipProps {
  label: Label;
  onCard?: boolean;
}

const LabelChip = ({ label, onCard = false, ...rest }: Props) => {
  const contrastColor = getContrastColor(label.color);

  return (
    <Chip
      variant="outlined"
      data-testid={`label${label.id}`}
      label={label.name}
      css={css`
        overflow: auto;
        background-color: ${label.color};
        color: ${contrastColor};
        border: ${contrastColor === WHITE && "none"};
        border-radius: 4px;
        ${onCard &&
        `
          cursor: pointer;
          max-width: fit-content; 
          margin-bottom: 0.125rem; 
          margin-right: 0.125rem; 
          font-size: 10px; 
          height: unset;
        `}
        .MuiChip-label {
          ${onCard &&
          `
            font-weight: 500;
            padding: 1px 0.75em;
            line-height: 1.5;
            height: 18px;
            font-size: 10px;
          `}
        }
        .MuiChip-deleteIcon {
          color: ${contrastColor};
        }
      `}
      {...rest}
    />
  );
};

export default LabelChip;
