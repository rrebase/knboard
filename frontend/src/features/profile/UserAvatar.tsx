import React from "react";
import { Avatar, Button, Popover, Grid, Link } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import {
  usePopupState,
  bindTrigger,
  bindPopover,
} from "material-ui-popup-state/hooks";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "store";
import { updateAvatar } from "./ProfileSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const avatarBorderStyles = css`
  cursor: pointer;
  border: 2px solid #5195dd;
  border-radius: 50%;
`;

const pulseStyles = css`
  ${avatarBorderStyles}
  animation: pulse 1.5s infinite;

  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(104, 105, 246, 0.85);
    }

    70% {
      box-shadow: 0 0 0 1em rgba(104, 105, 246, 0);
    }

    100% {
      box-shadow: 0 0 0 0 rgba(104, 105, 246, 0);
    }
  }
`;

const Container = styled.div`
  margin: 2rem;
  text-align: center;
`;

const Text = styled.p`
  margin: 0;
`;

const GridTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: space-between;
`;

const GridFooter = styled.div`
  margin-top: 1rem;
  margin-bottom: 1rem;
`;

const AvatarListContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2rem;
  max-width: 330px;
  max-height: 300px;
`;

const UserAvatar = () => {
  const user = useSelector((state: RootState) => state.profile.userDetail);
  const avatars = useSelector((state: RootState) => state.profile.avatars);
  const loading = useSelector(
    (state: RootState) => state.profile.avatarLoading
  );
  const dispatch = useDispatch();
  const popupState = usePopupState({
    variant: "popover",
    popupId: "avatarPopover",
  });

  const handleChangeAvatar = async (id: number) => {
    dispatch(updateAvatar(id));
  };

  return (
    <Container>
      <Avatar
        src={user?.avatar?.photo}
        alt={user?.avatar?.name}
        css={css`
          height: 6rem;
          width: 6rem;
          font-size: 36px;
        `}
      />
      <Button
        css={css`
          text-transform: initial;
          margin-top: 0.75rem;
          font-size: 0.75rem;
          padding: 4px 12px;
        `}
        variant="outlined"
        {...bindTrigger(popupState)}
        data-testid="change-avatar"
      >
        Change
      </Button>
      <Popover
        {...bindPopover(popupState)}
        keepMounted
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <AvatarListContainer>
          <GridTitle>
            <Text>Pick an Avatar</Text>
            <Button
              size="small"
              onClick={() => popupState.close()}
              css={css`
                min-width: 0;
              `}
              data-testid="close-avatar-picker"
            >
              <FontAwesomeIcon icon={faTimes} />
            </Button>
          </GridTitle>
          <Grid container>
            {avatars.map((avatar) => (
              <Grid item xs={3} key={avatar.id}>
                <img
                  onClick={() => handleChangeAvatar(avatar.id)}
                  css={css`
                    &:hover {
                      ${avatarBorderStyles}
                    }
                    ${avatar.id === loading && pulseStyles}
                  `}
                  src={avatar.photo}
                  alt={avatar.name}
                  width={60}
                  height={60}
                  data-testid={`avatar-${avatar.name}`}
                />
              </Grid>
            ))}
          </Grid>
          <GridFooter>
            <Alert
              severity="info"
              variant="outlined"
              css={css`
                font-size: 12px;
              `}
            >
              <span>
                Icons made by{" "}
                <Link
                  href="https://www.flaticon.com/authors/pixel-perfect"
                  title="Pixel perfect"
                >
                  Pixel perfect
                </Link>{" "}
                from{" "}
                <Link href="https://www.flaticon.com/" title="Flaticon">
                  www.flaticon.com
                </Link>
              </span>
            </Alert>
          </GridFooter>
        </AvatarListContainer>
      </Popover>
    </Container>
  );
};

export default UserAvatar;
