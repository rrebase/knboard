import { css } from "@emotion/core";
import { borderRadius, imageSize, grid } from "const";
import { N900 } from "utils/colors";

export const boardCardBaseStyles = css`
  position: relative;
  display: block;
  height: 100px;
  border-radius: 6px;
  padding: 0.5rem;
  text-decoration: none;
  &:hover {
    cursor: pointer;
  }
`;

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
  box-shadow: 0 1px 2px rgba(10, 30, 60, 0.25);
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

export const createMdEditorStyles = (editing: boolean) => css`
  .rc-md-editor {
    border-color: #c4c4c4;
    border-radius: ${borderRadius}px;

    .rc-md-navigation {
      border-top-left-radius: ${borderRadius}px;
      border-top-right-radius: ${borderRadius}px;
    }
    .section-container {
      border-bottom-left-radius: ${borderRadius}px;
      border-bottom-right-radius: ${borderRadius}px;
      ${editing &&
      `border-top-left-radius: ${borderRadius}px;
      border-top-right-radius: ${borderRadius}px;`}
    }
  }
`;

export const descriptionStyles = css`
  h1 {
    font-weight: 600;
    font-size: 24px;
    line-height: 28px;
    margin: 0 0 12px;
  }
  h2 {
    font-size: 20px;
    line-height: 24px;
    margin: 16px 0 8px;
  }
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-weight: 600;
    margin: 0 0 8px;
  }
  h3,
  h4,
  h5,
  h6 {
    font-size: 16px;
    line-height: 20px;
  }
  ol,
  ul {
    margin: 8px 0;
    padding: 0;

    margin-block-start: 0.25em;
    margin-block-end: 0.25em;
    padding-inline-start: 16px;
  }
  li {
    margin-bottom: 0;
  }
  p {
    margin: 0;
    margin-bottom: 10px;
    line-height: 20px;
  }
  pre {
    padding: 10px 16px;
    line-height: 16px;
  }
  code {
    font-size: 12px;
  }
  blockquote p {
    margin: 0;
  }
`;
