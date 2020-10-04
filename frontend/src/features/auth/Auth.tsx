import React from "react";
import styled from "@emotion/styled";
import { ReactComponent as Board } from "static/svg/board.svg";
import LoginDialog from "./LoginDialog";
import RegisterDialog from "./RegisterDialog";
import EnterAsGuest from "./EnterAsGuest";
import Footer from "./Footer";
import SEO from "components/SEO";

const Container = styled.div`
  margin-top: 20vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  margin-top: 0;
  margin-bottom: 0.75rem;
`;

const Auth = () => {
  return (
    <Container>
      <SEO />
      <div>
        <Board width={200} height={200} />
      </div>
      <Title>Knboard</Title>
      <div>
        <LoginDialog />
        <RegisterDialog />
      </div>
      <EnterAsGuest />
      <Footer />
    </Container>
  );
};

export default Auth;
