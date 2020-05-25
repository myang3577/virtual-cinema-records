import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GlobalState } from "../../reducers/rootReducer";
import { Typography, IconButton, Slide, Link } from "@material-ui/core";
import RefreshIcon from "@material-ui/icons/Refresh";
import { LoadingState } from "../../reducers/tmdbReducer";
import { listMovies } from "../../actions/movieListActions";
import SimpleListMenu from "../../components/DropdownMenu";
import { genreMap } from "../../constants/Recommendation";
import {
  getMovieRecommendation,
  getActorRecommendation,
  getGenreRecommendation,
  getGeneralRecommendation,
  getSpecificRecommendation,
} from "../../actions/recommendationActions";
import { PageType } from "../../constants/General";
import { RecommendationListObject } from "../../reducers/recommendationReducer";
import {
  openAccountModal,
  setAccountModalContent,
  AccountModalContent,
} from "../../actions/uiActions";
import RecommendationSection from "../../components/RecommendationSection";
import { MovieListElement } from "../../actions/userInfoActions";
import { CodeSharp } from "@material-ui/icons";
import { getBlacklist } from "../../actions/blacklistAction";
const isEmpty = (object: {}) => Object.keys(object).length === 0;

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
  const userMyMoviesList = useSelector<GlobalState, any[]>(
    (state) => state.myMoviesData.movieDataList
  );

  const movieDataLoading = useSelector<GlobalState, LoadingState>(
    (state) => state.tmdbData.loading
  );
  const userListDataLoading = useSelector<GlobalState, LoadingState>(
    (state) => state.myMoviesData.listDataLoading
  );
  const isLoggedIn = useSelector<GlobalState, boolean>(
    (state) => state.loginData.isLoggedIn
  );
  const username = useSelector<GlobalState, string>(
    (state) => state.loginData.username
  );

  const userMovieIDList = useSelector<GlobalState, MovieListElement[]>(
    (state) => state.myMoviesData.movieIDList
  );

  const userBlackListDataLoading = useSelector<GlobalState, LoadingState>(
    (state) => state.blacklistData.loading
  );
  const userBlackList = useSelector<GlobalState, any[]>(
    (state) => state.blacklistData.blacklist
  );

  // Flags used to indicate which movies the user wants to view. True to view,
  // false to hide
  const [genreToDisplay, setGenreToDisplay]: [
    { [key: string]: boolean },
    any
  ] = useState({
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

  const [recommendationToDisplay, setRecommendationToDisplay]: [
    { [key: string]: boolean },
    any
  ] = useState({});

  useEffect(() => {
    if (isLoggedIn && username !== "") {
      dispatch(listMovies(username));
      dispatch(getBlacklist(username));
      if (isEmpty(movieRecommendationResult)) {
        dispatch(getMovieRecommendation(username));
      }
      if (isEmpty(actorRecommendationResult)) {
        dispatch(getActorRecommendation(username));
      }
      if (isEmpty(genreRecommendationResult)) {
        dispatch(getGenreRecommendation(username));
      }

      // Add the extra genre options here
      setRecommendationToDisplay({
        ...recommendationToDisplay,
        "Movie Recommendation": true,
        "Actor Recommendation": true,
        "Genre Recommendation": true,
      });

      // Get the general recommendations again because some may be filtered out
      // we have blacklist information
      // dispatch(getGeneralRecommendation(userMyMoviesList, userBlackList));
    } else {
      // Clear the peresonal recommendation options
      let clearGenreObject = Object.assign({}, recommendationToDisplay);
      delete clearGenreObject["Movie Recommendation"];
      delete clearGenreObject["Actor Recommendation"];
      delete clearGenreObject["Genre Recommendation"];
      setRecommendationToDisplay(clearGenreObject);
    }
    if (
      generalRecommendationList["Now Playing"].length === 0 ||
      generalRecommendationList.Popular.length === 0 ||
      generalRecommendationList.Upcoming.length === 0
    ) {
      dispatch(getGeneralRecommendation(userMyMoviesList, userBlackList));
    }
    // eslint-disable-next-line
  }, [dispatch, username, isLoggedIn]);

  useEffect(() => {
    if (
      isLoggedIn &&
      userListDataLoading === LoadingState.DONE &&
      userBlackListDataLoading === LoadingState.DONE
    ) {
      refreshGeneralRecommendation();
    }

    //   // eslint-disable-next-line
  }, [isLoggedIn, userListDataLoading, userBlackListDataLoading]);

  // Note: This is NOT what is defined as refresh in the use case document.
  // Currently this code is written to NOT get a new set of recommendations
  // every time the page is reloaded. Instead, just use the one from the store.
  // This refresh is only useful when the user updates or adds a movie/ranking.
  // then the refresh may generate a new list. Once again, THIS IS NOT REFRESH
  // RECOMMENDATIONS.
  const refreshGeneralRecommendation = (): void => {
    dispatch(getGeneralRecommendation(userMyMoviesList, userBlackList));
  };

  const refreshAll = (): void => {
    dispatch(getMovieRecommendation(username));
    dispatch(getActorRecommendation(username));
    dispatch(getGenreRecommendation(username));
    dispatch(getGeneralRecommendation(userMyMoviesList, userBlackList));
  };

  const renderMovieRecommendation = (
    // Represents an object where the keys are the movie/actor/genre,
    // and the value is an array holding objects containing all the movie recommended info
    recommendationResult: any,
    recommendationType: string
  ): any[] => {
    if (movieDataLoading !== LoadingState.LOADING && recommendationResult) {
      return Object.keys(recommendationResult).map(
        (keyName: any, keyIndex: number) => {
          if (
            recommendationResult[keyName].length !== 0 &&
            recommendationToDisplay[recommendationType] !== false
          ) {
            return (
              <RecommendationSection
                header={"Because you liked " + keyName}
                displayMovieList={recommendationResult[keyName]}
                loading={movieDataLoading}
                userMyMoviesList={userMyMoviesList}
                userBlackList={userBlackList}
                userMovieIDList={userMovieIDList}
                page={PageType.RECOMMENDATIONS}
                key={keyIndex}
              />
            );
          }
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
          // console.log(recommendationResult);
          if (
            recommendationResult[keyName].length !== 0 &&
            genreToDisplay[keyName] !== false
          ) {
            return (
              <RecommendationSection
                header={keyName}
                displayMovieList={recommendationResult[keyName]}
                loading={movieDataLoading}
                userMyMoviesList={userMyMoviesList}
                userBlackList={userBlackList}
                userMovieIDList={userMovieIDList}
                page={PageType.RECOMMENDATIONS}
                key={keyIndex}
              />
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
      if (
        event.target.name === "Movie Recommendation" ||
        event.target.name === "Actor Recommendation" ||
        event.target.name === "Genre Recommendation"
      ) {
        setRecommendationToDisplay({
          ...recommendationToDisplay,
          [event.target.name]: true,
        });
      } else if (generalRecommendationList[event.target.name].length === 0) {
        dispatch(
          getSpecificRecommendation(
            genreMap[event.target.name].id,
            event.target.name,
            userMyMoviesList,
            userBlackList
          )
        );
        setGenreToDisplay({ ...genreToDisplay, [event.target.name]: true });
      }

      // Then set the genre or recommendation to be displayed
    }

    // Otherwise set the flag to not display
    else {
      if (
        event.target.name === "Movie Recommendation" ||
        event.target.name === "Actor Recommendation" ||
        event.target.name === "Genre Recommendation"
      ) {
        setRecommendationToDisplay({
          ...recommendationToDisplay,
          [event.target.name]: false,
        });
      } else {
        setGenreToDisplay({ ...genreToDisplay, [event.target.name]: false });
      }
    }
  };

  return (
    <Slide in={true} timeout={500} direction="up">
      <div className="page-container">
        <Typography variant="h4" gutterBottom>
          Recommendations
          <IconButton onClick={refreshAll} size="small">
            <RefreshIcon />
          </IconButton>
          <SimpleListMenu
            handlerFunction={handleChange}
            genreToDisplay={genreToDisplay}
            recommendationToDisplay={recommendationToDisplay}
          />
        </Typography>
        {isLoggedIn &&
          isEmpty(movieRecommendationResult) &&
          isEmpty(actorRecommendationResult) &&
          isEmpty(genreRecommendationResult) && (
            <Typography variant="h6" gutterBottom>
              Rate more movies to get personalized recommendations.
            </Typography>
          )}
        {!isLoggedIn && (
          <Typography variant="h6" gutterBottom>
            <Link
              component="button"
              variant="h6"
              onClick={() => {
                dispatch(setAccountModalContent(AccountModalContent.LOGIN));
                dispatch(openAccountModal());
              }}
            >
              Log in
            </Link>{" "}
            to get personalized recommendations.
          </Typography>
        )}
        {Object.keys(movieRecommendationResult).length !== 0
          ? renderMovieRecommendation(
              movieRecommendationResult,
              "Movie Recommendation"
            )
          : []}
        {Object.keys(actorRecommendationResult).length !== 0
          ? renderMovieRecommendation(
              actorRecommendationResult,
              "Actor Recommendation"
            )
          : []}
        {Object.keys(genreRecommendationResult).length !== 0
          ? renderMovieRecommendation(
              genreRecommendationResult,
              "Genre Recommendation"
            )
          : []}
        {renderGeneralRecommendation(generalRecommendationList)}
      </div>
    </Slide>
  );
}

export default Recommendations;
