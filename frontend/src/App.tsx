import React, { useEffect, Suspense } from "react";
import { Provider, useSelector } from "react-redux";
import { ThemeProvider, CssBaseline } from "@material-ui/core";
import { BrowserRouter as Router } from "react-router-dom";
import { Global, css } from "@emotion/core";

import FullPageSpinner from "components/FullPageSpinner";
import Toast from "features/toast/Toast";
import { theme, modalPopperAutocompleteModalIndex } from "./const";
import store, { RootState } from "./store";
import { FOCUS_BOX_SHADOW } from "utils/colors";

const loadAuthenticatedApp = () => import("./AuthenticatedApp");
const AuthenticatedApp = React.lazy(loadAuthenticatedApp);
const UnauthenticatedApp = React.lazy(() => import("./features/auth/Auth"));

const AuthWrapper = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    // Preload the AuthenticatedApp
    // while the user is logging in
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
          <Global
            styles={css`
              .Mui-focusVisible {
                box-shadow: 0 0 3px 2px ${FOCUS_BOX_SHADOW};
              }
              textarea {
                font-family: inherit;
              }
              .MuiAutocomplete-popper {
                z-index: ${modalPopperAutocompleteModalIndex} !important;
              }
            `}
          />
        </ThemeProvider>
      </Router>
    </Provider>
  );
};

export default App;
