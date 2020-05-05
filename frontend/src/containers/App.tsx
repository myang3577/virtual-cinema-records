import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link as RouterLink,
} from "react-router-dom";
import { Paper, Tabs, Tab, CssBaseline } from "@material-ui/core";
import HomeOutlinedIcon from "@material-ui/icons/HomeOutlined";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import BookmarksOutlinedIcon from "@material-ui/icons/BookmarksOutlined";
import QueuePlayNextRoundedIcon from "@material-ui/icons/QueuePlayNextRounded";
import Home from "./Home";
import About from "./About";
import Recommendations from "./Recommendations";
import MyMovies from "./MyMovies";

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
          <Tabs
            value={false}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab
              icon={<HomeOutlinedIcon />}
              component={RouterLink}
              to={homeLink}
            />
            <Tab
              icon={<InfoOutlinedIcon />}
              component={RouterLink}
              to={aboutLink}
            />
            <Tab
              icon={<QueuePlayNextRoundedIcon />}
              component={RouterLink}
              to={recsLink}
            />
            <Tab
              icon={<BookmarksOutlinedIcon />}
              component={RouterLink}
              to={mymoviesLink}
            />
          </Tabs>
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
