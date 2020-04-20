import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link as RouterLink,
  Redirect,
} from "react-router-dom";
import { Paper, Tabs, Tab, AppBar, CssBaseline } from "@material-ui/core";
import Home from "./Home";
import About from "./About";

const homeLink = "/";
const aboutLink = "/about";

function App() {
  const [currentTab, setCurrentTab] = React.useState(0);

  const handleTabChange = (e: React.ChangeEvent<{}>, newTab: number) => {
    setCurrentTab(newTab);
  };

  return (
    <Router>
      <div>
        {/* may have to change in future */}
        <Redirect to="/" />
        {/* Remove margins */}
        <CssBaseline />
        <AppBar position="static" style={{ margin: 0 }}>
          <Tabs value={currentTab} onChange={handleTabChange}>
            <Tab label="Home" component={RouterLink} to={homeLink} />
            <Tab label="About" component={RouterLink} to={aboutLink} />
          </Tabs>
        </AppBar>
        <Paper style={{ margin: 0 }} square>
          <Tabs
            value={currentTab}
            indicatorColor="primary"
            textColor="primary"
            onChange={handleTabChange}
          >
            <Tab label="Home" component={RouterLink} to={homeLink} />
            <Tab label="About" component={RouterLink} to={aboutLink} />
          </Tabs>
        </Paper>

        <Switch>
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
