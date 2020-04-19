import { css } from "@emotion/core";
import { borderRadius, imageSize, grid } from "const";
import { N900 } from "utils/colors";

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
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.3);
  box-sizing: border-box;
  padding: ${grid}px;
  min-height: ${imageSize}px;
  margin-bottom: ${grid}px;
  user-select: none;
  color: ${N900};

  &:hover,
  &:active {
    color: ${N900};
    background-color: #f5f5f5;
    text-decoration: none;
    cursor: pointer;
  }

  &:focus {
    outline: none;
    box-shadow: none;
  }

  /* flexbox */
  display: flex;
`;

export const avatarStyles = css`
  height: 2rem;
  width: 2rem;
  font-size: 12px;
  margin-left: -4px;
`;
