import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GlobalState } from "../../reducers/rootReducer";
import MovieGrid from "../../components/MovieGrid";
import { Typography, IconButton, Slide } from "@material-ui/core";
import RefreshIcon from "@material-ui/icons/Refresh";
import { LoadingState } from "../../reducers/tmdbReducer";
import { listMovies } from "../../actions/movieListActions";
import SimpleListMenu from "../../components/DropdownMenu";
import { GenreItem, genreMap } from "./Constants";
import {
  getMovieRecommendation,
  getActorRecommendation,
  getGenreRecommendation,
  MovieResultElement,
  getGeneralRecommendation,
  getSpecificRecommendation,
} from "../../actions/recommendationActions";
import { PageType } from "../../Constants";
import { RecommendationListObject } from "../../reducers/recommendationReducer";
import { Movie } from "@material-ui/icons";

const isEmpty = (object: {}) => Object.keys(object).length === 0;

// interface MovieGridProps {
//   displayMovieList: [];
//   userMyMoviesList: [];
//   loading: LoadingState;
//   page: PageType;
// }

// const NUM_ELEMENTS_PER_ROW = 4;

function Recommendations() {
  const dispatch = useDispatch();

  // This is movie recommendations that need to be rendered to the user on the
  // gridlist
  const movieRecommendationResult = useSelector<
    GlobalState,
    RecommendationListObject
  >((state) => state.recommendationData.movieRecommendationList);

  // This is actor recommendations that need to be rendered to the user on the
  // gridlist
  const actorRecommendationResult = useSelector<
    GlobalState,
    RecommendationListObject
  >((state) => state.recommendationData.actorRecommendationList);

  // This is genre recommendations that need to be rendered to the user on the
  // gridlist
  const genreRecommendationResult = useSelector<
    GlobalState,
    RecommendationListObject
  >((state) => state.recommendationData.genreRecommendationList);

  // This is general recommendations. They are not specific to the user
  const generalRecommendationList = useSelector<
    GlobalState,
    RecommendationListObject
  >((state) => state.recommendationData.generalRecommendationList);

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

  // Flags used to indicate which movies the user wants to view. True to view,
  // false to hide
  const [genreToDisplay, setGenreToDisplay]: [any, any] = useState({
    "Now Playing": true,
    Popular: true,
    Upcoming: true,
    Action: false,
    Adventure: false,
    Animation: false,
    Comedy: false,
    Crime: false,
    Documentary: false,
    Drama: false,
    Family: false,
    Fantasy: false,
    History: false,
    Horror: false,
    Music: false,
    Mystery: false,
    Romance: false,
    "Science Fiction": false,
    "TV Movie": false,
    Thriller: false,
    War: false,
    Western: false,
  });

  useEffect(() => {
    if (isLoggedIn && username !== "") {
      dispatch(listMovies(username));
      if (isEmpty(movieRecommendationResult)) {
        dispatch(getMovieRecommendation(username));
      }
      if (isEmpty(actorRecommendationResult)) {
        dispatch(getActorRecommendation(username));
      }
      if (isEmpty(genreRecommendationResult)) {
        dispatch(getGenreRecommendation(username));
      }
    } else {
      if (
        generalRecommendationList["Now Playing"].length === 0 ||
        generalRecommendationList.Popular.length === 0 ||
        generalRecommendationList.Upcoming.length === 0
      ) {
        dispatch(getGeneralRecommendation());
      }
    }
    // eslint-disable-next-line
  }, [dispatch, username, isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) refreshRecommendations();
    // eslint-disable-next-line
  }, [isLoggedIn, userMyMoviesList]);

  // Note: This is NOT what is defined as refresh in the use case document.
  // Currently this code is written to NOT get a new set of recommendations
  // every time the page is reloaded. Instead, just use the one from the store.
  // This refresh is only useful when the user updates or adds a movie/ranking.
  // then the refresh may generate a new list. Once again, THIS IS NOT REFRESH
  // RECOMMENDATIONS.
  const refreshRecommendations = (): void => {
    dispatch(getMovieRecommendation(username));
    dispatch(getActorRecommendation(username));
    dispatch(getGenreRecommendation(username));
  };

  const renderMovieRecommendation = (recommendationResult: any): any[] => {
    if (movieDataLoading !== LoadingState.LOADING && recommendationResult) {
      return Object.keys(recommendationResult).map(
        (keyName: any, keyIndex: number) => {
          return (
            <div key={keyIndex}>
              <h2>Because you liked {keyName}</h2>
              <MovieGrid
                displayMovieList={recommendationResult[keyName]}
                loading={movieDataLoading}
                userMyMoviesList={userMyMoviesList}
                page={PageType.HOME}
              />
            </div>
          );
        }
      );
    } else {
      return [];
    }
  };

  // Renders the general recommendations.
  const renderGeneralRecommendation = (recommendationResult: any): any[] => {
    if (movieDataLoading !== LoadingState.LOADING && recommendationResult) {
      return Object.keys(recommendationResult).map(
        (keyName: string, keyIndex: number) => {
          if (
            recommendationResult[keyName] !== 0 &&
            genreToDisplay[keyName] !== false
          ) {
            return (
              <div key={keyIndex}>
                <h1>{keyName}</h1>
                <MovieGrid
                  displayMovieList={recommendationResult[keyName]}
                  loading={movieDataLoading}
                  userMyMoviesList={userMyMoviesList}
                  page={PageType.HOME}
                />
              </div>
            );
          }
        }
      );
    } else {
      return [];
    }
  };

  // Allows the user to choose what genres they want to see
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    // If it is now checked, call the api and load the movie information
    if (event.target.checked) {
      // If no data, make the API call
      if (generalRecommendationList[event.target.name].length === 0) {
        dispatch(
          getSpecificRecommendation(
            genreMap[event.target.name].id,
            event.target.name
          )
        );
      }
      setGenreToDisplay({ ...genreToDisplay, [event.target.name]: true });
    }

    // Otherwise set the flag to not display
    else {
      setGenreToDisplay({ ...genreToDisplay, [event.target.name]: false });
    }
  };

  return (
    <Slide in={true} timeout={500} direction="up">
      <div className="page-container">
        <Typography variant="h4" gutterBottom>
          Recommendations
          <IconButton onClick={refreshRecommendations} size="small">
            <RefreshIcon />
          </IconButton>
          <SimpleListMenu handlerFunction={handleChange} />
        </Typography>
        {/* <SearchBar /> */}
        {isLoggedIn &&
          isEmpty(movieRecommendationResult) &&
          isEmpty(actorRecommendationResult) &&
          isEmpty(genreRecommendationResult) && (
            <Typography variant="h5" gutterBottom>
              Rate more movies to get recommendations.
            </Typography>
          )}

        {renderMovieRecommendation(movieRecommendationResult)}
        {renderMovieRecommendation(actorRecommendationResult)}
        {renderMovieRecommendation(genreRecommendationResult)}
        {renderGeneralRecommendation(generalRecommendationList)}
      </div>
    </Slide>
  );
}

export default Recommendations;
