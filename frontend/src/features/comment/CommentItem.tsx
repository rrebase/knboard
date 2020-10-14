import styled from "@emotion/styled";
import { Box } from "@material-ui/core";
import MemberAvatar from "components/MemberAvatar";
import { formatDistanceToNow } from "date-fns";
import { selectMembersEntities } from "features/member/MemberSlice";
import React from "react";
import { useSelector } from "react-redux";
import { TaskComment } from "types";
import { HINT } from "utils/colors";

interface Props {
  comment: TaskComment;
}

const CommentItem = ({ comment }: Props) => {
  const memberEntities = useSelector(selectMembersEntities);
  const author = memberEntities[comment.author];

  if (!author) {
    return null;
  }

  return (
    <Box display="flex" mb={2}>
      <Box marginRight={2} mt={0.25}>
        <MemberAvatar member={author} />
      </Box>
      <Box>
        <Box display="flex">
          <Name>{author.first_name || author.username}</Name>
          <TimeAgo>
            {formatDistanceToNow(new Date(comment.created), {
              addSuffix: true,
            })}
          </TimeAgo>
        </Box>
        <Text>{comment.text}</Text>
      </Box>
    </Box>
  );
};

const Name = styled.div`
  font-size: 0.75rem;
  font-weight: bold;
`;

const Text = styled.p`
  font-size: 0.75rem;
  margin-top: 4px;
`;

const TimeAgo = styled.div`
  font-size: 0.75rem;
  color: ${HINT};
  margin-left: 8px;
`;

export default CommentItem;
