import React, { useRef } from "react";
import { Button, Popover } from "@material-ui/core";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import UserSearch from "./UserSearch";
import api, { API_BOARDS } from "api";
import { useDispatch } from "react-redux";
import {
  createErrorToast,
  createSuccessToast
} from "features/toast/ToastSlice";
import { addBoardMember } from "features/board/BoardSlice";
import { BoardMember } from "types";

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

interface Props {
  boardId: number;
}

const MemberInvite = ({ boardId }: Props) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const inputEl = useRef<HTMLInputElement | null>(null);
  const dispatch = useDispatch();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const postInviteMember = async (username: string) => {
    try {
      const response = await api.post(
        `${API_BOARDS}/${boardId}/invite_member/`,
        { username }
      );
      const newMember = response.data as BoardMember;
      dispatch(addBoardMember(newMember));
      dispatch(createSuccessToast(`Invited ${newMember.username}`));
      handleClose();
    } catch (err) {
      dispatch(createErrorToast(err.toString()));
    }
  };

  const handleClickInvite = async () => {
    const inputElem = inputEl?.current;
    if (inputElem) {
      const username = inputElem.value;
      postInviteMember(username);
    }
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
      >
        <Content>
          <Description>Invite to Board</Description>
          <UserSearch inputEl={inputEl} boardId={boardId} />
          <Button
            color="primary"
            variant="contained"
            css={css`
              margin-top: 0.75rem;
              width: 100%;
            `}
            onClick={handleClickInvite}
          >
            Invite
          </Button>
        </Content>
      </Popover>
    </>
  );
};

export default MemberInvite;
