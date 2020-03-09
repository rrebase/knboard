import { css } from "@emotion/core";

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
