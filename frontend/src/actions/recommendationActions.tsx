import { Dispatch } from "redux";
import { apiKey } from "./tmdbActions";
import { ErrorOutline } from "@material-ui/icons";

export enum RecommendationActionType {
  GET_RECOMMENDATION_BEGIN = "GET_RECOMMENDATION_BEGIN",
  GET_MOVIE_RECOMMENDATION_END = "GET_MOVIE_RECOMMENDATION_END",
  GET_ACTOR_RECOMMENDATION_END = "GET_ACTOR_RECOMMENDATION_END",
  GET_GENRE_RECOMMENDATION_END = "GET_GENRE_RECOMMENDATION_END",
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

export const getRecommendationEnd = (
  payload: MovieResultElement[],
  recommendationType: string
): RecommendationAction => {
  switch (recommendationType) {
    case "movie":
      return {
        type: RecommendationActionType.GET_MOVIE_RECOMMENDATION_END,
        payload: {
          recommendationList: payload,
        },
      };
    case "actor":
      return {
        type: RecommendationActionType.GET_ACTOR_RECOMMENDATION_END,
        payload: {
          recommendationList: payload,
        },
      };
    case "genre":
      return {
        type: RecommendationActionType.GET_GENRE_RECOMMENDATION_END,
        payload: {
          recommendationList: payload,
        },
      };
    // Default statement that should never execute.
    default:
      throw new Error(
        "invalid movie category case encountered. " +
          recommendationType +
          " does not currently exist as a category used to provide recommendations"
      );
  }
};

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
    .then((json: MovieResultElement[]) => {
      dispatch(getRecommendationEnd(json, recommendationType));
    })
    .catch((error) => console.log("An error occurred.", error));
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
