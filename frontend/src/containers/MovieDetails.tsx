import React from "react";
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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dialog: {
      margin: 0,
      width: "100%",
    },
    root: {
      flexGrow: 1,
      margin: 0,
      width: "100%",
      marginTop: "5%",
    },
    descriptionHeader: {
      display: "inline-flex",
      alignItems: "center",
    },
    prices: {},
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

interface MovieDetailsProps {
  movie: any;
  movieDetailsOpen: boolean;
  inUserList: boolean;
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

  const movieCast = useSelector<GlobalState, any>(
    (state) => state.tmdbData.movieCast
  );

  const movieReleaseDate = useSelector<GlobalState, any>(
    (state) => state.tmdbData.movieReleaseDate
  );

  const displayCast = () => {
    return movieCast.cast.slice(0, 10).map((member: any) => (
      <ListItem disableGutters>
        <ListItemAvatar>
          <Avatar alt={member.name} src={baseUrl + member.profile_path} />
        </ListItemAvatar>
        <ListItemText primary={member.name + " (" + member.character + ")"} />
      </ListItem>
    ));
  };

  const addRemoveMoviesIconButtonClick = () => {
    if (props.inUserList) {
      dispatch(deleteMovie(username, props.movie.id));
    } else {
      dispatch(putMovie(username, props.movie.id));
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
          <AddRemoveMoviesIconButton
            inUserList={props.inUserList}
            isLoggedIn={isLoggedIn}
            onClick={addRemoveMoviesIconButtonClick}
          />
        </Toolbar>
      </Paper>
      <Grid container spacing={0} className={classes.root}>
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
              props.movie.poster_path
                ? baseUrl + props.movie.poster_path
                : "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1200px-No_image_available.svg.png"
            }
            alt="movie poster"
          />
          {props.movie.production_companies &&
            props.movie.production_companies.map((e: any, i: number) => {
              if (e.logo_path) {
                return (
                  <img
                    src={baseUrl + e.logo_path}
                    style={{ maxWidth: "10%", maxHeight: "10%" }}
                    alt="company logos"
                    key={i}
                  />
                );
              } else {
                return <div key={i}>{e.name}</div>;
              }
            })}
        </Grid>
        {/* movie description, rating, and title */}
        <Grid className={classes.paper} item xs={5} style={{ marginRight: 0 }}>
          <br />
          <Grid className={classes.descriptionHeader}>
            <Typography variant="h3">
              {props.movie && props.movie.title}
            </Typography>
          </Grid>
          <br />
          <Grid item xs={12}>
            <Grid className={classes.paper}></Grid>

            <br />
          </Grid>
          {isLoggedIn && (
            <RatingButtons
              movie={props.movie}
              userRating={props.userRating}
              displayWords={true}
            />
          )}
          <br />
          <Typography variant="body1">
            {props.movie && props.movie.overview}
          </Typography>
          <br />
          <Typography variant="body1">
            {" "}
            {movieReleaseDate.results &&
              movieReleaseDate.results.length > 0 &&
              "Release Date: " + props.movie.release_date}
          </Typography>
          <br />
          <Typography variant="h6">
            {" "}
            {movieCast.cast && movieCast.cast.length > 0 && "The Cast"}{" "}
          </Typography>
          {movieCast.cast && (
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
          <RelatedMovies />
        </Grid>
      </Grid>
    </Dialog>
  );
}

export default MovieDetails;
