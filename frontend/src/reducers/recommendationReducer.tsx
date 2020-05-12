import { LoadingState } from "./tmdbReducer";
import {
  RecommendationActionType,
  RecommendationAction,
  MovieResultElement,
  GeneralRecommendationAction,
} from "../actions/recommendationActions";

export interface RecommendationListObject {
  [key: string]: MovieResultElement[];
}

export interface RecommendationState {
  loading: LoadingState;
  movieRecommendationList: RecommendationListObject;
  actorRecommendationList: RecommendationListObject;
  genreRecommendationList: RecommendationListObject;
  generalRecommendationList: RecommendationListObject;
}

const initialState: RecommendationState = {
  loading: LoadingState.IDLE,
  movieRecommendationList: {},
  actorRecommendationList: {},
  genreRecommendationList: {},
  generalRecommendationList: {
    "Now Playing": [],
    Popular: [],
    Upcoming: [],
    Action: [],
    Adventure: [],
    Animation: [],
    Comedy: [],
    Crime: [],
    Documentary: [],
    Drama: [],
    Family: [],
    Fantasy: [],
    History: [],
    Horror: [],
    Music: [],
    Mystery: [],
    Romance: [],
    "Science Fiction": [],
    "TV Movie": [],
    Thriller: [],
    War: [],
    Western: [],
  },
};

export const recommendationReducer = (
  state = initialState,
  action: RecommendationAction | GeneralRecommendationAction
): RecommendationState => {
  switch (action.type) {
    case RecommendationActionType.GET_RECOMMENDATION_BEGIN:
      return {
        ...state,
        loading: LoadingState.LOADING,
      };
    case RecommendationActionType.GET_MOVIE_RECOMMENDATION_END:
      return {
        ...state,
        loading: LoadingState.DONE,
        // Exclamation mark this tells typescript that it exists and is not
        // undefined. Mandatory for attributes that are conditional. See
        // recommendationActions.tsx and look at RecommendationAction -> payload
        // -> recommendationList.
        movieRecommendationList: (action as RecommendationAction).payload
          .recommendationList!,
      };
    case RecommendationActionType.GET_ACTOR_RECOMMENDATION_END:
      return {
        ...state,
        loading: LoadingState.DONE,
        actorRecommendationList: (action as RecommendationAction).payload
          .recommendationList!,
      };
    case RecommendationActionType.GET_GENRE_RECOMMENDATION_END:
      return {
        ...state,
        loading: LoadingState.DONE,
        genreRecommendationList: (action as RecommendationAction).payload
          .recommendationList!,
      };
    case RecommendationActionType.GET_GENERAL_RECOMMENDATION_END:
      return {
        ...state,
        loading: LoadingState.DONE,
        generalRecommendationList: {
          ...state.generalRecommendationList,
          [action.name!]: (action as GeneralRecommendationAction).payload
            .recommendationList!,
        },
      };
    case RecommendationActionType.CLEAR_RECOMMENDATION_DATA:
      return initialState;
    default:
      return state;
  }
};
