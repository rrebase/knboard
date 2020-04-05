import React from "react";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "@emotion/styled";
import { iconBoxStyles } from "styles";

interface Props {
  taskId: number;
  handleClick: () => void;
}

const Wrapper = styled.div`
  position: relative;
`;

const InnerWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;

const IconBox = styled.div`
  background: #f5f6f7;
`;

const EditButton = ({ handleClick, taskId }: Props) => (
  <Wrapper>
    <InnerWrapper>
      <IconBox
        css={iconBoxStyles}
        onClick={handleClick}
        data-testid={`edit-task-${taskId}`}
      >
        <FontAwesomeIcon icon={faPen} color="#999" />
      </IconBox>
    </InnerWrapper>
  </Wrapper>
);

export default EditButton;
