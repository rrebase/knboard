import React from "react";
import { Alert } from "@material-ui/lab";
import styled from "@emotion/styled";

const Container = styled.div`
  margin-top: 10rem;
  display: flex;
  justify-content: center;
  margin-left: auto;
  margin-right: auto;
  font-size: 1.25rem;
`;

interface Props {
  children: React.ReactNode;
}

const PageError = ({ children }: Props) => (
  <Container>
    <Alert severity="warning" variant="outlined">
      {children}
    </Alert>
  </Container>
);

export default PageError;
