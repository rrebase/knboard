import React from "react";
import { Avatar, Button, Popover, Grid, Link } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import {
  usePopupState,
  bindTrigger,
  bindPopover
} from "material-ui-popup-state/hooks";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "store";
import { updateAvatar } from "./ProfileSlice";

const Container = styled.div`
  margin: 2rem;
  text-align: center;
`;

const GridTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 1.5rem;
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
  const dispatch = useDispatch();
  const popupState = usePopupState({
    variant: "popover",
    popupId: "avatarPopover"
  });

  const handleChangeAvatar = (id: number) => {
    dispatch(updateAvatar(id));
  };

  return (
    <Container>
      {user?.avatar ? (
        <img
          src={user?.avatar?.photo}
          alt={user?.avatar?.name}
          width={96}
          height={96}
        />
      ) : (
        <Avatar
          css={css`
            height: 6rem;
            width: 6rem;
            font-size: 36px;
          `}
        />
      )}
      <Button
        css={css`
          text-transform: initial;
          margin-top: 0.75rem;
          font-size: 0.75rem;
          padding: 4px 12px;
        `}
        variant="outlined"
        {...bindTrigger(popupState)}
      >
        Change
      </Button>
      <Popover
        {...bindPopover(popupState)}
        keepMounted
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <AvatarListContainer>
          <GridTitle>Pick an Avatar</GridTitle>
          <Grid container>
            {avatars.map(avatar => (
              <Grid item xs={3} key={avatar.id}>
                <img
                  onClick={() => handleChangeAvatar(avatar.id)}
                  css={css`
                    &:hover {
                      cursor: pointer;
                      border: 2px solid #5195dd;
                      border-radius: 50%;
                    }
                  `}
                  src={avatar.photo}
                  alt={avatar.name}
                  width={60}
                  height={60}
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
