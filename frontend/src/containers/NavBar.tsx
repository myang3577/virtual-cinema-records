import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { GlobalState } from "../reducers/rootReducer";
import { Tabs, Tab, Paper } from "@material-ui/core";
import HomeOutlinedIcon from "@material-ui/icons/HomeOutlined";
import MovieFilterIcon from "@material-ui/icons/MovieFilter";
import TheatersIcon from "@material-ui/icons/Theaters";
import PersonIcon from "@material-ui/icons/Person";
import "../styles/App.css";
import { toggleAccountDrawer } from "../actions/uiActions";
import { routes } from "./pages/App";
import VCRBigLogo from "../images/VCRBigLogo.png";
import AccountDrawer from "./user/AccountDrawer";
import AccountModal from "./user/AccountModal";
import MovieDescription from "./MovieDescription";

function NavBar() {
  const dispatch = useDispatch();

  const isLoggedIn: any = useSelector<GlobalState>(
    (state) => state.loginData.isLoggedIn
  );

  const username: any = useSelector<GlobalState>(
    (state) => state.loginData.username
  );

  const accountString = isLoggedIn ? username : "Login";

  const toggleDrawer = (open: boolean) => (event: {
    type: string;
    key: string;
  }) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    if (isLoggedIn) {
      dispatch(toggleAccountDrawer(open));
    }

    dispatch(toggleAccountDrawer(open));
  };

  return (
    <Paper style={{ margin: 0 }} square className="navbar-container">
      <Tabs
        value={false}
        className="navbar"
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
        centered
      >
        <Tab
          icon={<HomeOutlinedIcon />}
          label={<span className="navbar-label">Home</span>}
          component={RouterLink}
          to={routes.homeLink}
        />
        <Tab
          icon={<MovieFilterIcon />}
          label={<span className="navbar-label">Recommendations</span>}
          component={RouterLink}
          to={routes.recsLink}
        />
        <Tab
          icon={<img src={VCRBigLogo} id="navbar-img" alt="VCR logo" />}
          component={RouterLink}
          to={routes.homeLink}
        />
        <Tab
          icon={<TheatersIcon />}
          label={<span className="navbar-label">MyMovies</span>}
          component={RouterLink}
          to={routes.myMoviesLink}
        />
        <Tab
          icon={<PersonIcon />}
          label={<span className="navbar-label">{accountString}</span>}
          onClick={toggleDrawer(true)}
        />
        <AccountDrawer />
        <AccountModal />
        <MovieDescription />
      </Tabs>
    </Paper>
  );
}

export default NavBar;
