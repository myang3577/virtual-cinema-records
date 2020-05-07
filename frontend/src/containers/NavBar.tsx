import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { GlobalState } from "../reducers/rootReducer";
import { Tabs, Tab, Paper } from "@material-ui/core";
import HomeOutlinedIcon from "@material-ui/icons/HomeOutlined";
import MovieFilterIcon from "@material-ui/icons/MovieFilter";
import TheatersIcon from "@material-ui/icons/Theaters";
import PersonIcon from "@material-ui/icons/Person";
import "../styles/App.css";
import {
  openAccountModal,
  toggleAccountDrawer,
  setAccountModalContent,
  AccountModalContent,
  closeAccountModal,
} from "../actions/uiActions";
import { routes } from "./App";
import VCRBigLogo from "../images/VCRBigLogo.png";
import AccountDrawer from "./AccountDrawer";
import AccountModal from "./AccountModal";

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
    if (isLoggedIn) {
      dispatch(setAccountModalContent(AccountModalContent.LOGOUT));
      dispatch(openAccountModal());
      return;
    }
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    dispatch(toggleAccountDrawer(open));
  };

  return (
    <Paper style={{ margin: 0 }} square>
      <Tabs
        value={false}
        className="navbar"
        indicatorColor="primary"
        textColor="primary"
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
        <img src={VCRBigLogo} id="navbar-img" alt="VCR logo" />
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
      </Tabs>
    </Paper>
  );
}

export default NavBar;
