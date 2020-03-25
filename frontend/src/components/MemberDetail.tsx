import React, { useState } from "react";
import { Dialog, Avatar, Button, Fab } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { BoardMember, Board } from "types";
import { avatarStyles } from "styles";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import api, { API_BOARDS } from "api";
import {
  createSuccessToast,
  createErrorToast
} from "features/toast/ToastSlice";
import { removeBoardMember } from "features/board/BoardSlice";
import { useDispatch } from "react-redux";

const Container = styled.div`
  display: flex;
  padding: 2rem;
`;

const PrimaryText = styled.h3`
  margin-top: 0;
`;

const Main = styled.div`
  margin-left: 2rem;
  font-size: 16px;
`;

const SecondaryText = styled.p`
  margin: 0;
  font-size: 14px;
  color: #777;
`;

const ConfirmAction = styled.div`
  display: flex;
  justify-content: space-between;
`;

interface Props {
  board: Board;
  member: BoardMember;
}

const MemberDetail = ({ board, member }: Props) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleRemoveMember = async () => {
    try {
      const response = await api.post(
        `${API_BOARDS}/${board.id}/remove_member/`,
        { username: member.username }
      );
      const removedMember = response.data as BoardMember;
      dispatch(removeBoardMember(removedMember));
      dispatch(createSuccessToast(`Removed ${removedMember.username}`));
      handleClose();
    } catch (err) {
      dispatch(createErrorToast(err.toString()));
    }

    handleClose();
  };

  return (
    <>
      <Avatar
        css={css`
          ${avatarStyles} &:hover {
            cursor: pointer;
          }
        `}
        onClick={handleClick}
      >
        {member.username.charAt(0)}
      </Avatar>
      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <Container>
          {confirmDelete ? (
            <div>
              <Alert
                severity="error"
                css={css`
                  margin-bottom: 2rem;
                `}
              >
                Are you sure you want to remove this member? This member will be
                removed from all cards.
              </Alert>
              <ConfirmAction>
                <Fab
                  size="small"
                  onClick={() => setConfirmDelete(false)}
                  css={css`
                    box-shadow: none;
                  `}
                >
                  <FontAwesomeIcon icon={faAngleLeft} color="#555" />
                </Fab>
                <Button
                  size="small"
                  color="secondary"
                  variant="contained"
                  onClick={handleRemoveMember}
                >
                  Remove member
                </Button>
              </ConfirmAction>
            </div>
          ) : (
            <>
              <Avatar
                css={css`
                  height: 6rem;
                  width: 6rem;
                  font-size: 36px;
                `}
              >
                {member.username.charAt(0)}
              </Avatar>
              <Main>
                <PrimaryText>
                  {member.first_name} {member.last_name}
                </PrimaryText>
                <SecondaryText>
                  username: <b>{member.username}</b>
                </SecondaryText>
                <SecondaryText
                  css={css`
                    margin-bottom: 1.5rem;
                  `}
                >
                  email: <b>{member.email}</b>
                </SecondaryText>
                {member.id === board.owner.id ? (
                  <Alert severity="info">Owner of this board</Alert>
                ) : (
                  <Button
                    size="small"
                    css={css`
                      color: #333;
                    `}
                    variant="outlined"
                    onClick={() => setConfirmDelete(true)}
                  >
                    Remove from board
                  </Button>
                )}
              </Main>
            </>
          )}
        </Container>
      </Dialog>
    </>
  );
};

export default MemberDetail;
