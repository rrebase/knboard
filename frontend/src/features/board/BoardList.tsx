import React from "react";
import styled from "@emotion/styled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { Container, Grid, Tooltip } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllBoards } from "./BoardSlice";
import { RootState } from "store";
import { css, SerializedStyles } from "@emotion/core";
import { Link } from "react-router-dom";
import NewBoardDialog from "./NewBoardDialog";
import Spinner from "components/Spinner";
import { boardCardBaseStyles } from "styles";
import { faUserAlt } from "@fortawesome/free-solid-svg-icons";

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

const OwnerBadge = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 10px;
  background-color: #ffbe47;
  color: #fff;
  padding: 4px 6px;
  border-radius: 6px;
`;

const boardCardStyles = css`
  ${boardCardBaseStyles}
  background-color: #a2abf9;
  color: #fff;
`;

interface CardProps {
  cardCss: SerializedStyles;
  to: string;
  isOwner: boolean;
  children: React.ReactNode;
}

const Card = ({ cardCss, to, isOwner, children }: CardProps) => {
  const [hover, setHover] = React.useState(false);

  return (
    <Grid item xs={4} key="new-board" style={{ position: "relative" }}>
      {isOwner && (
        <Tooltip title="Owner of this board" placement="top" arrow>
          <OwnerBadge>
            <FontAwesomeIcon icon={faUserAlt} />
          </OwnerBadge>
        </Tooltip>
      )}
      <Link
        css={cardCss}
        to={to}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {hover && <Fade data-testid="fade" />}
        {children}
      </Link>
    </Grid>
  );
};

const BoardList = () => {
  const dispatch = useDispatch();
  const loading = useSelector((state: RootState) => state.board.fetchLoading);
  const boards = useSelector((state: RootState) => state.board.all);
  const userId = useSelector((state: RootState) => state.auth.user?.id);

  React.useEffect(() => {
    dispatch(fetchAllBoards());
  }, []);

  if (loading && boards.length === 0) {
    <Spinner loading={loading} />;
  }

  return (
    <Container maxWidth="sm">
      <BoardsSection>
        <Title>
          <FontAwesomeIcon icon={faUser} />
          <TitleText>All Boards</TitleText>
        </Title>
        <Cards>
          <Grid container spacing={2}>
            {boards.map(board => (
              <Card
                key={board.id}
                cardCss={boardCardStyles}
                to={`/b/${board.id}`}
                isOwner={board.owner === userId}
              >
                {board.name}
              </Card>
            ))}
            <Grid item xs={4} key="new-board">
              <NewBoardDialog />
            </Grid>
          </Grid>
        </Cards>
      </BoardsSection>
    </Container>
  );
};

export default BoardList;
