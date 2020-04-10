import React from "react";
import { Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import styled from "@emotion/styled";
import { ReactComponent as Thoughts } from "static/svg/thoughts.svg";
import { css } from "@emotion/core";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Home = () => {
  return (
    <Container>
      <div>
        <Thoughts width={300} height={300} />
      </div>
      <Button
        color="primary"
        variant="outlined"
        style={{ textTransform: "none" }}
      >
        <Link
          css={css`
            text-decoration: none;
            color: #333;
          `}
          to="/boards/"
        >
          View Boards
        </Link>
      </Button>
    </Container>
  );
};

export default Home;
