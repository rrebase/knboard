import React from "react";
import { Avatar } from "@material-ui/core";
import { BoardMember } from "types";
import { avatarStyles } from "styles";
import { css, keyframes } from "@emotion/core";
import { useDispatch } from "react-redux";
import { setDialogMember } from "features/member/MemberSlice";
import { OWNER_COLOR } from "utils/colors";

const scaleUp = keyframes`
    0% {
        transform: scale(1.0);
    }
    100% {
        transform: scale(1.15);
    }
`;

const animationStyles = css`
  animation: 0.2s ${scaleUp} forwards;
`;

interface Props {
  member: BoardMember;
  isOwner: boolean;
}

const MemberDetail = ({ member, isOwner }: Props) => {
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(setDialogMember(member.id));
  };

  return (
    <Avatar
      css={css`
        ${avatarStyles}
        ${isOwner &&
        `border: 1px solid ${OWNER_COLOR}; border-radius: 50%;`}
        &:hover {
          ${animationStyles}
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
