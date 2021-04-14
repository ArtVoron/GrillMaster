import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import { ThemeProvider } from "@material-ui/styles";
import { PersistGate } from "redux-persist/integration/react";

import App from "./App";
import { MuiTheme } from "./constants/MuiTheme";
import { store, persistor } from "./redux/store/Store";
import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
  <ThemeProvider theme={MuiTheme}>
    <React.StrictMode>
      <Provider store={store}>
        <BrowserRouter>
          <PersistGate persistor={persistor}>
            <App />
          </PersistGate>
        </BrowserRouter>
      </Provider>
    </React.StrictMode>
  </ThemeProvider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();