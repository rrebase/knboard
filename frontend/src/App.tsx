import React from "react";
import { Provider } from "react-redux";
import { ThemeProvider, CssBaseline } from "@material-ui/core";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { SnackbarProvider } from "notistack";

import Board from "features/board";
import BoardList from "features/board/BoardList";
import Navbar from "components/Navbar";
import { theme } from "./const";
import store from "./store";

const Home = () => {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/boards">Boards</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <SnackbarProvider maxSnack={3}>
            <CssBaseline />
            <Navbar />
            <Switch>
              <Route path="/boards">
                <BoardList />
              </Route>
              <Route path="/b/:id">
                <Board />
              </Route>
              <Route path="/">
                <Home />
              </Route>
            </Switch>
          </SnackbarProvider>
        </ThemeProvider>
      </Provider>
    </Router>
  );
};

export default App;
