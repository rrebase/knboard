import React from "react";
import styled from "@emotion/styled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { Container, Grid } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { fetchBoards } from "./BoardSlice";
import { RootState } from "store";
import { css, SerializedStyles } from "@emotion/core";
import { Link } from "react-router-dom";

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

const Cards = styled.div``;

const Fade = styled.div`
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
`;

const boardCardBaseStyles = css`
  position: relative;
  display: block;
  height: 100px;
  border-radius: 6px;
  padding: 0.5rem;
  text-decoration: none;
  &:hover {
    cursor: pointer;
  }
`;

const boardCardStyles = css`
  ${boardCardBaseStyles}
  background-color: #42afaf;
  color: #fff;
`;

const newCardStyles = css`
  ${boardCardBaseStyles}
  background-color: #e0e2e5;
  color: #333;

  display: flex;
  align-items: center;
  justify-content: center;
`;

interface CardProps {
  cardCss: SerializedStyles;
  to: string;
  children: React.ReactNode;
}

const Card = ({ cardCss, to, children }: CardProps) => {
  const [hover, setHover] = React.useState(false);

  return (
    <Grid
      item
      xs={4}
      key="new-board"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ position: "relative" }}
    >
      <Link css={cardCss} to={to}>
        {hover && <Fade data-testid="fade" />}
        {children}
      </Link>
    </Grid>
  );
};

const BoardList = () => {
  const dispatch = useDispatch();
  const boards = useSelector((state: RootState) => state.board.entities);

  React.useEffect(() => {
    dispatch(fetchBoards());
  }, []);

  return (
    <Container maxWidth="sm">
      <BoardsSection>
        <Title>
          <FontAwesomeIcon icon={faUser} />
          <TitleText>My boards</TitleText>
        </Title>
        <Cards>
          <Grid container spacing={2}>
            {boards.map(board => (
              <Card
                key={board.id}
                cardCss={boardCardStyles}
                to={`/b/${board.id}`}
              >
                {board.name}
              </Card>
            ))}
            <Card key="new-board" cardCss={newCardStyles} to="#">
              Create new board
            </Card>
          </Grid>
        </Cards>
      </BoardsSection>
    </Container>
  );
};

export default BoardList;
