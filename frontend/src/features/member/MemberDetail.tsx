import React from "react";
import { Avatar } from "@material-ui/core";
import { BoardMember } from "types";
import { avatarStyles } from "styles";
import { css } from "@emotion/core";
import { useDispatch } from "react-redux";
import { setDialogMember } from "features/member/MemberSlice";

interface Props {
  member: BoardMember;
}

const MemberDetail = ({ member }: Props) => {
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(setDialogMember(member.id));
  };

  return (
    <Avatar
      css={css`
        ${avatarStyles} &:hover {
          cursor: pointer;
        }
      `}
      onClick={handleClick}
      data-testid={`member-${member.id}`}
      src={member?.avatar?.photo}
      alt={member?.avatar?.name}
    >
      {member.username.charAt(0)}
    </Avatar>
  );
};

export default MemberDetail;
