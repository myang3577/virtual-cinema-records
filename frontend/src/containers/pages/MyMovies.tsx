import React, { useState, useEffect } from "react";
import MovieGrid from "../../components/MovieGrid";
import { useDispatch, useSelector } from "react-redux";
import { listMovies } from "../../actions/movieListActions";
import { GlobalState } from "../../reducers/rootReducer";
import {
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Slide,
  CircularProgress,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import RefreshIcon from "@material-ui/icons/Refresh";
import { LoadingState } from "../../reducers/tmdbReducer";
import { PageType } from "../../constants/General";
import NoLogin from "./NoLogin";
import { ENTER_KEYCODE } from "./Home";
import { MovieListElement } from "../../actions/userInfoActions";

function MyMovies() {
  const dispatch = useDispatch();
  const username = useSelector<GlobalState, string>(
    (state) => state.loginData.username
  );
  const isLoggedIn = useSelector<GlobalState, boolean>(
    (state) => state.loginData.isLoggedIn
  );
  const movieDataList = useSelector<GlobalState, any[]>(
    (state) => state.myMoviesData.movieDataList
  );
  const movieIDList = useSelector<GlobalState, MovieListElement[]>(
    (state) => state.myMoviesData.movieIDList
  );
  const movieListLoading = useSelector<GlobalState, LoadingState>(
    (state) => state.myMoviesData.loading
  );
  const userBlackList = useSelector<GlobalState, any[]>(
    (state) => state.blacklistData.blacklist
  );

  const [movieFilter, setMovieFilter] = useState("");
  const [filterMovieList, setFilterMovieList]: any = useState([]);

  useEffect(() => {
    if (isLoggedIn && username !== "") dispatch(listMovies(username));
  }, [dispatch, username, isLoggedIn]);

  useEffect(() => {
    setFilterMovieList(movieDataList);
  }, [movieDataList]);

  useEffect(() => {
    if (movieFilter.trim() !== "") {
      setFilterMovieList(
        movieDataList.filter((e: any) =>
          e.original_title.toLowerCase().includes(movieFilter.toLowerCase())
        )
      );
    } else {
      setFilterMovieList(movieDataList);
    }
  }, [movieFilter, movieDataList]);

  const handleSubmit = () => {
    if (movieFilter.trim() !== "") {
      setFilterMovieList(
        movieDataList.filter((e: any) =>
          e.original_title.toLowerCase().includes(movieFilter.toLowerCase())
        )
      );
    } else {
      setFilterMovieList(movieDataList);
    }
  };

  return (
    <Slide in={true} timeout={500} direction="up">
      <div className="page-container">
        {isLoggedIn ? (
          <div>
            <Typography variant="h4" gutterBottom>
              MyMovies
              <IconButton
                onClick={() => dispatch(listMovies(username))}
                size="small"
              >
                <RefreshIcon />
              </IconButton>
            </Typography>

            <TextField
              label="Filter MyMovies"
              variant={"outlined"}
              value={movieFilter}
              fullWidth
              disabled={
                !isLoggedIn || !movieDataList || movieDataList.length === 0
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleSubmit}>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              onChange={(e) => {
                setMovieFilter(e.target.value);
              }}
              onKeyDown={(e: any) => {
                if (e.keyCode === ENTER_KEYCODE) {
                  handleSubmit();
                }
              }}
              style={{
                marginBottom: "5px",
              }}
            />

            {movieListLoading === LoadingState.LOADING ? (
              <div className="loading-container">
                <Typography variant="h6" gutterBottom>
                  Loading MyMovies
                </Typography>
                <CircularProgress className="center" />
              </div>
            ) : movieDataList.length === 0 ? (
              <Typography variant="h5" gutterBottom>
                Add movies to view them here.
              </Typography>
            ) : (
              <MovieGrid
                displayMovieList={filterMovieList}
                loading={movieListLoading}
                userMyMoviesList={movieDataList}
                userMovieIDList={movieIDList}
                userBlackList={userBlackList}
                page={PageType.MY_MOVIES}
              />
            )}
          </div>
        ) : (
          <NoLogin />
        )}
      </div>
    </Slide>
  );
}

export default MyMovies;
