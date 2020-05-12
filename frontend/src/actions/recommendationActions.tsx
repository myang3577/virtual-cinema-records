import { Dispatch, Action } from "redux";
import { RecommendationListObject } from "../reducers/recommendationReducer";
import { apiKey } from "./tmdbActions";

export enum RecommendationActionType {
  GET_RECOMMENDATION_BEGIN = "GET_RECOMMENDATION_BEGIN",
  GET_MOVIE_RECOMMENDATION_END = "GET_MOVIE_RECOMMENDATION_END",
  GET_ACTOR_RECOMMENDATION_END = "GET_ACTOR_RECOMMENDATION_END",
  GET_GENRE_RECOMMENDATION_END = "GET_GENRE_RECOMMENDATION_END",
  GET_GENERAL_RECOMMENDATION_END = "GET_GENERAL_RECOMMENDATION_END",
  CLEAR_RECOMMENDATION_DATA = "CLEAR_RECOMMENDATION_DATA",
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
const fetchGeneralRecommendation = (dispatch: Dispatch) => {
  fetch(
    "https://api.themoviedb.org/3/movie/now_playing?api_key=" +
      apiKey +
      "&language=en-US&page=1"
  )
    .then((response) => response.json())
    .then((json) => {
      dispatch(getRecommendationEnd(json.results, "general", "Now Playing"));
    })
    .catch((error) => {
      console.log("An error occurred. Could not fetch Now Playing", error);
    });
  fetch(
    "https://api.themoviedb.org/3/movie/popular?api_key=" +
      apiKey +
      "&language=en-US&page=1"
  )
    .then((response) => response.json())
    .then((json) => {
      dispatch(getRecommendationEnd(json.results, "general", "Popular"));
    })
    .catch((error) => {
      console.log(
        "An error occurred. Could not fetch general recommendations",
        error
      );
    });
  fetch(
    "https://api.themoviedb.org/3/movie/upcoming?api_key=" +
      apiKey +
      "&language=en-US&page=1&region=US"
  )
    .then((response) => response.json())
    .then((json) => {
      dispatch(getRecommendationEnd(json.results, "general", "Upcoming"));
    })
    .catch((error) => {
      console.log(
        "An error occurred. Could not fetch general recommendations",
        error
      );
    });
};

// Fetches a specific genre recommendation
const fetchSpecificRecommmendation = (
  dispatch: Dispatch,
  id: number,
  name: string
) => {
  return fetch(
    "https://api.themoviedb.org/3/discover/movie?api_key=" +
      apiKey +
      "&with_genres=" +
      id
  )
    .then((response) => response.json())
    .then((json) => {
      dispatch(getRecommendationEnd(json.results, "general", name));
    })
    .catch((error) => {
      console.log(
        "An error occurred. Could not fetch specific recommendations",
        error
      );
    });
};

export const getMovieRecommendation = (email: string) => {
  return (dispatch: Dispatch) => {
    dispatch(getRecommendationBegin());
    return fetchRecommendation(dispatch, email, "movie");
  };
};

export const getActorRecommendation = (email: string) => {
  return (dispatch: Dispatch) => {
    dispatch(getRecommendationBegin());
    return fetchRecommendation(dispatch, email, "actor");
  };
};

export const getGenreRecommendation = (email: string) => {
  return (dispatch: Dispatch) => {
    dispatch(getRecommendationBegin());
    return fetchRecommendation(dispatch, email, "genre");
  };
};

export const getGeneralRecommendation = () => {
  return (dispatch: Dispatch) => {
    dispatch(getRecommendationBegin());
    return fetchGeneralRecommendation(dispatch);
  };
};

export const getSpecificRecommendation = (id: number, name: string) => {
  return (dispatch: Dispatch) => {
    dispatch(getRecommendationBegin());
    return fetchSpecificRecommmendation(dispatch, id, name);
  };
};
