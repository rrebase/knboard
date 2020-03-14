import React from "react";
import styled from "@emotion/styled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";

const Container = styled.div`
  min-height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  border-bottom: 1px solid #999;
`;

const Item = styled.div`
  font-size: 1rem;
  color: #333;
`;

const Navbar = () => {
  return (
    <Container>
      <Item>
        <FontAwesomeIcon icon={faHome} />
      </Item>
      <Item>Knboard</Item>
      <Item>Me</Item>
    </Container>
  );
};

export default Navbar;
