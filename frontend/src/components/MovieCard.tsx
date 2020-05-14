import React from "react";
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  IconButton,
  CardActionArea,
  Typography,
  Tooltip,
} from "@material-ui/core";
import { Add, Delete } from "@material-ui/icons";
import { PageType } from "../constants/General";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleDetailDrawer,
  openSnackBar,
  SnackBarActionType,
} from "../actions/uiActions";
import { GlobalState } from "../reducers/rootReducer";
import { putMovie, deleteMovie } from "../actions/movieListActions";
import RatingButtons from "../containers/RatingButtons";
import { getMovieCast } from "../actions/tmdbActions";
import { getReleaseDate } from "../actions/tmdbActions";

export interface MovieCardProps {
  movie: any;
  inUserList: boolean;
  page: PageType;
  userRating?: number;
}

function MovieCard(props: MovieCardProps) {
  const baseUrl = useSelector<GlobalState, string>(
    (state) => state.uiData.tmdbBaseUrl
  );

  const isLoggedIn = useSelector<GlobalState, boolean>(
    (state) => state.loginData.isLoggedIn
  );

  const username = useSelector<GlobalState, string>(
    (state) => state.loginData.username
  );

  const cardTitle = () => {
    var title = props.movie.title;
    return <Typography>{title}</Typography>;
  };

  const iconButtonClick = () => {
    if (props.inUserList) {
      dispatch(deleteMovie(username, props.movie.id));
      dispatch(
        openSnackBar(
          props.movie.title + " removed from MyMovies",
          SnackBarActionType.MYMOVIES
        )
      );
    } else {
      if (isLoggedIn) {
        dispatch(putMovie(username, props.movie.id));
        dispatch(
          openSnackBar(
            props.movie.title + " added to MyMovies",
            SnackBarActionType.RATING,
            props.movie,
            props.userRating
          )
        );
      } else {
        dispatch(
          openSnackBar(
            "You must log in to add " + props.movie.title + " to MyMovies",
            SnackBarActionType.MYMOVIES
          )
        );
      }
    }
  };

  const dispatch = useDispatch();

  const openMovieDetailDrawer = () => {
    dispatch(toggleDetailDrawer(true, props.inUserList, props.movie));
    dispatch(getMovieCast(props.movie.id));
    dispatch(getReleaseDate(props.movie.id));
  };

  return (
    <div>
      <Card elevation={3} style={{ margin: "5px" }}>
        <CardHeader
          titleTypographyProps={{
            variant: "subtitle1",
            display: "inline",
          }}
          title={cardTitle()}
          subheader={
            props.movie.release_data ? props.movie.release_date.slice(0, 4) : ""
          }
          subheaderTypographyProps={{
            variant: "subtitle2",
            display: "inline",
          }}
          action={
            <Tooltip
              title={
                props.inUserList
                  ? "Remove from MyMovies"
                  : isLoggedIn
                  ? "Add to MyMovies"
                  : "Login to add to MyMovies"
              }
              placement="top"
            >
              <span>
                <IconButton
                  size="medium"
                  onClick={iconButtonClick}
                  disabled={!isLoggedIn}
                >
                  {props.inUserList ? <Delete /> : <Add />}
                </IconButton>
              </span>
            </Tooltip>
          }
        />
        {props.page === PageType.MY_MOVIES && (
          <CardContent>
            <RatingButtons
              movie={props.movie}
              userRating={props.userRating!}
              displayWords={true}
            />
          </CardContent>
        )}
        <CardActionArea onClick={openMovieDetailDrawer}>
          <CardMedia
            component="img"
            image={
              props.movie.poster_path
                ? baseUrl + props.movie.poster_path
                : "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1200px-No_image_available.svg.png"
            }
          />
        </CardActionArea>
      </Card>
    </div>
  );
}

export default MovieCard;
