import React from "react";
import styled from "@emotion/styled";
import { RootState } from "store";
import { useSelector } from "react-redux";
import { barHeight } from "const";
import { AvatarGroup } from "@material-ui/lab";
import { Avatar, Tooltip } from "@material-ui/core";
import { css } from "@emotion/core";
import { avatarStyles } from "styles";
import MemberInvite from "components/MemberInvite";

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
        `}
      >
        {detail.members.map(member => {
          const title =
            member.id === detail.owner.id
              ? `${member.username} (owner)`
              : member.username;
          return (
            <Tooltip key={member.id} title={title} aria-label={title}>
              <Avatar css={avatarStyles}>{member.username.charAt(0)}</Avatar>
            </Tooltip>
          );
        })}
      </AvatarGroup>
      <MemberInvite />
    </Container>
  );
};

export default BoardBar;
