import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GlobalState } from "../reducers/rootReducer";
import InputBase, { Input, InputAdornment } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import LoadingButton from "../components/LoadingButton";
import { searchMovies } from "../actions/actions";
import { LoadingState } from "../reducers/otherReducer";
// This defines the look of the searchbar

function SearchBar() {
  const dispatch = useDispatch();
  const [movieQuery, setMovieQuery] = useState("");

  const loading: LoadingState = useSelector<GlobalState>(
    (state) => state.otherData.loading
  ) as LoadingState;

  return (
    <Input
      placeholder="Search for a movie..."
      endAdornment={
        <InputAdornment position="end">
          <LoadingButton
            onClick={() => {
              dispatch(searchMovies(movieQuery));
            }}
            loading={loading === LoadingState.LOADING}
          >
            <SearchIcon />
          </LoadingButton>
        </InputAdornment>
      }
      value={movieQuery}
      onChange={(e) => setMovieQuery(e.target.value)}
    />
  );
}

export default SearchBar;
