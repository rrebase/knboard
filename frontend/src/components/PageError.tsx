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
  border: 1px solid #bbb;
  border-radius: 20px;
  max-width: 400px;
`;

interface Props {
  children: React.ReactNode;
}

const PageError = ({ children }: Props) => (
  <Paper elevation={1} css={paperStyles}>
    {children}
  </Paper>
);

export default PageError;
