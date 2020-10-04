import React from "react";
import styled from "@emotion/styled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Container, Grid, Tooltip } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllBoards, setCreateDialogOpen } from "./BoardSlice";
import { RootState } from "store";
import { css, SerializedStyles, keyframes } from "@emotion/core";
import { Link } from "react-router-dom";
import NewBoardDialog from "./NewBoardDialog";
import Spinner from "components/Spinner";
import SEO from "components/SEO";
import { boardCardBaseStyles } from "styles";
import { faUserAlt, faTh } from "@fortawesome/free-solid-svg-icons";
import { OWNER_COLOR } from "utils/colors";

const BoardsSection = styled.div`
  margin-top: 2rem;
`;

const Title = styled.div`
  font-size: 20px;
  margin-bottom: 1rem;
  color: #333;
`;

const TitleText = styled.span`
  margin-left: 0.75rem;
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
  background-color: ${OWNER_COLOR};
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

const scaleUp = keyframes`
    0% {
        transform: scale(1.0);
    }
    100% {
        transform: scale(1.05);
    }
`;

const animationStyles = css`
  animation: 0.2s ${scaleUp} forwards;
`;

const Card = ({ cardCss, to, isOwner, children }: CardProps) => {
  const [hover, setHover] = React.useState(false);

  return (
    <Grid
      item
      xs={6}
      sm={4}
      key="new-board"
      css={css`
        position: relative;
        ${hover && animationStyles}
      `}
    >
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

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === "b" && e.metaKey) {
        dispatch(setCreateDialogOpen(true));
      }
    };

    document.addEventListener("keydown", (e) => handleKeydown(e));
    return () => document.removeEventListener("keydown", handleKeydown);
  }, []);

  if (loading && boards.length === 0) {
    return <Spinner loading={loading} />;
  }

  return (
    <Container maxWidth="sm">
      <SEO title="Boards" />
      <BoardsSection>
        <Title>
          <FontAwesomeIcon icon={faTh} />
          <TitleText>All Boards</TitleText>
        </Title>
        <Cards>
          <Grid container spacing={2}>
            {boards.map((board) => {
              return (
                <Card
                  key={board.id}
                  cardCss={boardCardStyles}
                  to={`/b/${board.id}`}
                  isOwner={board.owner === userId}
                >
                  {board.name}
                </Card>
              );
            })}
            <Grid item xs={6} sm={4} key="new-board">
              <NewBoardDialog />
            </Grid>
          </Grid>
        </Cards>
      </BoardsSection>
    </Container>
  );
};

export default BoardList;
