import React from "react";
import { Button, Popover } from "@material-ui/core";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import UserSearch from "./UserSearch";

const InviteMember = styled.div`
  margin-left: 0.5rem;
`;

const Content = styled.div`
  padding: 2rem;
`;

const Description = styled.p`
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 20px;
  font-weight: bold;
`;

const MemberInvite = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <InviteMember>
        <Button
          variant="outlined"
          size="small"
          css={css`
            text-transform: none;
          `}
          onClick={handleClick}
          aria-controls="member-invite-menu"
          aria-haspopup="true"
        >
          Invite
        </Button>
      </InviteMember>
      <Popover
        id="member-invite-menu"
        anchorEl={anchorEl}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left"
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        transitionDuration={0}
        keepMounted
      >
        <Content>
          <Description>Invite to Board</Description>
          <UserSearch />
          <Button
            color="primary"
            variant="contained"
            css={css`
              margin-top: 0.75rem;
              width: 100%;
            `}
          >
            Invite
          </Button>
        </Content>
      </Popover>
    </>
  );
};

export default MemberInvite;
