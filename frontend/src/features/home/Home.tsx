import React from "react";
import { Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import styled from "@emotion/styled";
import { ReactComponent as Hero } from "static/svg/thoughts.svg";
import { css } from "@emotion/core";
import SEO from "components/SEO";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const HeroContainer = styled.div``;

const Home = () => {
  return (
    <Container>
      <SEO title="Home" />
      <HeroContainer>
        <Hero width={260} height={260} />
      </HeroContainer>

      <Link
        css={css`
          text-decoration: none;
          color: #333;
        `}
        to="/boards/"
      >
        <Button
          color="primary"
          variant="contained"
          style={{ textTransform: "none" }}
        >
          View Boards
        </Button>
      </Link>
    </Container>
  );
};

export default Home;
