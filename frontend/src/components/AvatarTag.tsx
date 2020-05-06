import React from "react";
import { Avatar as UserAvatar } from "types";
import { Chip, Avatar, ChipProps } from "@material-ui/core";

interface Option {
  id: number;
  username: string;
  avatar: UserAvatar | null;
}

interface Props extends ChipProps {
  option: Option;
}

const AvatarTag = ({ option, ...rest }: Props) => {
  return (
    <Chip
      key={option.id}
      avatar={<Avatar alt={option.avatar?.name} src={option.avatar?.photo} />}
      variant="outlined"
      label={option.username}
      size="small"
      {...rest}
    />
  );
};

export default AvatarTag;
