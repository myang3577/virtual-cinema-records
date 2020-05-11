import React from "react";
import Snackbar from "@material-ui/core/Snackbar";
import { useSelector, useDispatch } from "react-redux";
import { GlobalState } from "../reducers/rootReducer";
import { closeSnackBar } from "../actions/uiActions";
import { IconButton, Slide } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

function SnackBar() {
  const dispatch = useDispatch();

  const snackBarOpen: any = useSelector<GlobalState>(
    (state) => state.uiData.snackBarOpen
  );

  const snackBarString: any = useSelector<GlobalState>(
    (state) => state.uiData.snackBarString
  );

  const handleClose = () => {
    dispatch(closeSnackBar());
  };

  return (
    <Snackbar
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={snackBarOpen}
      autoHideDuration={3000}
      onClose={handleClose}
      message={snackBarString}
      TransitionComponent={Slide}
      transitionDuration={1000}
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
