import React, { useEffect } from "react";
import clsx from "clsx";
import {
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Popper,
  PopperPlacementType,
  Fade,
  Paper,
} from "@material-ui/core";
import PersonIcon from "@material-ui/icons/Person";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import { useSelector, useDispatch } from "react-redux";
import { GlobalState } from "../../reducers/rootReducer";
import {
  toggleAccountDrawer,
  openAccountModal,
  setAccountModalContent,
  AccountModalContent,
  closeAccountModal,
  openSnackBar,
} from "../../actions/uiActions";
import VCRSmallLogo from "../../images/VCRIconOnly.png";
import LoadingButton from "../../components/LoadingButton";
import { logout } from "../../actions/loginActions";

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: "auto",
  },
  popper: {
    zIndex: 2000,
  },
});

function AccountDrawer() {
  const classes = useStyles();

  const dispatch = useDispatch();

  const drawerOpen: any = useSelector<GlobalState>(
    (state) => state.uiData.accountDrawerOpen
  );

  useEffect(() => {
    dispatch(toggleAccountDrawer(drawerOpen));
  }, [dispatch, drawerOpen]);

  const toggleDrawer = (anchor: any, open: boolean) => (event: {
    type: string;
    key: string;
  }) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    dispatch(toggleAccountDrawer(open));
  };

  const openModal = (index: any, event: any) => {
    if (index === 0) {
      if (isLoggedIn) {
        dispatch(setAccountModalContent(AccountModalContent.CHANGE_PASSWORD));
      } else {
        dispatch(setAccountModalContent(AccountModalContent.LOGIN));
      }
    } else if (index === 1) {
      if (isLoggedIn) {
        setMenuAnchorEl(event.currentTarget);
        handleLogoutClick(event);
        return;
      } else {
        dispatch(setAccountModalContent(AccountModalContent.REGISTER));
      }
    }

    dispatch(toggleAccountDrawer(false));
    dispatch(openAccountModal());
  };

  var buttonTextOptions: string[][] = [
    ["Login", "Register"],
    ["Change Password", "Logout"],
  ];

  var buttonIconOptions: any[][] = [
    [<PersonIcon />, <PersonAddIcon />],
    [<VpnKeyIcon />, <ExitToAppIcon />],
  ];

  const setButtonOptions = (isLoggedIn: boolean) => {
    if (isLoggedIn) {
      return [buttonTextOptions[1], buttonIconOptions[1]];
    } else {
      return [buttonTextOptions[0], buttonIconOptions[0]];
    }
  };

  const isLoggedIn: any = useSelector<GlobalState>(
    (state) => state.loginData.isLoggedIn
  );

  useEffect(() => {
    setButtonOptions(isLoggedIn); // eslint-disable-next-line
  }, [isLoggedIn]);

  const list = (anchor: string) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === "top" || anchor === "bottom",
      })}
      role="presentation"
      onClick={(e) => {
        toggleDrawer(anchor, false);
      }}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <Popper
        className={classes.popper}
        open={menuOpen}
        anchorEl={menuAnchorEl}
        placement="left"
        transition
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper>
              <LoadingButton onClick={handleLogoutSubmit} loading={false}>
                Confirm Logout
              </LoadingButton>
            </Paper>
          </Fade>
        )}
      </Popper>
      <List>
        {setButtonOptions(isLoggedIn)[0].map((text, index) => (
          <ListItem
            button
            key={text}
            onClick={(e) => {
              openModal(index, e);
            }}
          >
            <ListItemIcon>
              {setButtonOptions(isLoggedIn)[1][index]}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <div id="account-drawer-pic">
        <img src={VCRSmallLogo} height="70px" alt="VCR logo" />
      </div>
    </div>
  );

  const [menuOpen, setMenuOpen] = React.useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = React.useState<any>(null);

  const handleLogoutSubmit = () => {
    dispatch(logout());
    dispatch(setAccountModalContent(AccountModalContent.LOGIN));
    dispatch(toggleAccountDrawer(false));
    dispatch(openSnackBar("Logged out"));
    setMenuOpen(false);
  };

  const handleLogoutClick = (event: any) => {
    setMenuOpen(menuOpen ? false : true);
  };

  return (
    <div>
      {["right"].map((anchor: any) => (
        <React.Fragment key={anchor}>
          <Drawer
            anchor="right"
            open={drawerOpen}
            onClose={toggleDrawer(anchor, false)}
            variant="temporary"
          >
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}

export default AccountDrawer;
