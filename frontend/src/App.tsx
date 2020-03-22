import React, { Suspense } from "react";
import { Provider } from "react-redux";
import { ThemeProvider, CssBaseline } from "@material-ui/core";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import FullPageSpinner from "components/FullPageSpinner";
import Toast from "features/toast/Toast";
import Board from "features/board";
import BoardList from "features/board/BoardList";
import Navbar from "components/Navbar";
import Home from "features/home/Home";
import BoardBar from "features/board/BoardBar";
import Login from "features/auth/Login";

import { theme } from "./const";
import store from "./store";

const UnauthenticatedApp = () => {
  return <Login />;
};

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

const App = () => {
  const user = 1;

  return (
    <Provider store={store}>
      <Router>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Suspense fallback={<FullPageSpinner />}>
            {user ? <AuthenticatedApp /> : <UnauthenticatedApp />}
          </Suspense>
          <Toast />
        </ThemeProvider>
      </Router>
    </Provider>
  );
};

export default App;
