import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link as RouterLink,
} from "react-router-dom";
import { Paper, Tabs, Tab, CssBaseline, Modal } from "@material-ui/core";
import Home from "./Home";
import About from "./About";
import Recommendations from "./Recommendations";
import MyMovies from "./MyMovies";
import Navbar from "./NavBar";

const homeLink = "/";
const aboutLink = "/about";
const recsLink = "/recommendations";
const mymoviesLink = "/mymovies";

function App() {
  return (
    <Router>
      <div>
        {/* Remove margins */}
        <CssBaseline />
        <Paper style={{ margin: 0 }} square>
          <Navbar />
        </Paper>

        <Switch>
          <Route path={recsLink}>
            <Recommendations />
          </Route>
          <Route path={mymoviesLink}>
            <MyMovies />
          </Route>
          <Route path={aboutLink}>
            <About />
          </Route>
          <Route path={homeLink}>
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
