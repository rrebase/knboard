import React from "react";
import styled from "@emotion/styled";
import { IconButton } from "@material-ui/core";
import { css } from "@emotion/core";
import { ReactComponent as TimesIcon } from "static/svg/times.svg";
import { TASK_G } from "utils/colors";

const Container = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
`;

interface Props {
  onClose: () => void;
}

const Close = ({ onClose }: Props) => {
  return (
    <Container>
      <IconButton
        size="small"
        onClick={onClose}
        aria-label="close"
        data-testid="close-dialog"
        css={css`
          height: 2.5rem;
          width: 2.5rem;
          color: ${TASK_G};
          padding: 0.75rem;
        `}
      >
        <TimesIcon />
      </IconButton>
    </Container>
  );
};

export default Close;
