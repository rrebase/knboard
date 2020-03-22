import React from "react";
import styled from "@emotion/styled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faTh } from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";
import { css } from "@emotion/core";
import { barHeight } from "const";
import { useSelector } from "react-redux";
import { RootState } from "store";

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
    color: #888;
    &:hover {
      color: #333;
    }
  }
  .active {
    color: #333;
  }
`;

const Navbar = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <Container>
      <Item>
        <Icons>
          <NavLink
            to="/"
            exact
            css={css`
              margin-right: 0.75rem;
            `}
          >
            <FontAwesomeIcon icon={faHome} />
          </NavLink>
          <NavLink exact to="/boards/">
            <FontAwesomeIcon icon={faTh} />
          </NavLink>
        </Icons>
      </Item>
      <Item>Knboard</Item>
      <Item>{user?.username}</Item>
    </Container>
  );
};

export default Navbar;
