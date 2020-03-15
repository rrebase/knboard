import React from "react";
import styled from "@emotion/styled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faTh } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { css } from "@emotion/core";
import { barHeight } from "const";

const Container = styled.div`
  min-height: ${barHeight}px;
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

const Icons = styled.div`
  font-size: 1.25rem;
  a {
    color: #333;
  }
`;

const Navbar = () => {
  return (
    <Container>
      <Item>
        <Icons>
          <Link
            to="/"
            css={css`
              margin-right: 0.75rem;
            `}
          >
            <FontAwesomeIcon icon={faHome} />
          </Link>
          <Link to="/boards/">
            <FontAwesomeIcon icon={faTh} />
          </Link>
        </Icons>
      </Item>
      <Item>Knboard</Item>
      <Item>Me</Item>
    </Container>
  );
};

export default Navbar;
