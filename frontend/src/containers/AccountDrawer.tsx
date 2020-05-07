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
  Tab,
} from "@material-ui/core";
import PersonIcon from "@material-ui/icons/Person";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import { useSelector, useDispatch } from "react-redux";
import { GlobalState } from "../reducers/rootReducer";
import {
  toggleAccountDrawer,
  openAccountModal,
  setAccountModalContent,
  AccountModalContent,
} from "../actions/uiActions";
import VCRSmallLogo from "../images/VCRIconOnly.png";

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: "auto",
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

  const openModal = (index: any) => {
    if (index === 0) {
      dispatch(setAccountModalContent(AccountModalContent.LOGIN));
    } else if (index == 1) {
      dispatch(setAccountModalContent(AccountModalContent.REGISTER));
    }

    dispatch(toggleAccountDrawer(false));
    dispatch(openAccountModal());
  };

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
      <List>
        {["Login", "Register"].map((text, index) => (
          <ListItem
            button
            key={text}
            onClick={(e) => {
              openModal(index);
            }}
          >
            <ListItemIcon>
              {index % 2 === 0 ? <PersonIcon /> : <PersonAddIcon />}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <div id="account-drawer-pic">
        <img src={VCRSmallLogo} height="70px" />
      </div>
    </div>
  );

  return (
    <div>
      {["right"].map((anchor: any) => (
        <React.Fragment key={anchor}>
          <Drawer
            anchor="right"
            open={drawerOpen}
            onClose={toggleDrawer(anchor, false)}
          >
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}

export default AccountDrawer;
