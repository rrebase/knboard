import React from "react";
import styled from "@emotion/styled";
import { RootState } from "store";
import { useSelector } from "react-redux";
import { barHeight } from "const";
import { AvatarGroup } from "@material-ui/lab";
import { css } from "@emotion/core";
import { avatarStyles } from "styles";
import MemberInvite from "components/MemberInvite";
import MemberDetail from "components/MemberDetail";
import { memberSelectors } from "features/member/MemberSlice";

const Container = styled.div`
  height: ${barHeight}px;
  display: flex;
  align-items: center;
  margin-left: 0.5rem;
  font-weight: bold;
  font-size: 1.25rem;
`;

const Name = styled.div`
  color: #6869f6;
`;

const BoardBar = () => {
  const members = useSelector((state: RootState) =>
    memberSelectors.selectAll(state)
  );
  const error = useSelector((state: RootState) => state.board.detailError);
  const loading = useSelector((state: RootState) => state.board.detailLoading);
  const detail = useSelector((state: RootState) => state.board.detail);

  if (loading || error || !detail) {
    return null;
  }

  return (
    <Container>
      <Name>{detail.name}</Name>
      <AvatarGroup
        max={3}
        css={css`
          margin-left: 1.5rem;
          & .MuiAvatarGroup-avatar {
            ${avatarStyles}
            border: none;
          }
        `}
      >
        {members.map(member => (
          <MemberDetail key={member.id} board={detail} member={member} />
        ))}
      </AvatarGroup>
      <MemberInvite boardId={detail.id} />
    </Container>
  );
};

export default BoardBar;