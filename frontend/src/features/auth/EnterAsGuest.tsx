import { Button } from "@material-ui/core";
import { css } from "@emotion/core";
import { guestRegister } from "./AuthSlice";
import React from "react";
import styled from "@emotion/styled";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

const Container = styled.div`
  text-decoration: underline;
`;

const EnterAsGuest = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const handleClick = () => {
    dispatch(guestRegister());
    history.push("/");
  };

  return (
    <Container>
      <Button
        css={css`
          text-transform: initial;
        `}
        onClick={handleClick}
      >
        Enter as a guest
      </Button>
    </Container>
  );
};

export default EnterAsGuest;
