import { css } from "@emotion/core";
import {
  TextareaAutosize,
  TextareaAutosizeProps,
  useTheme,
} from "@material-ui/core";
import { commentBoxWidth, commentBoxWidthMobile } from "const";
import React from "react";
import { N800 } from "utils/colors";

const CommentTextarea = (props: TextareaAutosizeProps) => {
  const theme = useTheme();

  return (
    <TextareaAutosize
      aria-label="comment"
      placeholder="Add a comment..."
      rowsMin={4}
      css={css`
        line-height: 1.25rem;
        font-size: 0.875rem;
        color: ${N800};
        width: ${commentBoxWidth}px;
        border: 1px solid #bcbcbc;
        border-radius: 4px;
        padding: 12px 16px 0;
        resize: none;
        margin-bottom: 8px;
        ${theme.breakpoints.down("sm")} {
          width: ${commentBoxWidthMobile}px !important;
        }
        &:focus {
          outline: none;
          border: 1px solid #999;
        }
      `}
      {...props}
    />
  );
};

export default CommentTextarea;
