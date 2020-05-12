import React, { useEffect } from "react";
import Snackbar from "@material-ui/core/Snackbar";
import { useSelector, useDispatch } from "react-redux";
import { GlobalState } from "../reducers/rootReducer";
import { closeSnackBar } from "../actions/uiActions";
import { IconButton, Slide } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { Queue } from "@material-ui/icons";

export interface SnackbarMessage {
  message: string;
  key: number;
}

function SnackBar() {
  const dispatch = useDispatch();

  const snackBarOpen: any = useSelector<GlobalState>(
    (state) => state.uiData.snackBarOpen
  );

  const snackBarString = useSelector<GlobalState, string>(
    (state) => state.uiData.snackBarString
  );

  const [messageInfo, setMessageInfo] = React.useState<
    SnackbarMessage | undefined
  >(undefined);
  const [open, setOpen] = React.useState(false);
  const [snackPack, setSnackPack] = React.useState<SnackbarMessage[]>([]);

  useEffect(() => {
    if (snackBarString) {
      addMessage(snackBarString);
    }

    setOpen(snackBarOpen);
  }, [dispatch, snackBarString, snackBarOpen]);

  const addMessage = (message: string) => {
    setSnackPack((prev) => [...prev, { message, key: new Date().getTime() }]);
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
