import React from "react";
import styled from "@emotion/styled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { Container, Grid } from "@material-ui/core";

const BoardsSection = styled.div`
  margin-top: 2rem;
`;

const Title = styled.div`
  font-size: 20px;
  margin-bottom: 1rem;
`;

const TitleText = styled.span`
  margin-left: 1rem;
  font-size: 18px;
`;

const Cards = styled.a`
  display: flex;
`;

const BoardCard = styled.a`
  display: block;
  background-color: #42afaf;
  color: #fff;
  height: 100px;
  border-radius: 6px;
  padding: 0.5rem;
`;

const BoardList = () => {
  return (
    <Container maxWidth="sm">
      <BoardsSection>
        <Title>
          <FontAwesomeIcon icon={faUser} />
          <TitleText>My boards</TitleText>
        </Title>
        <Cards>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <BoardCard>board1</BoardCard>
            </Grid>
          </Grid>
        </Cards>
      </BoardsSection>
    </Container>
  );
};

export default BoardList;
