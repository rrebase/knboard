import React from "react";
import { Switch, Route } from "react-router-dom";

import Board from "features/board";
import BoardList from "features/board/BoardList";
import Navbar from "components/Navbar";
import Home from "features/home/Home";
import BoardBar from "features/board/BoardBar";

const AuthenticatedApp = () => {
  return (
    <>
      <Navbar />
      <Switch>
        <Route path="/boards">
          <BoardList />
        </Route>
        <Route path="/b/:id">
          <BoardBar />
          <Board />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </>
  );
};

export default AuthenticatedApp;
