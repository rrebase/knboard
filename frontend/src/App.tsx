import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import React from "react";
import { Provider } from "react-redux";
import store from "./store";
import { ThemeProvider, CssBaseline } from "@material-ui/core";
import { theme } from "./const";
import Board from "features/board";
import { ApolloProvider } from "react-apollo";

const httpLink = createHttpLink({
  uri: "http://localhost:8000/graphql"
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: httpLink
});

const App = () => {
  return (
    <ApolloProvider client={client}>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Board />
        </ThemeProvider>
      </Provider>
    </ApolloProvider>
  );
};

export default App;
