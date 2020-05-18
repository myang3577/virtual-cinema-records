import React, { useEffect } from "react";
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActionArea,
  Typography,
} from "@material-ui/core";
import { PageType } from "../constants/General";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleDetailDrawer,
  openSnackBar,
  SnackBarActionType,
} from "../actions/uiActions";
import { GlobalState } from "../reducers/rootReducer";
import { putMovie, deleteMovie } from "../actions/movieListActions";
import RatingButtons from "./RatingButtons";
import { getMovieCast } from "../actions/tmdbActions";
import { getReleaseDate } from "../actions/tmdbActions";
import AddRemoveMoviesIconButton from "../components/AddRemoveMoviesIconButton";

export interface MovieCardProps {
  movie: any;
  inUserList: boolean;
  page: PageType;
  userRating: number;
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
      dispatch(putMovie(username, props.movie.id));
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

  const dispatch = useDispatch();

  const openMovieDetailDrawer = () => {
    dispatch(
      toggleDetailDrawer(true, props.inUserList, props.userRating, props.movie)
    );
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
            <AddRemoveMoviesIconButton
              inUserList={props.inUserList}
              isLoggedIn={isLoggedIn}
              onClick={iconButtonClick}
            />
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
