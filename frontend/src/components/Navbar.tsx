import React from "react";
import styled from "@emotion/styled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { barHeight } from "const";
import UserMenu from "./UserMenu";
import { faRocket, faBars } from "@fortawesome/free-solid-svg-icons";
import { setMobileDrawerOpen } from "features/responsive/ResponsiveSlice";
import { useDispatch } from "react-redux";
import { Hidden } from "@material-ui/core";

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
  const dispatch = useDispatch();

  return (
    <Container>
      <Item>
        <Icons>
          <Hidden smUp implementation="css">
            <FontAwesomeIcon
              icon={faBars}
              onClick={() => dispatch(setMobileDrawerOpen(true))}
            />
          </Hidden>
          <Hidden xsDown implementation="css">
            <FontAwesomeIcon icon={faRocket} />
          </Hidden>
        </Icons>
      </Item>
      <Item>Knboard</Item>
      <Item>
        <UserMenu />
      </Item>
    </Container>
  );
};

export default Navbar;
