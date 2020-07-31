import { Button, Fade } from "@material-ui/core";
import { css } from "@emotion/core";
import { guestRegister } from "./AuthSlice";
import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import api, { API_AUTH_SETUP } from "api";
import { AuthSetup } from "types";
import { AxiosResponse } from "axios";

const Separator = styled.div`
  margin-top: 1rem;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const EnterAsGuest = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [allowGuest, setAllowGuest] = useState(false);

  useEffect(() => {
    const source = api.CancelToken.source();

    const fetchData = async () => {
      try {
        const response: AxiosResponse<AuthSetup> = await api(
          `${API_AUTH_SETUP}`,
          {
            cancelToken: source.token,
          }
        );
        setAllowGuest(response.data.ALLOW_GUEST_ACCESS);
      } catch (err) {
        if (!api.isCancel(err)) {
          console.error(err);
        }
      }
    };
    fetchData();

    return () => source.cancel();
  }, []);

  const handleClick = () => {
    dispatch(guestRegister());
    history.push("/");
  };

  if (!allowGuest) {
    return null;
  }

  return (
    <Fade in={allowGuest}>
      <Container>
        <Separator>or</Separator>
        <Button
          css={css`
            text-transform: initial;
          `}
          onClick={handleClick}
        >
          Enter as a guest
        </Button>
      </Container>
    </Fade>
  );
};

export default EnterAsGuest;
