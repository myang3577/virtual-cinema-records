import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { GlobalState } from "../reducers/rootReducer";
import { Tabs, Tab, Paper, IconButton, makeStyles } from "@material-ui/core";
import HomeOutlinedIcon from "@material-ui/icons/HomeOutlined";
import MovieFilterIcon from "@material-ui/icons/MovieFilter";
import TheatersIcon from "@material-ui/icons/Theaters";
import PersonIcon from "@material-ui/icons/Person";
import MenuIcon from "@material-ui/icons/Menu";
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

  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  var breakpoint = 800;

  const displayFullBar = () => {
    return (
      <React.Fragment>
        <Tab
          className="navbar-tab"
          icon={<HomeOutlinedIcon />}
          label={
            width > breakpoint ? (
              <span className="navbar-label">Home</span>
            ) : null
          }
          component={RouterLink}
          to={routes.homeLink}
        />
        <Tab
          className="navbar-tab"
          icon={<MovieFilterIcon />}
          label={
            width > breakpoint ? (
              <span className="navbar-label">Recommendations</span>
            ) : null
          }
          component={RouterLink}
          to={routes.recsLink}
        />
        <Tab
          className="navbar-tab"
          icon={<img src={VCRBigLogo} id="navbar-img" alt="VCR logo" />}
          component={RouterLink}
          to={routes.homeLink}
        />
        <Tab
          className="navbar-tab"
          icon={<TheatersIcon />}
          label={
            width > breakpoint ? (
              <span className="navbar-label">MyMovies</span>
            ) : null
          }
          component={RouterLink}
          to={routes.myMoviesLink}
        />
        <Tab
          className="navbar-tab"
          icon={<PersonIcon />}
          label={
            width > breakpoint ? (
              <span className="navbar-label">{accountString}</span>
            ) : null
          }
          onClick={toggleDrawer(true)}
        />
      </React.Fragment>
    );
  };

  const displaySmallBar = () => {
    return (
      <React.Fragment>
        <Tab
          className="navbar-tab"
          icon={<img src={VCRBigLogo} id="navbar-img" alt="VCR logo" />}
          component={RouterLink}
          to={routes.homeLink}
        />
        <IconButton
          onClick={(e) => {
            toggleDrawer(true);
          }}
        >
          <MenuIcon />
        </IconButton>
      </React.Fragment>
    );
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
        {displayFullBar()}
        <AccountDrawer />
        <AccountModal />
        <MovieDescription />
      </Tabs>
    </Paper>
  );
}

export default NavBar;
