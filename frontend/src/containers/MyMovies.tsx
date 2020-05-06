import React from "react";
import MovieGrid from "./MovieGrid";
import { useDispatch } from "react-redux";

function MyMovies() {
  const dispatch = useDispatch();

  //dispatch() we need a call to the backend here to set the movies list to be the account's movies
  return (
    <MovieGrid />
  );
}

export default MyMovies;
