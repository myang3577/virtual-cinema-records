import React, { useEffect } from "react";
import Snackbar from "@material-ui/core/Snackbar";
import { useSelector, useDispatch } from "react-redux";
import { GlobalState } from "../reducers/rootReducer";
import {
  closeSnackBar,
  SnackBarActionType,
  setAccountModalContent,
  AccountModalContent,
  openAccountModal,
} from "../actions/uiActions";
import { IconButton, Slide, Tooltip } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { Person, Theaters } from "@material-ui/icons";
import { Link as RouterLink } from "react-router-dom";
import { routes } from "./pages/App";
import NavBar from "./NavBar";

export interface SnackbarMessage {
  message: string;
  key: number;
  action: SnackBarActionType;
}

function SnackBar() {
  const dispatch = useDispatch();

  const snackBarOpen: any = useSelector<GlobalState>(
    (state) => state.uiData.snackBarOpen
  );

  const snackBarString = useSelector<GlobalState, string>(
    (state) => state.uiData.snackBarString
  );

  const snackBarAction = useSelector<GlobalState, SnackBarActionType>(
    (state) => state.uiData.snackBarAction
  );

  const [messageInfo, setMessageInfo] = React.useState<
    SnackbarMessage | undefined
  >(undefined);
  const [open, setOpen] = React.useState(false);
  const [snackPack, setSnackPack] = React.useState<SnackbarMessage[]>([]);

  useEffect(() => {
    if (snackBarString && snackBarAction) {
      addMessage(snackBarString, snackBarAction);
    }

    setOpen(snackBarOpen);
  }, [dispatch, snackBarString, snackBarOpen, snackBarAction]);

  const addMessage = (message: string, action: SnackBarActionType) => {
    setSnackPack((prev) => [
      ...prev,
      { message, key: new Date().getTime(), action },
    ]);
  };

  const handleExited = () => {
    setMessageInfo(undefined);
  };

  useEffect(() => {
    if (snackPack.length && !messageInfo) {
      // Set a new snack when we don't have an active one
      setMessageInfo({ ...snackPack[0] });
      setSnackPack((prev) => prev.slice(1));
      setOpen(true);
    } else if (snackPack.length && messageInfo && open) {
      // Close an active snack when a new one is added
      setOpen(false);
    }
  }, [snackPack, messageInfo, open]);

  const handleClose = () => {
    setOpen(false);
  };

  const interactiveIconClick = () => {
    setOpen(false);

    if (messageInfo) {
      switch (messageInfo.action) {
        case SnackBarActionType.NONE:
          return;
        case SnackBarActionType.LOGIN:
          dispatch(setAccountModalContent(AccountModalContent.LOGIN));
          dispatch(openAccountModal());
          return;
        case SnackBarActionType.MYMOVIES:
          return;
      }
    }
  };

  const interactiveIcon = () => {
    if (messageInfo) {
      switch (messageInfo.action) {
        case SnackBarActionType.NONE:
          return;
        case SnackBarActionType.LOGIN:
          return <Person fontSize="small" />;
        case SnackBarActionType.MYMOVIES:
          return <Theaters fontSize="small" />;
      }
    }
  };

  const interactiveIconLink = (event: any) => {
    if (messageInfo) {
      switch (messageInfo.action) {
        case SnackBarActionType.MYMOVIES:
          return routes.myMoviesLink;
      }
    }

    return "";
  };

  return (
    <Snackbar
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={open}
      autoHideDuration={3000}
      onClose={handleClose}
      onExited={handleExited}
      message={messageInfo ? messageInfo.message : undefined}
      TransitionComponent={Slide}
      transitionDuration={500}
      key={messageInfo ? messageInfo.key : undefined}
      action={
        <React.Fragment>
          {messageInfo && messageInfo.action && (
            <IconButton
              size="small"
              color="inherit"
              onClick={interactiveIconClick}
              component={RouterLink}
              to={interactiveIconLink}
            >
              {interactiveIcon()}
            </IconButton>
          )}
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </React.Fragment>
      }
    />
  );
}

export default SnackBar;
