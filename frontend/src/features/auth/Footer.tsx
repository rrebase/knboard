import React from "react";
import styled from "@emotion/styled";
import { Popover, Button, Link } from "@material-ui/core";
import { css } from "@emotion/core";
import { Alert, AlertTitle } from "@material-ui/lab";

const Container = styled.div`
  position: absolute;
  padding-bottom: 1rem;
  width: 100%;
  bottom: 0;
`;

const List = styled.div`
  display: flex;
  justify-content: center;
`;

const Item = styled.div`
  padding: 0 0.5rem;
  display: flex;
  align-items: center;
`;

const Footer = () => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "about-popover" : undefined;

  return (
    <Container>
      <List>
        <Item>
          <Button
            aria-describedby={id}
            onClick={handleClick}
            css={css`
              padding: 0;
              text-transform: initial;
              color: #888;
              font-weight: 400;
              &:hover {
                background-color: initial;
              }
            `}
          >
            About
          </Button>
        </Item>
      </List>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Alert
          severity="info"
          css={css`
            padding: 1rem 1rem 2rem 1rem;
            max-width: 400px;
          `}
        >
          <AlertTitle>About</AlertTitle>
          <p>
            <b>Knboard</b> is an app that helps visualize your work using kanban
            boards, maximizing efficiency.
          </p>
          It is an <b>open-source</b> project built using Django & React,
          available on{" "}
          <Link
            href="https://github.com/rrebase/knboard"
            target="_blank"
            rel="noopener"
          >
            GitHub
          </Link>
          .
        </Alert>
      </Popover>
    </Container>
  );
};

export default Footer;
