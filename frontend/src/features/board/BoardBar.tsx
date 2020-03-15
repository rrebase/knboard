import React from "react";
import styled from "@emotion/styled";
import { RootState } from "store";
import { useSelector } from "react-redux";
import { barHeight } from "const";

const Container = styled.div`
  height: ${barHeight}px;
  display: flex;
  align-items: center;
  margin-left: 0.5rem;
  font-weight: bold;
  font-size: 1.25rem;
`;

const BoardBar = () => {
  const error = useSelector((state: RootState) => state.board.detailError);
  const loading = useSelector((state: RootState) => state.board.detailLoading);
  const detail = useSelector((state: RootState) => state.board.detail);

  if (loading || error || !detail) {
    return null;
  }

  return <Container>{detail.name}</Container>;
};

export default BoardBar;
