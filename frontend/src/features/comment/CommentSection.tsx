import { css } from "@emotion/core";
import styled from "@emotion/styled";
import { faComments } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button, CircularProgress } from "@material-ui/core";
import MemberAvatar from "components/MemberAvatar";
import { selectMe } from "features/auth/AuthSlice";
import CommentTextarea from "features/comment/CommentTextarea";
import { selectMembersEntities } from "features/member/MemberSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CommentItem from "./CommentItem";
import {
  createComment,
  fetchComments,
  selectAllComments,
  selectCreateCommentStatus,
  selectFetchCommentsStatus,
} from "./CommentSlice";

interface Props {
  taskId: number;
}

const CommentSection = ({ taskId }: Props) => {
  const dispatch = useDispatch();
  const user = useSelector(selectMe);
  const comments = useSelector(selectAllComments);
  const memberEntities = useSelector(selectMembersEntities);
  const fetchStatus = useSelector(selectFetchCommentsStatus);
  const createStatus = useSelector(selectCreateCommentStatus);
  const [text, setText] = useState("");

  useEffect(() => {
    dispatch(fetchComments(taskId));
  }, [dispatch, taskId]);

  const postComment = () => {
    setText("");
    dispatch(createComment({ text, task: taskId }));
  };

  const currentTaskComments = comments.filter(
    (comment) => comment.task === taskId
  );

  return (
    <>
      <Header>
        <FontAwesomeIcon icon={faComments} />
        <Title>Discussion</Title>
      </Header>

      <Box display="flex" mb={4}>
        <MemberAvatar member={memberEntities[user?.id ?? -1]} />
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="flex-start"
          marginLeft={2}
          marginRight={2}
        >
          <CommentTextarea
            onChange={(e) => setText(e.target.value)}
            value={text}
          />
          <Box>
            <Button
              color="primary"
              variant="contained"
              size="small"
              startIcon={
                createStatus === "loading" ? (
                  <CircularProgress color="inherit" size={16} />
                ) : undefined
              }
              disabled={!text.length || createStatus === "loading"}
              css={css`
                text-transform: none;
              `}
              onClick={postComment}
            >
              Post comment
            </Button>
          </Box>
        </Box>
      </Box>

      {!currentTaskComments.length && fetchStatus === "loading" && (
        <CircularProgress />
      )}
      {currentTaskComments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </>
  );
};

const Header = styled.div`
  display: flex;
  align-items: center;
  margin: 20px 0;
`;

const Title = styled.h3`
  margin: 0 0 0 12px;
`;

export default CommentSection;
