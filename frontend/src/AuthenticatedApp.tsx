import React from "react";
import { Switch, Route, RouteProps } from "react-router-dom";
import styled from "@emotion/styled";

import Board from "features/board";
import BoardList from "features/board/BoardList";
import Navbar from "components/Navbar";
import Home from "features/home/Home";
import BoardBar from "features/board/BoardBar";
import Profile from "features/profile/Profile";
import Sidebar from "features/sidebar/Sidebar";
import PageError from "components/PageError";
import { sidebarWidth } from "const";

const Main = styled.div`
  margin-left: ${sidebarWidth + 8}px;
`;

const Wrapper: React.FC = ({ children }) => (
  <>
    <Sidebar />
    <Main>
      <Navbar />
      {children}
    </Main>
  </>
);

const AppRoute = (props: RouteProps) => (
  <Route {...props}>
    <Wrapper>{props.children}</Wrapper>
  </Route>
);

const AuthenticatedApp = () => {
  return (
    <Switch>
      <AppRoute exact path="/profile">
        <Profile />
      </AppRoute>
      <AppRoute exact path="/boards">
        <BoardList />
      </AppRoute>
      <AppRoute exact path="/b/:id">
        <BoardBar />
        <Board />
      </AppRoute>

      <AppRoute exact path="/">
        <Home />
      </AppRoute>
      <Route path="*">
        <PageError>Page not found.</PageError>
      </Route>
    </Switch>
  );
};

export default AuthenticatedApp;
