import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { PRIO_COLORS } from "const";
import { Priority } from "types";
import styled from "@emotion/styled";

interface Props {
  option: Priority;
}

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const PrioLabel = styled.div`
  margin-left: 1rem;
`;

const PriorityOption = ({ option }: Props) => {
  return (
    <Container>
      <FontAwesomeIcon
        icon={faArrowUp}
        color={PRIO_COLORS[option.value]}
        data-testid="priority-icon"
      />
      <PrioLabel>{option.label}</PrioLabel>
    </Container>
  );
};

export default PriorityOption;
