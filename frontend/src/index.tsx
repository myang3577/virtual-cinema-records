import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
// import rootReducer from "./reducers/otherReducer";
import rootReducer from "./reducers/rootReducer";
import App from "./components/App";
import { ThemeProvider } from "@material-ui/core/styles";
import { tealLightGreenTheme } from "./styles/MUITheme";
import { composeWithDevTools } from "redux-devtools-extension";

import "./index.css";

// rootReducer represents all reducers. rootReducer.tsx combines all reducers
// applyMiddleware(thunk) is used to handle async api calls. don't worry about
// thunk. just use it
// const store = createStore(rootReducer, applyMiddleware(thunk));
// const store = createStore(
//   rootReducer /* preloadedState, */,
//   +window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
// );
const store = createStore(
  rootReducer,
  composeWithDevTools(
    applyMiddleware(thunk)
    // other store enhancers if any
  )
);
ReactDOM.render(
  // Always provider. Keep it like that
  <Provider store={store}>
    <ThemeProvider theme={tealLightGreenTheme}>
      <App />
    </ThemeProvider>
  </Provider>,
  document.getElementById("root")
);
