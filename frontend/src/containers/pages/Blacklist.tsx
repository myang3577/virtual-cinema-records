import React, { useState, useEffect } from "react";
import MovieGrid from "../../components/MovieGrid";
import { useSelector, useDispatch } from "react-redux";
import { GlobalState } from "../../reducers/rootReducer";
import { getBlacklist } from "../../actions/blacklistAction";
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
import { MovieResultElement } from "../../actions/recommendationActions";

function Blacklist() {
  const dispatch = useDispatch();
  const username = useSelector<GlobalState, string>(
    (state) => state.loginData.username
  );
  const isLoggedIn = useSelector<GlobalState, boolean>(
    (state) => state.loginData.isLoggedIn
  );
  const blacklist = useSelector<GlobalState, []>(
    (state) => state.blacklistData.blacklist
  );
  const blacklistIdArray: MovieListElement[] = blacklist.map(
    (element: MovieResultElement) => {
      return { tmdb_id: element.id, rating: 0 };
    }
  );
  const blacklistLoading = useSelector<GlobalState, LoadingState>(
    (state) => state.blacklistData.loading
  );

  const [movieFilter, setMovieFilter] = useState("");
  const [filterMovieList, setFilterMovieList]: any = useState([]);

  useEffect(() => {
    if (isLoggedIn && username !== "") dispatch(getBlacklist(username));
  }, [dispatch, username, isLoggedIn]);

  useEffect(() => {
    setFilterMovieList(blacklist);
  }, [blacklist]);

  useEffect(() => {
    if (movieFilter.trim() !== "") {
      setFilterMovieList((filterMovieList: any) =>
        filterMovieList.filter((e: any) =>
          e.original_title.toLowerCase().includes(movieFilter)
        )
      );
    } else {
      setFilterMovieList(blacklist);
    }
  }, [movieFilter, blacklist]);

  const handleSubmit = () => {
    if (movieFilter.trim() !== "") {
      setFilterMovieList(
        filterMovieList.filter((e: any) =>
          e.original_title.toLowerCase().includes(movieFilter)
        )
      );
    } else {
      setFilterMovieList(blacklist);
    }
  };

  return (
    <Slide in={true} timeout={500} direction="up">
      <div className="page-container">
        {isLoggedIn ? (
          <div>
            <Typography variant="h4" gutterBottom>
              Blacklist
              <IconButton
                onClick={() => dispatch(getBlacklist(username))}
                size="small"
              >
                <RefreshIcon />
              </IconButton>
            </Typography>

            <TextField
              label="Filter Blacklist"
              variant={"outlined"}
              value={movieFilter}
              fullWidth
              disabled={!isLoggedIn || !blacklist || blacklist.length === 0}
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
                setMovieFilter(e.target.value.toLowerCase());
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

            {blacklistLoading === LoadingState.LOADING ? (
              <CircularProgress />
            ) : blacklist.length === 0 ? (
              <Typography variant="h5" gutterBottom>
                Blacklist movies to view them here.
              </Typography>
            ) : (
              <MovieGrid
                displayMovieList={filterMovieList}
                loading={blacklistLoading}
                userBlackList={blacklist}
                userMyMoviesList={blacklist}
                userMovieIDList={blacklistIdArray}
                page={PageType.BLACKLIST}
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

export default Blacklist;
