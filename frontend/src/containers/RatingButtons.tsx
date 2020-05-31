import React, { useState, useEffect } from "react";
import { Typography } from "@material-ui/core";
import { Rating, Skeleton } from "@material-ui/lab";
import { useDispatch, useSelector } from "react-redux";
import { GlobalState } from "../reducers/rootReducer";
import { putRating, deleteRating } from "../actions/movieListActions";
import { openSnackBar, SnackBarActionType } from "../actions/uiActions";
import { LoadingState } from "../reducers/tmdbReducer";
import { setMovieRating } from "../actions/movieDetailsActions";

export interface RatingButtonsProps {
  movie: any;
  userRating: number;
  displayWords: boolean;
  disabled?: boolean;
}

function RatingButtons(props: RatingButtonsProps) {
  const dispatch = useDispatch();

  const username = useSelector<GlobalState, string>(
    (state) => state.loginData.username
  );

  const ratingLoadingStatus = useSelector<GlobalState, LoadingState>(
    (state) => state.myMoviesData.ratingLoadingStatus[props.movie.id]
  );

  const [rating, setRating] = useState<number | null>(
    props.userRating ? props.userRating : null
  );

  const [displayRating, setDisplayRating] = useState(0);
  const [ratingHeader, setRatingHeader] = useState("");

  const onRatingChange = (e: React.ChangeEvent<{}>, value: number | null) => {
    setDisplayRating(-1);
    setRating(value);
    if (value === null) {
      dispatch(deleteRating(username, props.movie.id));
      dispatch(
        openSnackBar(
          props.movie.title + " rating removed",
          SnackBarActionType.RATING,
          props.movie,
          value
        )
      );
    } else {
      dispatch(putRating(username, props.movie.id, value));
      dispatch(
        openSnackBar(
          props.movie.title + " rating updated to " + value + " stars",
          SnackBarActionType.RATING,
          props.movie,
          value
        )
      );
    }
  };

  useEffect(() => {
    setDisplayRating(-1);
    setRating(props.userRating);
    dispatch(setMovieRating(rating));
  }, [props.userRating]);

  useEffect(() => {
    const getRatingHeader = () => {
      if (rating === 0) {
        if (displayRating > 0) {
          return "Your rating: " + (displayRating > 0 ? displayRating : rating);
        } else {
          return "Click to rate this movie.";
        }
      } else if (rating === displayRating) {
        return "Remove rating.";
      } else {
        return "Your rating: " + (displayRating > 0 ? displayRating : rating);
      }
    };

    setRatingHeader(getRatingHeader());
  }, [rating, displayRating]);

  return (
    <>
      {ratingLoadingStatus !== LoadingState.LOADING ? (
        <>
          <Typography variant="body1" hidden={!props.displayWords}>
            {ratingHeader}
          </Typography>
          <Rating
            name={props.movie.id + "-rating"}
            precision={0.5}
            max={5}
            onChange={(e, value) => onRatingChange(e, value)}
            onChangeActive={(e, value) => setDisplayRating(value!)}
            value={rating}
            disabled={props.disabled === undefined ? false : props.disabled}
          />
        </>
      ) : (
        <>
          <Skeleton variant="text" width={200} height={25} />
          <Skeleton variant="text" width={160} height={28} />
        </>
      )}
    </>
  );
}

export default RatingButtons;
