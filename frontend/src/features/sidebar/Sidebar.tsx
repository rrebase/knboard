import React from "react";
import { Drawer, List } from "@material-ui/core";
import { css } from "@emotion/core";
import { sidebarWidth } from "const";
import styled from "@emotion/styled";
import { ReactComponent as Logo } from "static/svg/logo.svg";
import { NavLink, useHistory } from "react-router-dom";

const Container = styled.div`
  height: 100%;
  background-color: #666eee;
`;

const TopArea = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
`;

const linkStyles = css`
  display: block;
  color: #8e97d8;
  font-weight: bold;
  padding: 6px 20px;
  text-decoration: none;
  &:hover {
    color: #fff;
    cursor: pointer;
  }
  &.active {
    color: #fff;
  }
`;

const Sidebar = () => {
  const history = useHistory();

  return (
    <Drawer anchor="left" variant="permanent">
      <Container>
        <TopArea>
          <Logo
            css={css`
              &:hover {
                cursor: pointer;
              }
            `}
            onClick={() => history.push("/")}
          />
        </TopArea>
        <List
          css={css`
            width: ${sidebarWidth}px;
            margin-top: 40px;
          `}
        >
          <NavLink to="/" exact css={linkStyles}>
            Home
          </NavLink>
          <NavLink to="/boards/" exact css={linkStyles}>
            Boards
          </NavLink>
          <NavLink to="/profile/" exact css={linkStyles}>
            Profile
          </NavLink>
        </List>
      </Container>
    </Drawer>
  );
};

export default Sidebar;
