import React, { useEffect } from "react";
import {
  makeStyles,
  Dialog,
  Toolbar,
  IconButton,
  Slide,
  Typography,
  Grid,
  createStyles,
  Theme,
  Divider,
  Icon,
} from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { GlobalState } from "../reducers/rootReducer";
import { toggleDetailDrawer } from "../actions/uiActions";
import CloseIcon from "@material-ui/icons/Close";
import { Add, Delete } from "@material-ui/icons";
import { TransitionProps } from "@material-ui/core/transitions/transition";
import RatingButtons, { RatingType } from "./RatingButtons";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      marginLeft: "2%",
      marginRight: "2%",
    },
    paper: {
      textAlign: "left",
      color: theme.palette.text.primary,
    },
  })
);

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function MovieDescription() {
  const classes = useStyles();

  const dispatch = useDispatch();

  const baseUrl: any = useSelector<GlobalState>(
    (state) => state.uiData.tmdbBaseUrl
  );

  const dialogOpen: any = useSelector<GlobalState>(
    (state) => state.uiData.detailDrawerOpen
  );

  const currMovie: any = useSelector<GlobalState>(
    (state) => state.uiData.currentMovie
  );

  useEffect(() => {
    dispatch(
      toggleDetailDrawer(dialogOpen, currMovie.inUserList, currMovie.movie)
    );
  }, [dispatch, dialogOpen]);

  const handleClose = () => {
    dispatch(toggleDetailDrawer(false, false));
  };

  const display = () => (
    <div
      role="presentation"
      onClick={() => {
        handleClose();
      }}
      onKeyDown={() => {
        handleClose();
      }}
    >
      <Toolbar>
        <IconButton
          edge="start"
          onClick={() => {
            handleClose();
          }}
        >
          <CloseIcon />
        </IconButton>
        <IconButton>{currMovie.inUserList ? <Delete /> : <Add />}</IconButton>
      </Toolbar>
      <Grid container spacing={3} className={classes.root}>
        <Grid
          className={classes.paper}
          item
          xs={4}
          style={{ marginRight: "-5%" }}
        >
          <img
            src={
              currMovie.movie
                ? baseUrl + currMovie.movie.poster_path
                : "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1200px-No_image_available.svg.png"
            }
          />
        </Grid>
        <Grid className={classes.paper} item xs={4}>
          <Typography variant="h3">
            {currMovie.movie && currMovie.movie.title}
          </Typography>
          {currMovie.movie.production_companies &&
            currMovie.movie.production_companies.map((e: any) => (
              <img src={baseUrl + e.logo_path} />
            ))}
          <br />
          <Divider />
          <br />
          <RatingButtons
            movie_id={currMovie.movie.id}
            rating={RatingType.TWO}
          />
          <br />
          <Divider />
          <br />
          <Typography variant="body1">
            {currMovie.movie && currMovie.movie.overview}
          </Typography>
        </Grid>
        <Grid className={classes.paper} item xs={4}>
          <Typography variant="h3">
            {currMovie.movie && currMovie.movie.title}
          </Typography>
        </Grid>
      </Grid>
    </div>
  );

  return (
    <Dialog
      fullScreen
      open={dialogOpen}
      onClose={() => {
        handleClose();
      }}
      TransitionComponent={Transition}
      transitionDuration={1000}
    >
      {display()}
    </Dialog>
  );
}

export default MovieDescription;
