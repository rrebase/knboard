import React from "react";
import styled from "@emotion/styled";
import { RootState } from "store";
import { useSelector, useDispatch } from "react-redux";
import { barHeight } from "const";
import { AvatarGroup } from "@material-ui/lab";
import { css } from "@emotion/core";
import { avatarStyles } from "styles";
import MemberInvite from "features/member/MemberInvite";
import MemberDetail from "features/member/MemberDetail";
import { memberSelectors } from "features/member/MemberSlice";
import MemberDialog from "features/member/MemberDialog";
import { currentBoardOwner } from "./BoardSlice";
import CreateTaskDialog from "features/task/CreateTaskDialog";
import EditTaskDialog from "features/task/EditTaskDialog";
import { Button } from "@material-ui/core";
import { PRIMARY } from "utils/colors";
import { addColumn } from "features/column/ColumnSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faCog } from "@fortawesome/free-solid-svg-icons";
import Experiment from "features/task/Experiment2";
import { setDialogOpen } from "features/label/LabelSlice";
import LabelsDialog from "features/label/LabelsDialog";

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
`;

const Left = styled.div`
  display: flex;
`;

const Right = styled.div``;

const Name = styled.div`
  color: #6869f6;
`;

const BoardBar = () => {
  const dispatch = useDispatch();
  const members = useSelector(memberSelectors.selectAll);
  const error = useSelector((state: RootState) => state.board.detailError);
  const loading = useSelector((state: RootState) => state.board.detailLoading);
  const detail = useSelector((state: RootState) => state.board.detail);
  const boardOwner = useSelector((state: RootState) =>
    currentBoardOwner(state)
  );

  if (loading || error || !detail) {
    return null;
  }

  const handleAddColumn = () => {
    dispatch(addColumn(detail.id));
  };

  const handleEditLabels = () => {
    dispatch(setDialogOpen(true));
  };

  return (
    <Container>
      <Items>
        <Left>
          <Name>{detail.name}</Name>
          <AvatarGroup
            max={3}
            data-testid="member-group"
            css={css`
              margin-left: 1.5rem;
              & .MuiAvatarGroup-avatar {
                ${avatarStyles}
                border: none;
              }
            `}
          >
            {members.map(member => (
              <MemberDetail key={member.id} member={member} />
            ))}
          </AvatarGroup>
          {boardOwner && <MemberInvite boardId={detail.id} />}
        </Left>
        <Right>
          <Button
            size="small"
            css={css`
              color: ${PRIMARY};
              .MuiButton-iconSizeSmall > *:first-of-type {
                font-size: 12px;
              }
              margin-right: 0.5rem;
            `}
            onClick={handleEditLabels}
            startIcon={<FontAwesomeIcon icon={faCog} />}
            data-testid="open-labels-dialog"
          >
            Edit labels
          </Button>
          <Button
            size="small"
            css={css`
              color: ${PRIMARY};
              .MuiButton-iconSizeSmall > *:first-of-type {
                font-size: 12px;
              }
            `}
            onClick={handleAddColumn}
            startIcon={<FontAwesomeIcon icon={faPlus} />}
            data-testid="add-col"
          >
            Add List
          </Button>
        </Right>
      </Items>
      <MemberDialog board={detail} />
      <EditTaskDialog />
      <CreateTaskDialog />
      <LabelsDialog />
      <Experiment />
    </Container>
  );
};

export default BoardBar;
