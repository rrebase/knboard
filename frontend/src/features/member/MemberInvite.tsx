import React, { useState } from "react";
import { Button, Popover, Box } from "@material-ui/core";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import UserSearch, { UserOption } from "components/UserSearch";
import api, { API_BOARDS } from "api";
import { useDispatch } from "react-redux";
import {
  createErrorToast,
  createSuccessToast,
} from "features/toast/ToastSlice";
import { BoardMember } from "types";
import { addBoardMembers } from "features/member/MemberSlice";

const InviteMember = styled.div`
  margin-left: 0.5rem;
`;

const Content = styled.div`
  padding: 2rem;
`;

const Description = styled.p`
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  font-weight: bold;
`;

interface Props {
  boardId: number;
}

const MemberInvite = ({ boardId }: Props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [tagsValue, setTagsValue] = useState<UserOption[]>([]);
  const dispatch = useDispatch();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const postInviteMember = async (users: number[]) => {
    try {
      const response = await api.post(
        `${API_BOARDS}${boardId}/invite_member/`,
        { users }
      );
      const newMembers = response.data as BoardMember[];
      dispatch(addBoardMembers(newMembers));
      dispatch(
        createSuccessToast(
          `Invited ${newMembers.map((m) => m.username).join(", ")}`
        )
      );
      handleClose();
      setTagsValue([]);
    } catch (err) {
      dispatch(createErrorToast(err.toString()));
    }
  };

  const handleClickInvite = () => {
    postInviteMember(tagsValue.map((v) => v.id));
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
          data-testid="member-invite"
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
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        transitionDuration={0}
      >
        <Content>
          <Description>Invite to this board</Description>
          <Box display="flex" alignItems="center">
            <UserSearch
              boardId={boardId}
              tagsValue={tagsValue}
              setTagsValue={setTagsValue}
            />
            <Button
              color="primary"
              variant="contained"
              css={css`
                font-size: 0.625rem;
                margin-left: 0.5rem;
              `}
              onClick={handleClickInvite}
              data-testid="invite-selected"
              disabled={tagsValue.length === 0}
            >
              Invite
            </Button>
          </Box>
        </Content>
      </Popover>
    </>
  );
};

export default MemberInvite;
