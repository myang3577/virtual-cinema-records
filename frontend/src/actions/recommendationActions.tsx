import { Dispatch, Action } from "redux";
import { RecommendationListObject } from "../reducers/recommendationReducer";
// import { useSelector, useDispatch } from "react-redux";
// import { GlobalState } from "../reducers/rootReducer";
import {
  NUM_GENERAL_RECOMMENDATIONS,
  MAX_PAGE_SEARCH_LIMIT,
} from "../constants/Recommendation";
import { apiKey } from "./tmdbActions";

export enum RecommendationActionType {
  GET_RECOMMENDATION_BEGIN = "GET_RECOMMENDATION_BEGIN",
  GET_MOVIE_RECOMMENDATION_END = "GET_MOVIE_RECOMMENDATION_END",
  GET_ACTOR_RECOMMENDATION_END = "GET_ACTOR_RECOMMENDATION_END",
  GET_GENRE_RECOMMENDATION_END = "GET_GENRE_RECOMMENDATION_END",
  GET_GENERAL_RECOMMENDATION_END = "GET_GENERAL_RECOMMENDATION_END",
  CLEAR_RECOMMENDATION_DATA = "CLEAR_RECOMMENDATION_DATA",
  HIDE_BLACKLIST = "HIDE_BLACKLIST",
  UNHIDE_BLACKLIST = "UNHIDE_BLACKLIST",
}

// Represents all of the data that will be sent back by the recommmendation
// backend api
export interface MovieResultElement {
  adult: boolean;
  backdrop_path: string;
  belongs_to_collection: {
    id: string;
    name: string;
    poster_path: string;
    backdrop_path: string;
  };
  budget: number;
  genres: { id: number; name: string }[];
  homepage: string;
  id: number;
  imdb_id: string;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: {
    id: number;
    logo_path: string;
    name: string;
    origin_country: string;
  }[];
  production_countries: { iso_3166_1: string; name: string }[];
  release_date: string;
  revenue: number;
  runtime: number;
  spoken_languages: { iso_639_1: string; name: string }[];
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface RecommendationAction {
  type: RecommendationActionType;
  name?: string;
  tmdb_id?: number;
  payload: {
    recommendationList?: RecommendationListObject;
  };
}

export interface GeneralRecommendationAction {
  type: RecommendationActionType;
  name?: string;
  payload: {
    recommendationList?: MovieResultElement[];
  };
}

export const getRecommendationBegin = (): RecommendationAction => {
  return {
    type: RecommendationActionType.GET_RECOMMENDATION_BEGIN,
    payload: {},
  };
};

export const clearRecommendationData = (): Action => {
  return {
    type: RecommendationActionType.CLEAR_RECOMMENDATION_DATA,
  };
};

export const hideMovieAction = (tmdb_id: number): RecommendationAction => {
  return {
    type: RecommendationActionType.HIDE_BLACKLIST,
    tmdb_id: tmdb_id,
    payload: {},
  };
};

export const unhideMovieAction = (tmdb_id: number): RecommendationAction => {
  return {
    type: RecommendationActionType.UNHIDE_BLACKLIST,
    tmdb_id: tmdb_id,
    payload: {},
  };
};

export const getRecommendationEnd = (
  payload: RecommendationListObject,
  recommendationType: string,
  recommendationName?: string
): RecommendationAction => {
  // Create an action variable to reduce the number of lines in case statements.
  // Because TS doesn't let setting type to undefined, it is default set and
  // will be overrided
  let action: RecommendationAction = {
    type: RecommendationActionType.GET_MOVIE_RECOMMENDATION_END,
    payload: { recommendationList: payload },
  };
  switch (recommendationType) {
    case "movie":
      action.type = RecommendationActionType.GET_MOVIE_RECOMMENDATION_END;
      return action;
    case "actor":
      action.type = RecommendationActionType.GET_ACTOR_RECOMMENDATION_END;
      return action;
    case "genre":
      action.type = RecommendationActionType.GET_GENRE_RECOMMENDATION_END;
      return action;
    case "general":
      action.type = RecommendationActionType.GET_GENERAL_RECOMMENDATION_END;
      action.name = recommendationName;
      return action;
    // Default statement that should never execute.
    default:
      throw new Error(
        "invalid movie category case encountered. " +
          recommendationType +
          " does not currently exist as a category used to provide recommendations"
      );
  }
};

// Fetches the user recommendation
const fetchRecommendation = (
  dispatch: Dispatch,
  email: string,
  recommendationType: string
) => {
  return fetch("/users/" + email + "/" + recommendationType + "-recommendation")
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw Error("Error occurred, status: " + response.status);
      }
    })
    .then((json: RecommendationListObject) => {
      dispatch(getRecommendationEnd(json, recommendationType));
    })
    .catch((error) => console.log("An error occurred.", error));
};

// Fetches the general recommendation of now playing, popular, and upcoming
// movies. Differs from fetchRecommendation because the returned json.result
// is an array and not an object.
const fetchGeneralRecommendation = (
  dispatch: Dispatch,
  userMyMoviesList: MovieResultElement[],
  userBlackList: MovieResultElement[]
) => {
  let userIdArray = userMyMoviesList.map(
    (movie: MovieResultElement) => movie.id
  );

  let userBlacklistIdArray = userBlackList.map(
    (movie: MovieResultElement) => movie.id
  );

  fetchSpecificRecommmendation(
    "https://api.themoviedb.org/3/movie/now_playing?api_key=" +
      apiKey +
      "&language=en-US&page=",
    dispatch,
    userIdArray,
    userBlacklistIdArray,
    "Now Playing"
  );

  fetchSpecificRecommmendation(
    "https://api.themoviedb.org/3/movie/popular?api_key=" +
      apiKey +
      "&language=en-US&page=",
    dispatch,
    userIdArray,
    userBlacklistIdArray,
    "Popular"
  );

  fetchSpecificRecommmendation(
    "https://api.themoviedb.org/3/movie/upcoming?api_key=" +
      apiKey +
      "&language=en-US&region=US&page=",
    dispatch,
    userIdArray,
    userBlacklistIdArray,
    "Upcoming"
  );
};

// Fetches a specific genre recommendation that also filters out movie in the
// user's list
const fetchSpecificRecommmendation = async (
  apiEndpoint: string,
  dispatch: Dispatch,
  userIdArray: number[],
  userBlacklistIdArray: number[],
  name: string
) => {
  // Resultant array that will hold all of filtered recommendations
  let resultArray: any = [];

  // Which page to start the recommendation from
  let currPage: number = 1;

  while (resultArray.length < NUM_GENERAL_RECOMMENDATIONS) {
    try {
      // console.log(apiEndpoint + currPage);
      await fetch(apiEndpoint + currPage)
        .then((response) => response.json())
        .then((json) => {
          // console.log(json);
          json.results.forEach((movie: MovieResultElement) => {
            // If the movie is not in the user's movie list and the list is not full, then add it
            if (
              !userIdArray.includes(movie.id) &&
              !userBlacklistIdArray.includes(movie.id) &&
              resultArray.length < NUM_GENERAL_RECOMMENDATIONS
            ) {
              // console.log("Adding movie");
              resultArray.push(movie);
            }
          });
          currPage++;
        })
        .catch((error) => {
          throw new Error(error);
        });
    } catch (err) {
      console.log(
        "An error occurred. Could not fetch " + name + " recommendations",
        err
      );
      break;
    }

    if (currPage > MAX_PAGE_SEARCH_LIMIT) {
      break;
    }
  }

  dispatch(getRecommendationEnd(resultArray, "general", name));
};

// Entry point to get the user's personal recommendations for movies
export const getMovieRecommendation = (email: string) => {
  return (dispatch: Dispatch) => {
    dispatch(getRecommendationBegin());
    return fetchRecommendation(dispatch, email, "movie");
  };
};

// Entry point to get the user's personal recommendations for actors
export const getActorRecommendation = (email: string) => {
  return (dispatch: Dispatch) => {
    dispatch(getRecommendationBegin());
    return fetchRecommendation(dispatch, email, "actor");
  };
};

// Entry point to get the user's personal recommendations for genres
export const getGenreRecommendation = (email: string) => {
  return (dispatch: Dispatch) => {
    dispatch(getRecommendationBegin());
    return fetchRecommendation(dispatch, email, "genre");
  };
};

// Entry point to get general personal recommendations
export const getGeneralRecommendation = (
  userMyMoviesList: MovieResultElement[],
  userBlackList: MovieResultElement[]
) => {
  return (dispatch: Dispatch) => {
    dispatch(getRecommendationBegin());
    return fetchGeneralRecommendation(
      dispatch,
      userMyMoviesList,
      userBlackList
    );
  };
};

// Entry point to get specific genre recommendations
export const getSpecificRecommendation = (
  id: number,
  name: string,
  userMyMoviesList: MovieResultElement[],
  userBlackList: MovieResultElement[]
) => {
  return (dispatch: Dispatch) => {
    dispatch(getRecommendationBegin());
    let userIdArray = userMyMoviesList.map(
      (movie: MovieResultElement) => movie.id
    );

    let userBlacklistIdArray = userBlackList.map(
      (movie: MovieResultElement) => movie.id
    );
    return fetchSpecificRecommmendation(
      "https://api.themoviedb.org/3/discover/movie?api_key=" +
        apiKey +
        "&with_genres=" +
        id +
        "&page=",
      dispatch,
      userIdArray,
      userBlacklistIdArray,
      name
    );
  };
};

export const hideMovie = (tmdb_id: number) => {
  return (dispatch: Dispatch) => {
    dispatch(hideMovieAction(tmdb_id));
  };
};

export const unhideMovie = (tmdb_id: number) => {
  return (dispatch: Dispatch) => {
    dispatch(unhideMovieAction(tmdb_id));
  };
};
