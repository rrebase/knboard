import React from "react";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "@emotion/styled";
import { iconBoxStyles } from "styles";

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
  background: #f5f6f7;
`;

const EditButton = ({ handleClick }: Props) => (
  <Wrapper>
    <InnerWrapper>
      <IconBox css={iconBoxStyles} onClick={handleClick}>
        <FontAwesomeIcon icon={faPen} color="#999" />
      </IconBox>
    </InnerWrapper>
  </Wrapper>
);

export default EditButton;
