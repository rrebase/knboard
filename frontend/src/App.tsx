import React from "react";
import { Provider } from "react-redux";
import store from "./store";
import { ThemeProvider, CssBaseline } from "@material-ui/core";
import { theme } from "./const";
import Board from "features/board";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import BoardList from "features/board/BoardList";
import Navbar from "components/Navbar";

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
        </ThemeProvider>
      </Provider>
    </Router>
  );
};

export default App;
