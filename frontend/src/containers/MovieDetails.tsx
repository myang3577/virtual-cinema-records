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
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  GridList,
} from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { GlobalState } from "../reducers/rootReducer";
import {
  toggleDetailDrawer,
  openAccountModal,
  removeCurrentMovie,
  addCurrentMovie,
} from "../actions/uiActions";
import CloseIcon from "@material-ui/icons/Close";
import { Add, Delete } from "@material-ui/icons";
import { TransitionProps } from "@material-ui/core/transitions/transition";
import Prices from "./Prices";
import { deleteMovie, putMovie } from "../actions/movieListActions";
import RatingButtons from "../containers/RatingButtons";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      marginLeft: "2%",
      marginRight: "2%",
    },
    descriptionHeader: {
      display: "inline-flex",
      alignItems: "center",
    },
    prices: {
      display: "flex",
      justifyContent: "center",
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

function MovieDetails() {
  const classes = useStyles();

  const dispatch = useDispatch();

  const username = useSelector<GlobalState, string>(
    (state) => state.loginData.username
  );

  const isLoggedIn = useSelector<GlobalState, boolean>(
    (state) => state.loginData.isLoggedIn
  );

  const baseUrl = useSelector<GlobalState, string>(
    (state) => state.uiData.tmdbBaseUrl
  );

  const dialogOpen = useSelector<GlobalState, boolean>(
    (state) => state.uiData.detailDrawerOpen
  );

  const currMovie = useSelector<GlobalState, any>(
    (state) => state.uiData.currentMovie.movie
  );

  const movieInUserList = useSelector<GlobalState, boolean>(
    (state) => state.uiData.currentMovie.inUserList
  );

  const movieCast: any = useSelector<GlobalState>(
    (state) => state.tmdbData.movieCast
  );

  const movieReleaseDate: any = useSelector<GlobalState>(
    (state) => state.tmdbData.movieReleaseDate
  );

  const displayCast = () => {
    return (
      movieCast.cast &&
      movieCast.cast.slice(0, 10).map((member: any) => (
        <ListItem disableGutters={true}>
          <ListItemText primary={member.name + " (" + member.character + ")"} />
          <ListItemAvatar>
            <Avatar alt={member.name} src={baseUrl + member.profile_path} />
          </ListItemAvatar>
        </ListItem>
      ))
    );
  };

  console.log(movieCast.cast);

  useEffect(() => {
    dispatch(toggleDetailDrawer(dialogOpen, movieInUserList, currMovie));
  }, [dispatch, dialogOpen, movieInUserList, currMovie]);

  const handleClose = () => {
    dispatch(toggleDetailDrawer(false, false));
  };

  const iconButtonClick = () => {
    if (movieInUserList) {
      dispatch(deleteMovie(username, currMovie.id));
      dispatch(removeCurrentMovie());
    } else {
      if (isLoggedIn) {
        dispatch(putMovie(username, currMovie.id));
      } else {
        dispatch(openAccountModal());
        dispatch(addCurrentMovie());
      }
    }
  };

  return (
    <Dialog
      fullScreen
      open={dialogOpen}
      onClose={() => {
        handleClose();
      }}
      TransitionComponent={Transition}
      transitionDuration={500}
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
        <IconButton onClick={iconButtonClick}>
          {movieInUserList ? <Delete /> : <Add />}
        </IconButton>
      </Toolbar>
      <Grid container spacing={3} className={classes.root}>
        {/* movie poster */}
        <Grid
          className={classes.paper}
          item
          xs={4}
          style={{
            marginLeft: "0%",
          }}
        >
          <img
            style={{ maxWidth: "95%" }}
            src={
              currMovie.poster_path
                ? baseUrl + currMovie.poster_path
                : "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1200px-No_image_available.svg.png"
            }
            alt="movie poster"
          />
        </Grid>
        {/* movie description, rating, and title */}
        <Grid className={classes.paper} item xs={5}>
          <Grid className={classes.descriptionHeader}>
            <Typography variant="h3">{currMovie && currMovie.title}</Typography>
          </Grid>
          <br />
          <Grid item xs={12}>
            <Grid className={classes.paper}></Grid>
            {currMovie.production_companies &&
              currMovie.production_companies.map((e: any) => (
                <img
                  src={baseUrl + e.logo_path}
                  style={{ maxWidth: "10%" }}
                  alt="company logos"
                />
              ))}
            <br />
          </Grid>
          <RatingButtons
            movie={currMovie}
            userRating={currMovie.userRating!}
            displayWords={true}
          />
          <br />
          <Typography variant="body1">
            {currMovie && currMovie.overview}
          </Typography>
          <br />
          <Typography variant="body1">
            {" "}
            {movieReleaseDate.results &&
              movieReleaseDate.results.length > 0 &&
              "Release Date: " + currMovie.release_date}
          </Typography>
          <br />
          <Typography variant="h6">
            {" "}
            {movieCast.cast && movieCast.cast.length > 0 && "The Cast"}{" "}
          </Typography>
          <GridList
            cols={2}
            //style={{ width: "50%" }}
            //dense={true}
            //disablePadding={true}
            // above styling was used for List, not GridList
            cellHeight={45}
            spacing={1}
          >
            {movieCast.cast && displayCast()}
          </GridList>
        </Grid>
        {/* movie prices */}
        <Grid className={classes.prices} item xs={3}>
          <Prices />
        </Grid>
      </Grid>
    </Dialog>
  );
}

export default MovieDetails;
