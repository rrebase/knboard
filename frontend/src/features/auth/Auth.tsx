import React from "react";
import styled from "@emotion/styled";
import { ReactComponent as Board } from "static/svg/board.svg";
import LoginDialog from "./LoginDialog";
import RegisterDialog from "./RegisterDialog";
import EnterAsGuest from "./EnterAsGuest";

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

const Separator = styled.div`
  margin-top: 1rem;
`;

const Auth = () => {
  return (
    <Container>
      <div>
        <Board width={200} height={200} />
      </div>
      <Title>Knboard</Title>
      <div>
        <LoginDialog />
        <RegisterDialog />
      </div>
      <Separator>or</Separator>
      <EnterAsGuest />
    </Container>
  );
};

export default Auth;
