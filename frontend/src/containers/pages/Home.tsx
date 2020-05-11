import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GlobalState } from "../../reducers/rootReducer";
import MovieGrid from "../../components/MovieGrid";
import {
  Typography,
  Slide,
  TextField,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import { LoadingState } from "../../reducers/tmdbReducer";
import { listMovies } from "../../actions/movieListActions";
import { PageType } from "../../Constants";
import { getPopularMovies, searchMovies } from "../../actions/tmdbActions";

export const ENTER_KEYCODE = 13;

function Home() {
  const dispatch = useDispatch();

  const [movieQuery, setMovieQuery] = useState("");
  const [movieQueryDisplay, setMovieQueryDisplay] = useState("");

  // This is the actual movies that need to be rendered to the user
  const movieSearchResult = useSelector<GlobalState, any>(
    (state) => state.tmdbData.movieSearchResult
  );
  const popularMovies = useSelector<GlobalState, any>(
    (state) => state.tmdbData.popularMovies
  );

  // This just gets the user's movie list. It is not for rendering purposes.
  // Instead, it is used to indicate if a movie has been added or not
  const userMyMoviesList = useSelector<GlobalState, []>(
    (state) => state.movieListData.movieDataList
  );
  const movieDataLoading = useSelector<GlobalState, LoadingState>(
    (state) => state.tmdbData.loading
  );
  const isLoggedIn = useSelector<GlobalState, boolean>(
    (state) => state.loginData.isLoggedIn
  );
  const username = useSelector<GlobalState, string>(
    (state) => state.loginData.username
  );

  const loading: LoadingState = useSelector<GlobalState>(
    (state) => state.tmdbData.loading
  ) as LoadingState;

  useEffect(() => {
    if (isLoggedIn && username !== "") dispatch(listMovies(username));
  }, [dispatch, username, isLoggedIn]);

  useEffect(() => {
    dispatch(getPopularMovies());
  }, [dispatch]);

  const onSearchSubmit = () => {
    dispatch(searchMovies(movieQuery));
    setMovieQueryDisplay(movieQuery);
  };

  return (
    <Slide in={true} timeout={500} direction="up">
      <div className="page-container">
        <Typography variant="h4" gutterBottom>
          Home
        </Typography>
        <TextField
          label="Movie Search"
          variant={"outlined"}
          value={movieQuery}
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={onSearchSubmit}
                  disabled={loading === LoadingState.LOADING}
                >
                  {loading === LoadingState.LOADING ? (
                    <CircularProgress size={25} />
                  ) : (
                    <SearchIcon />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
          onChange={(e) => setMovieQuery(e.target.value)}
          onKeyDown={(e: React.KeyboardEvent) => {
            if (e.keyCode === ENTER_KEYCODE) {
              onSearchSubmit();
            }
          }}
          style={{
            marginBottom: "5px",
          }}
        />
        <Typography
          variant="h6"
          gutterBottom
          style={{ marginTop: "5px", marginBottom: "5px" }}
        >
          {movieSearchResult.results
            ? 'Showing results for "' + movieQueryDisplay + '"'
            : "Popular movies"}
        </Typography>
        <MovieGrid
          displayMovieList={
            movieSearchResult.results
              ? movieSearchResult.results
              : popularMovies.results
          }
          loading={movieDataLoading}
          userMyMoviesList={userMyMoviesList}
          page={PageType.HOME}
        />
      </div>
    </Slide>
  );
}

export default Home;
