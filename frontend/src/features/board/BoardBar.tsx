import React from "react";
import styled from "@emotion/styled";
import { RootState } from "store";
import { useSelector, useDispatch } from "react-redux";
import { barHeight } from "const";
import { AvatarGroup } from "@material-ui/lab";
import { css } from "@emotion/core";
import { avatarStyles } from "styles";
import BoardName from "components/BoardName";
import MemberInvite from "features/member/MemberInvite";
import MemberDetail from "features/member/MemberDetail";
import MemberDialog from "features/member/MemberDialog";
import { currentBoardOwner } from "./BoardSlice";
import CreateTaskDialog from "features/task/CreateTaskDialog";
import EditTaskDialog from "features/task/EditTaskDialog";
import { Button } from "@material-ui/core";
import { PRIMARY } from "utils/colors";
import { addColumn } from "features/column/ColumnSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPen } from "@fortawesome/free-solid-svg-icons";
import { setDialogOpen } from "features/label/LabelSlice";
import LabelDialog from "features/label/LabelDialog";
import { useParams } from "react-router-dom";
import {
  selectAllMembers,
  setMemberListOpen,
} from "features/member/MemberSlice";
import MemberListDialog from "features/member/MemberList";
import MemberFilter from "features/member/MemberFilter";

const Container = styled.div`
  height: ${barHeight}px;
  display: flex;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
  font-weight: bold;
  font-size: 1.25rem;
`;

const Items = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow-x: scroll;
`;

const Left = styled.div`
  white-space: nowrap;
  display: flex;
  margin-right: 1rem;
`;

const Right = styled.div`
  white-space: nowrap;
`;

const buttonStyles = css`
  color: ${PRIMARY};
  .MuiButton-iconSizeSmall > *:first-of-type {
    font-size: 12px;
  }
`;

const BoardBar = () => {
  const dispatch = useDispatch();
  const members = useSelector(selectAllMembers);
  const error = useSelector((state: RootState) => state.board.detailError);
  const detail = useSelector((state: RootState) => state.board.detail);
  const boardOwner = useSelector(currentBoardOwner);
  const { id } = useParams();
  const detailDataExists = detail?.id.toString() === id;

  if (!detailDataExists || error || !detail) {
    return null;
  }

  const handleAddColumn = () => {
    dispatch(addColumn(detail.id));
  };

  const handleEditLabels = () => {
    dispatch(setDialogOpen(true));
  };

  return (
    <Container data-testid="board">
      <Items>
        <Left>
          <BoardName
            id={detail.id}
            name={detail.name}
            isOwner={boardOwner}
            data-testid="board-name"
          />
          <AvatarGroup
            max={3}
            data-testid="member-group"
            css={css`
              margin-left: 1.5rem;
              & .MuiAvatarGroup-avatar {
                ${avatarStyles}
                border: none;
              }
              &:hover {
                cursor: pointer;
              }
            `}
            onClick={(e: any) => {
              if (e.target.classList.contains("MuiAvatarGroup-avatar")) {
                dispatch(setMemberListOpen(true));
              }
            }}
          >
            {members.map((member) => (
              <MemberDetail
                key={member.id}
                member={member}
                isOwner={detail.owner === member.id}
              />
            ))}
          </AvatarGroup>
          {boardOwner && <MemberInvite boardId={detail.id} />}
          <MemberFilter boardId={detail.id} />
        </Left>
        <Right>
          <Button
            size="small"
            css={css`
              ${buttonStyles}
              margin-right: 0.5rem;
              font-weight: 600;
            `}
            onClick={handleEditLabels}
            startIcon={<FontAwesomeIcon icon={faPen} />}
            data-testid="open-labels-dialog"
          >
            Edit labels
          </Button>
          <Button
            size="small"
            css={css`
              ${buttonStyles}
              font-weight: 600;
            `}
            onClick={handleAddColumn}
            startIcon={<FontAwesomeIcon icon={faPlus} />}
            data-testid="add-col"
          >
            Add Column
          </Button>
        </Right>
      </Items>
      <MemberDialog board={detail} />
      <MemberListDialog />
      <EditTaskDialog />
      <CreateTaskDialog />
      <LabelDialog />
    </Container>
  );
};

export default BoardBar;
