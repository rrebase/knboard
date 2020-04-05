import React, { Suspense } from "react";
import { Provider, useSelector } from "react-redux";
import { ThemeProvider, CssBaseline } from "@material-ui/core";
import { BrowserRouter as Router } from "react-router-dom";

import FullPageSpinner from "components/FullPageSpinner";
import Toast from "features/toast/Toast";

import { theme } from "./const";
import store, { RootState } from "./store";

const loadAuthenticatedApp = () => import("./AuthenticatedApp");
const AuthenticatedApp = React.lazy(loadAuthenticatedApp);
const UnauthenticatedApp = React.lazy(() => import("./features/auth/Auth"));

const AuthWrapper = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  React.useEffect(() => {
    // preload the AuthenticatedApp
    // while user is logging
    loadAuthenticatedApp();
  }, []);

  return (
    <Suspense fallback={<FullPageSpinner />}>
      {user ? <AuthenticatedApp key={user.id} /> : <UnauthenticatedApp />}
    </Suspense>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AuthWrapper />
          <Toast />
        </ThemeProvider>
      </Router>
    </Provider>
  );
};

export default App;
