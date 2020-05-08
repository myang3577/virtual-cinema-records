import { LoadingState } from "./tmdbReducer";
import {
  RecommendationActionType,
  RecommendationAction,
  MovieResultElement,
} from "../actions/recommendationActions";

export interface RecommendationState {
  loading: LoadingState;
  movieRecommendationList: MovieResultElement[];
  actorRecommendationList: MovieResultElement[];
  genreRecommendationList: MovieResultElement[];
}

const initialState: RecommendationState = {
  loading: LoadingState.IDLE,
  movieRecommendationList: [],
  actorRecommendationList: [],
  genreRecommendationList: [],
};

export const recommendationReducer = (
  state = initialState,
  action: RecommendationAction
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
        movieRecommendationList: action.payload.recommendationList!,
      };
    case RecommendationActionType.GET_ACTOR_RECOMMENDATION_END:
      return {
        ...state,
        loading: LoadingState.DONE,
        actorRecommendationList: action.payload.recommendationList!,
      };
    case RecommendationActionType.GET_GENRE_RECOMMENDATION_END:
      return {
        ...state,
        loading: LoadingState.DONE,
        genreRecommendationList: action.payload.recommendationList!,
      };
    default:
      return state;
  }
};
