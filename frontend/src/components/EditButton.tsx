import React from "react";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "@emotion/styled";

interface Props {
  handleClick: () => void;
}

const Wrapper = styled.div`
  position: relative;
`;

const InnerWrapper = styled.div`
  position: absolute;
  top: 5px;
  right: 5px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;

const IconBox = styled.div`
  cursor: pointer;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  margin: 1px;
  color: rgba(0, 0, 0, 0.5);
  background: #f5f6f7;
  opacity: 0.9;
  &:hover {
    opacity: 1;
    background: rgba(220, 220, 220, 1);
  }
`;

const EditButton = ({ handleClick }: Props) => (
  <Wrapper>
    <InnerWrapper>
      <IconBox onClick={handleClick}>
        <FontAwesomeIcon icon={faPen} color="#999" />
      </IconBox>
    </InnerWrapper>
  </Wrapper>
);

export default EditButton;
