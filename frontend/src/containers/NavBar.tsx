import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link as RouterLink,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { GlobalState } from "../reducers/rootReducer";
import {
  Tabs,
  Tab,
  Modal,
  Card,
  CardContent,
} from "@material-ui/core";
import HomeOutlinedIcon from "@material-ui/icons/HomeOutlined";
import MovieFilterIcon from "@material-ui/icons/MovieFilter";
import TheatersIcon from "@material-ui/icons/Theaters";
import BookmarksOutlinedIcon from "@material-ui/icons/BookmarksOutlined";
import PersonIcon from "@material-ui/icons/Person";
import "../styles/App.css";
import { accountLoginModal, accountLogoutModal, accountOpenModal, accountCloseModal } from "../actions/uiActions";
import { AccountModalType } from "../reducers/uiReducer";
import LoginForm from "./LoginForm";
import LogoutForm from "./LogoutForm";
import RegisterForm from "./RegisterForm";

const homeLink = "/";
const accountLink = "/account";
const recsLink = "/recommendations";
const mymoviesLink = "/mymovies";

const VCRBigLogo = require("../images/VCRBigLogo.png");
const VCRSmallLogo = require("../images/VCRIconOnly.png");

function NavBar() {
  const isLoggedIn: any = useSelector<GlobalState>(
    (state) => state.loginData.isLoggedIn
  );

  const username: any = useSelector<GlobalState>(
    (state) => state.loginData.username
  );

  const modalOpen: any = useSelector<GlobalState>(
    (state) => state.uiData.accountModalOpen
  );

  const modalType: any = useSelector<GlobalState>(
    (state) => state.uiData.accountModalType
  );

  const dispatch = useDispatch();

  const handleAccountClick = () => {
    dispatch(accountOpenModal());
  };

  const handleModalClose = () => {
    dispatch(accountCloseModal());
  };

  const accountString = isLoggedIn ? username : "Login";

  const accountModal = () => {
    switch(modalType) {
      case AccountModalType.LOGIN:
        return <LoginForm />;
      case AccountModalType.LOGOUT:
        return <LogoutForm />;
      case AccountModalType.REGISTER:
        return <RegisterForm />;
    };
  };

  return (
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
        to={homeLink}
      />
      <Tab
        icon={<MovieFilterIcon />}
        label={<span className="navbar-label">Recommendations</span>}
        component={RouterLink}
        to={recsLink}
      />
      <img src={VCRBigLogo} id="navbar-img" />
      <Tab
        icon={<TheatersIcon />}
        label={<span className="navbar-label">MyMovies</span>}
        component={RouterLink}
        to={mymoviesLink}
      />
      <Tab
        icon={<PersonIcon />}
        label={<span className="navbar-label">{accountString}</span>}
        onClick={handleAccountClick}
      />
      <Modal
        open={modalOpen}
        onClose={handleModalClose}
        className="account-modal"
      >
        <Card className="account-card">
          <div id="modal-img-div">
            <img src={VCRSmallLogo} id="modal-img" />
          </div>
          <CardContent>
            {accountModal()}
          </CardContent>
        </Card>
      </Modal>
    </Tabs>
  );
}

export default NavBar;
