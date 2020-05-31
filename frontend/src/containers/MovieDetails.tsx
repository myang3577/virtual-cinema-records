import React, { useState } from "react";
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
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  GridList,
  Paper,
} from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { GlobalState } from "../reducers/rootReducer";
import CloseIcon from "@material-ui/icons/Close";
import { TransitionProps } from "@material-ui/core/transitions/transition";
import Prices from "./Prices";
import { deleteMovie, putMovie } from "../actions/movieListActions";
import RatingButtons from "./RatingButtons";
import AddRemoveMoviesIconButton from "../components/AddRemoveMoviesIconButton";
import RelatedMovies from "./RelatedMovies";
import { openSnackBar, SnackBarActionType } from "../actions/uiActions";
import BlacklistMovieIcon from "../components/BlacklistMovieIcon";
import {
  deleteBlackListMovie,
  putBlackListMovie,
} from "../actions/blacklistAction";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dialog: {
      margin: 0,
      width: "100%",
    },
    root: {
      flexGrow: 1,
      display: "flex",
      flexDirection: "column",
      minHeight: 0,
      margin: 0,
      width: "100%",
      marginTop: "5%",
      overflowY: "hidden",
    },
    descriptionHeader: {
      display: "inline-flex",
      alignItems: "center",
    },
    prices: {
      textAlign: "left",
      color: theme.palette.text.primary,
      flexGrow: 1,
      overflow: "auto",
      minHeight: "100%",
    },
    paper: {
      textAlign: "left",
      color: theme.palette.text.primary,
      flexGrow: 1,
      overflow: "auto",
      minHeight: "100%",
    },
    poster: {
      flexShrink: 0,
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

interface MovieDetailsProps {
  movie: any;
  tmdb_id: number;
  movieDetailsOpen: boolean;
  inUserList: boolean;
  inBlackList?: boolean;
  userRating: number;
  onClose: () => any;
}

function MovieDetails(props: MovieDetailsProps) {
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

  const movieDetails = useSelector<GlobalState, any>(
    (state) => state.tmdbData.movieDetails[props.tmdb_id]
  );

  const displayCast = () =>
    movieDetails.credits.cast.slice(0, 10).map((member: any, i: number) => (
      <ListItem disableGutters key={i}>
        <ListItemAvatar>
          <Avatar
            alt={member.name}
            src={
              member.profile_path ? baseUrl + member.profile_path : undefined
            }
          />
        </ListItemAvatar>
        <ListItemText primary={member.name + " (" + member.character + ")"} />
      </ListItem>
    ));

  const addRemoveMoviesIconButtonClick = () => {
    if (props.inUserList) {
      dispatch(deleteMovie(username, movieDetails.id));
      dispatch(
        openSnackBar(
          props.movie.title + " removed from MyMovies",
          SnackBarActionType.MYMOVIES
        )
      );
    } else {
      dispatch(putMovie(username, movieDetails.id));
      dispatch(
        openSnackBar(
          props.movie.title + " added to MyMovies",
          SnackBarActionType.RATING,
          props.movie,
          props.userRating
        )
      );
    }
  };

  const blacklistIconButtonClick = () => {
    if (props.inBlackList) {
      dispatch(deleteBlackListMovie(username, props.movie.id));
      dispatch(
        openSnackBar(
          props.movie.title + " removed from blacklist",
          SnackBarActionType.MYMOVIES
        )
      );
    } else {
      dispatch(putBlackListMovie(username, props.movie.id));
      dispatch(
        openSnackBar(
          props.movie.title + " added to blacklist",
          SnackBarActionType.RATING,
          props.movie,
          props.userRating
        )
      );
    }
  };

  return (
    <Dialog
      fullScreen
      open={props.movieDetailsOpen}
      onClose={props.onClose}
      TransitionComponent={Transition}
      transitionDuration={500}
      className={classes.dialog}
    >
      <Paper
        elevation={3}
        style={{
          position: "fixed",
          top: 0,
          width: "100%",
          zIndex: 5000,
        }}
        square
      >
        <Toolbar>
          <IconButton edge="start" onClick={props.onClose}>
            <CloseIcon />
          </IconButton>
          <BlacklistMovieIcon
            inBlacklist={props.inBlackList!}
            isLoggedIn={isLoggedIn}
            onClick={blacklistIconButtonClick}
          />
          {!props.inBlackList && (
            <AddRemoveMoviesIconButton
              inUserList={props.inUserList}
              isLoggedIn={isLoggedIn}
              onClick={addRemoveMoviesIconButtonClick}
            />
          )}
        </Toolbar>
      </Paper>
      <Grid container spacing={0} className={classes.root}>
        {/* movie poster */}
        <Grid
          className={classes.poster}
          item
          xs={4}
          style={{
            marginLeft: "0%",
          }}
        >
          <img
            style={{ maxWidth: "95%" }}
            src={
              movieDetails &&
              (movieDetails.poster_path
                ? baseUrl + movieDetails.poster_path
                : "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1200px-No_image_available.svg.png")
            }
            alt="movie poster"
          />
        </Grid>
        {/* movie description, rating, and title */}
        <Grid className={classes.paper} item xs={5} style={{ marginRight: 0 }}>
          <br />
          <Grid className={classes.descriptionHeader}>
            <Typography variant="h3">
              {movieDetails && movieDetails.title}
            </Typography>
          </Grid>
          <br />
          {isLoggedIn && props.inUserList && !props.inBlackList && (
            <RatingButtons
              movie={props.movie}
              userRating={props.userRating}
              displayWords={true}
            />
          )}
          <br />
          <Typography variant="body1">
            {movieDetails && movieDetails.overview}
          </Typography>
          <br />
          <Typography variant="body1">
            {movieDetails && "Release Date: " + movieDetails.release_date}
          </Typography>
          <br />
          <Typography variant="h6">
            {movieDetails && movieDetails.credits && "The Cast"}
          </Typography>
          {movieDetails && movieDetails.credits && (
            <GridList cols={1} cellHeight={45} spacing={1}>
              {displayCast()}
            </GridList>
          )}
        </Grid>
        {/* movie prices */}
        <Grid className={classes.prices} item xs={3}>
          <Typography variant="h6" style={{ marginLeft: 5, marginTop: "5%" }}>
            Where to watch
          </Typography>
          <Prices />
          <Typography variant="h6" style={{ marginLeft: 5, marginTop: 10 }}>
            Related Movies
          </Typography>
          <RelatedMovies tmdb_id={props.tmdb_id} />
        </Grid>
      </Grid>
    </Dialog>
  );
}

export default MovieDetails;
