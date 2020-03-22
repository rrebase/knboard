import React from "react";
import { Button } from "@material-ui/core";
import styled from "@emotion/styled";
import { ReactComponent as Board } from "static/svg/board.svg";

const Container = styled.div`
  margin-top: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  margin-top: 0;
  margin-bottom: 0.75rem;
`;

const Login = () => {
  return (
    <Container>
      <div>
        <Board width={200} height={200} />
      </div>
      <Title>knboard</Title>
      <Button variant="contained" color="primary">
        Login
      </Button>
    </Container>
  );
};

export default Login;
