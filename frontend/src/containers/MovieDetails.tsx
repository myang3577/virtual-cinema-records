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
} from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { GlobalState } from "../reducers/rootReducer";
import { toggleDetailDrawer } from "../actions/uiActions";
import CloseIcon from "@material-ui/icons/Close";
import { Add, Delete } from "@material-ui/icons";
import { TransitionProps } from "@material-ui/core/transitions/transition";
import RatingButtons, { RatingType } from "./RatingButtons";
import Prices from "./Prices";

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
        <IconButton>{currMovie.inUserList ? <Delete /> : <Add />}</IconButton>
      </Toolbar>
      <Grid container spacing={3} className={classes.root}>
        {/* movie poster */}
        <Grid
          className={classes.paper}
          item
          xs={4}
          style={{
            marginLeft: "-5%",
          }}
        >
          <img
            style={{ maxWidth: "95%" }}
            src={
              currMovie.movie.poster_path
                ? baseUrl + currMovie.movie.poster_path
                : "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1200px-No_image_available.svg.png"
            }
            alt="movie poster"
          />
        </Grid>
        {/* movie description, rating, and title */}
        <Grid className={classes.paper} item xs={5}>
          <Grid className={classes.descriptionHeader}>
            <Typography variant="h3">
              {currMovie.movie && currMovie.movie.title}
            </Typography>
            {currMovie.movie.production_companies &&
              currMovie.movie.production_companies.map((e: any) => (
                <img src={baseUrl + e.logo_path} alt="company logos" />
              ))}
            <RatingButtons
              movie_id={currMovie.movie.id}
              rating={RatingType.TWO}
            />
          </Grid>
          <br />
          <br />
          <Typography variant="body1">
            {currMovie.movie && currMovie.movie.overview}
          </Typography>
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
