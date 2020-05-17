import React from "react";
import { Avatar as UserAvatar } from "types";
import { Avatar, ChipProps } from "@material-ui/core";
import { css } from "@emotion/core";
import styled from "@emotion/styled";

const Username = styled.span`
  margin-left: 0.5rem;
  word-break: break-all;
`;

interface Option {
  id: number;
  username: string;
  avatar: UserAvatar | null;
}

interface Props extends ChipProps {
  option: Option;
}

const AvatarOption = ({ option }: Props) => {
  return (
    <>
      <Avatar
        css={css`
          height: 1.5rem;
          width: 1.5rem;
        `}
        alt={option.avatar?.name}
        src={option.avatar?.photo}
      />
      <Username>{option.username}</Username>
    </>
  );
};

export default AvatarOption;
