import React, { useState, useEffect } from "react";
import { Rating } from "@material-ui/lab";
import { putRating } from "../actions/movieListActions";
import { GlobalState } from "../reducers/rootReducer";
import { useSelector, useDispatch } from "react-redux";

export enum RatingType {
  ZERO = 0,
  ONE = 1,
  TWO = 2,
  THREE = 3,
  FOUR = 4,
  FIVE = 5,
}

export interface RatingButtonsProps {
  username: any;
  movie_id: any;
  rating: any;
}

export function RatingButtons(props: RatingButtonsProps) {
  const dispatch = useDispatch();

  const [value, setValue] = useState(props.rating);

  useEffect(() => {
    //dispatch(putRating(props.username, props.movie_id, value));
  }, [value]);

  return (
    <Rating
      value={value}
      onChange={(event, newValue) => {
        if (newValue !== null) {
          setValue(newValue);
        } else {
          setValue(0);
        }
      }}
    />
  );
}

export default RatingButtons;
