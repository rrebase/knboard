import React from "react";
import { Switch, Route } from "react-router-dom";

import Board from "features/board";
import BoardList from "features/board/BoardList";
import Navbar from "components/Navbar";
import Home from "features/home/Home";
import BoardBar from "features/board/BoardBar";
import Profile from "features/profile/Profile";
import Sidebar from "features/sidebar/Sidebar";
import PageError from "components/PageError";
import { sidebarWidth } from "const";
import styled from "@emotion/styled";

const Main = styled.div`
  margin-left: ${sidebarWidth + 8}px;
`;

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <>
    <Sidebar />
    <Main>
      <Navbar />
      {children}
    </Main>
  </>
);

const AuthenticatedApp = () => {
  return (
    <Switch>
      <Route exact path="/profile">
        <Wrapper>
          <Profile />
        </Wrapper>
      </Route>
      <Route exact path="/boards">
        <Wrapper>
          <BoardList />
        </Wrapper>
      </Route>
      <Route exact path="/b/:id">
        <Wrapper>
          <BoardBar />
          <Board />
        </Wrapper>
      </Route>

      <Route exact path="/">
        <Wrapper>
          <Home />
        </Wrapper>
      </Route>
      <Route path="*">
        <PageError>Page not found.</PageError>
      </Route>
    </Switch>
  );
};

export default AuthenticatedApp;
