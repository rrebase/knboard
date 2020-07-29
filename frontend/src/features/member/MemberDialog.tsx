import React, { useState } from "react";
import {
  Dialog,
  Avatar,
  Button,
  Fab,
  useMediaQuery,
  useTheme,
  DialogTitle,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { BoardMember, Board, WithTheme } from "types";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import api, { API_BOARDS } from "api";
import {
  createSuccessToast,
  createErrorToast,
} from "features/toast/ToastSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  removeBoardMember,
  setDialogMember,
  selectMembersEntities,
} from "features/member/MemberSlice";
import { RootState } from "store";
import { currentBoardOwner } from "features/board/BoardSlice";
import Close from "components/Close";

const Container = styled.div<WithTheme>`
  display: flex;
  align-items: center;
  padding: 0.5rem 2rem 2rem 2rem;
  ${(props) => props.theme.breakpoints.down("xs")} {
    flex-direction: column;
  }
`;

const PrimaryText = styled.h3`
  margin-top: 0;
  word-break: break-all;
`;

const Main = styled.div`
  margin-left: 2rem;
  font-size: 16px;
`;

const SecondaryText = styled.p`
  margin: 0;
  font-size: 14px;
  color: #777;
  word-break: break-all;
`;

const ConfirmAction = styled.div`
  display: flex;
  justify-content: space-between;
`;

interface Props {
  board: Board;
}

const MemberDialog = ({ board }: Props) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const memberId = useSelector((state: RootState) => state.member.dialogMember);
  const members = useSelector(selectMembersEntities);
  const boardOwner = useSelector((state: RootState) =>
    currentBoardOwner(state)
  );
  const xsDown = useMediaQuery(theme.breakpoints.down("xs"));
  const [confirmDelete, setConfirmDelete] = useState(false);
  const member = memberId === null ? null : members[memberId];
  const memberIsOwner = member?.id === board.owner;
  const open = member !== null;

  if (!member) {
    return null;
  }

  const handleClose = () => {
    dispatch(setDialogMember(null));
    setConfirmDelete(false);
  };

  const handleRemoveMember = async () => {
    try {
      const response = await api.post(
        `${API_BOARDS}${board.id}/remove_member/`,
        { username: member.username }
      );
      const removedMember = response.data as BoardMember;
      dispatch(removeBoardMember(removedMember.id));
      dispatch(createSuccessToast(`Removed ${removedMember.username}`));
      handleClose();
    } catch (err) {
      dispatch(createErrorToast(err.toString()));
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      fullScreen={xsDown}
    >
      <Close onClose={handleClose} />
      <DialogTitle id="member-detail">Member</DialogTitle>
      <Container theme={theme}>
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
                  &.MuiFab-sizeSmall {
                    width: 32px;
                    height: 32px;
                  }
                `}
              >
                <FontAwesomeIcon icon={faAngleLeft} color="#555" />
              </Fab>
              <Button
                size="small"
                color="secondary"
                variant="contained"
                onClick={handleRemoveMember}
                css={css`
                  font-size: 0.625rem;
                `}
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
                margin-bottom: 1rem;
              `}
              src={member?.avatar?.photo}
              alt={member?.avatar?.name}
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
                email: <b>{member?.email || "-"}</b>
              </SecondaryText>
              {memberIsOwner && (
                <Alert severity="info">Owner of this board</Alert>
              )}
              {boardOwner && !memberIsOwner && (
                <Button
                  size="small"
                  css={css`
                    color: #333;
                    font-size: 0.625rem;
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
  );
};

export default MemberDialog;
