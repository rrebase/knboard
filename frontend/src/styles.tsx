import { css } from "@emotion/core";
import { borderRadius, imageSize, grid } from "const";
import { N900 } from "colors";

export const iconBoxStyles = css`
  cursor: pointer;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  margin: 1px;
  color: rgba(0, 0, 0, 0.5);
  opacity: 0.9;
  &:hover {
    opacity: 1;
    background: rgba(220, 220, 220, 1);
  }
`;

export const taskContainerStyles = css`
  border-radius: ${borderRadius}px;
  border: 2px solid transparent;
  box-sizing: border-box;
  padding: ${grid}px;
  min-height: ${imageSize}px;
  margin-bottom: ${grid}px;
  user-select: none;
  color: ${N900};

  &:hover,
  &:active {
    color: ${N900};
    text-decoration: none;
  }

  &:focus {
    outline: none;
    box-shadow: none;
  }

  /* flexbox */
  display: flex;
`;
