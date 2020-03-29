import React from "react";
import { Switch, Route } from "react-router-dom";

import Board from "features/board";
import BoardList from "features/board/BoardList";
import Navbar from "components/Navbar";
import Home from "features/home/Home";
import BoardBar from "features/board/BoardBar";
import Profile from "features/profile/Profile";
import PageError from "components/PageError";

const AuthenticatedApp = () => {
  return (
    <>
      <Navbar />
      <Switch>
        <Route exact path="/profile">
          <Profile />
        </Route>
        <Route exact path="/boards">
          <BoardList />
        </Route>
        <Route exact path="/b/:id">
          <BoardBar />
          <Board />
        </Route>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="*">
          <PageError>Page not found</PageError>
        </Route>
      </Switch>
    </>
  );
};

export default AuthenticatedApp;
