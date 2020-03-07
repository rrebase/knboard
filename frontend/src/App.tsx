import React from "react";
import logo from "./logo.svg";
import "./App.scss";
import Counter from "./features/counter/Counter";
import { Provider } from "react-redux";
import store from "./store";

const App = () => {
  return (
    <Provider store={store}>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <Counter />
        </header>
      </div>
    </Provider>
  );
};

export default App;
