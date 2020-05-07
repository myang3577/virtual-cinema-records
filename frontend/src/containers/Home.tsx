import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { GlobalState } from "../reducers/rootReducer";
import MovieGrid from "../components/MovieGrid";
import { Typography } from "@material-ui/core";
import SearchBar from "./SearchBar";
import { LoadingState } from "../reducers/tmdbReducer";
import { setPageType, PageType } from "../actions/uiActions";

function Home() {
  const movieSearchResult: any = useSelector<GlobalState>(
    (state) => state.tmdbData.movieSearchResult
  );

  const movieDataLoading: any = useSelector<GlobalState, LoadingState>(
    (state) => state.tmdbData.loading
  );

  const dispatch = useDispatch();

  dispatch(setPageType(PageType.HOME));

  return (
    <div className="page-container">
      <Typography variant="h4" gutterBottom>
        Home
      </Typography>
      <SearchBar />
      <MovieGrid
        movieList={movieSearchResult.results}
        loading={movieDataLoading}
      />
    </div>
  );
}

export default Home;
