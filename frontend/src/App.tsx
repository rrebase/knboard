import React from "react";
import { Provider } from "react-redux";
import store from "./store";
import { ThemeProvider, CssBaseline } from "@material-ui/core";
import { theme } from "./const";
import Board from "features/board";
import { authorQuoteMap } from "data";

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Board initial={authorQuoteMap} />
      </ThemeProvider>
    </Provider>
  );
};

export default App;
