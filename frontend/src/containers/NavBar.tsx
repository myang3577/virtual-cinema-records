import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { GlobalState } from "../reducers/rootReducer";
import { Tabs, Tab, Paper, Collapse } from "@material-ui/core";
import HomeOutlinedIcon from "@material-ui/icons/HomeOutlined";
import MovieFilterIcon from "@material-ui/icons/MovieFilter";
import TheatersIcon from "@material-ui/icons/Theaters";
import PersonIcon from "@material-ui/icons/Person";
import "../styles/App.css";
import { toggleAccountDrawer } from "../actions/uiActions";
import App, { routes } from "./pages/App";
import VCRBigLogo from "../images/VCRBigLogo.png";
import VCRIconOnly from "../images/VCRIconOnly.png";
import AccountDrawer from "./user/AccountDrawer";
import AccountModal from "./user/AccountModal";
import MovieDescription from "./MovieDescription";
import { PlayCircleFilledWhite } from "@material-ui/icons";

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

  const [displayFullBar, setDisplayFullBar] = useState<boolean>(false);
  const [width, setWidth] = useState(window.innerWidth);
  const [scrollDistance, setScrollDistance] = useState(0);
  const widthBreakpoint = 800;
  const scrollBreakpoint = 60;

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);

    window.onscroll = () => {
      setScrollDistance(document.scrollingElement!.scrollTop);
    };

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    setDisplayFullBar(
      width > widthBreakpoint && scrollDistance < scrollBreakpoint
    );
  }, [scrollDistance, width]);

  const [value, setValue] = React.useState(0);

  const handleChange = (event: any, newValue: any) => {
    setValue(newValue);
  };

  return (
    <Paper style={{ margin: 0 }} square className="navbar-container">
      <Tabs
        value={value}
        className="navbar"
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
        onChange={handleChange}
        centered
      >
        <Tab
          className="navbar-tab"
          icon={<HomeOutlinedIcon />}
          label={displayFullBar && <span className={"navbar-label"}>Home</span>}
          component={RouterLink}
          to={routes.homeLink}
        />
        <Tab
          className="navbar-tab"
          icon={<MovieFilterIcon />}
          label={
            displayFullBar && (
              <span className={"navbar-label"}>Recommendations</span>
            )
          }
          component={RouterLink}
          to={routes.recsLink}
        />
        <Tab
          className={"navbar-img-tab"}
          icon={
            <img src={VCRIconOnly} id={"navbar-small-img"} alt="VCR logo" />
          }
          component={RouterLink}
          to={routes.homeLink}
        />
        <Tab
          className="navbar-tab"
          icon={<TheatersIcon />}
          label={
            displayFullBar && <span className={"navbar-label"}>MyMovies</span>
          }
          component={RouterLink}
          to={routes.myMoviesLink}
        />
        <Tab
          className="navbar-tab"
          icon={<PersonIcon />}
          label={
            displayFullBar && (
              <span className={"navbar-label"}>{accountString}</span>
            )
          }
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
