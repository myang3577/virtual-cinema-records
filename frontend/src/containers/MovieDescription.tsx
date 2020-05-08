import React, { useEffect } from "react";
import { makeStyles, Dialog, Toolbar, IconButton } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { GlobalState } from "../reducers/rootReducer";
import { toggleDetailDrawer } from "../actions/uiActions";
import VCRSmallLogo from "../images/VCRIconOnly.png";
import CloseIcon from "@material-ui/icons/Close";
import { Add, Delete } from "@material-ui/icons";
import MovieCards from "../components/MovieCards";

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: "auto",
  },
});

function MovieDescription() {
  const classes = useStyles();

  const dispatch = useDispatch();

  const dialogOpen: any = useSelector<GlobalState>(
    (state) => state.uiData.detailDrawerOpen
  );

  useEffect(() => {
    dispatch(toggleDetailDrawer(dialogOpen));
  }, [dispatch, dialogOpen]);

  const handleClose = () => {
    dispatch(toggleDetailDrawer(false));
  };

  const baseUrl: any = useSelector<GlobalState>(
    (state) => state.uiData.tmdbBaseUrl
  );

  const display = () => (
    <div
      className={classes.list}
      role="presentation"
      onClick={(e) => {
        handleClose();
      }}
      onKeyDown={(e) => {
        handleClose();
      }}
    >
      <Toolbar>
        <IconButton
          edge="start"
          onClick={(e) => {
            handleClose();
          }}
        >
          <CloseIcon />
        </IconButton>
        <IconButton edge="end">
          <Add />
        </IconButton>
      </Toolbar>
      <br />

      {/* <CardMedia
        component="img"
        image={
        }
        style={{ height: "auto", width: "100%" }}
      /> */}
    </div>
  );

  return (
    <Dialog
      fullScreen
      open={dialogOpen}
      onClose={(e) => {
        handleClose();
      }}
    >
      {display()}
    </Dialog>
  );
}

export default MovieDescription;
