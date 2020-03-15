import React from "react";
import { Paper } from "@material-ui/core";
import { css } from "@emotion/core";

const paperStyles = css`
  margin-top: 10rem;
  display: flex;
  justify-content: center;
  margin-left: auto;
  margin-right: auto;
  font-size: 1.25rem;
  padding: 2rem;
  border: 1px solid #999;
  border-radius: 6px;
  max-width: 300px;
`;

interface Props {
  children: React.ReactNode;
}

const PageError = ({ children }: Props) => (
  <Paper elevation={3} css={paperStyles}>
    {children}
  </Paper>
);

export default PageError;
