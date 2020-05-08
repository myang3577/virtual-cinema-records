import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { CssBaseline } from "@material-ui/core";
import Home from "./Home";
import About from "./About";
import Recommendations from "./Recommendations";
import MyMovies from "./MyMovies";
import Navbar from "../NavBar";

export const routes = {
  homeLink: "/",
  aboutLink: "/about",
  recsLink: "/recommendations",
  myMoviesLink: "/my_movies",
};

function App() {
  return (
    <Router>
      <div>
        {/* Remove margins */}
        <CssBaseline />
        <Navbar />

        <div className="page-body">
          <Switch>
            <Route path={routes.recsLink}>
              <Recommendations />
            </Route>
            <Route path={routes.myMoviesLink}>
              <MyMovies />
            </Route>
            <Route path={routes.aboutLink}>
              <About />
            </Route>
            <Route path={routes.homeLink}>
              <Home />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
