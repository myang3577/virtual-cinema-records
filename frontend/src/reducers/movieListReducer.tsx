import { LoadingState } from "./tmdbReducer";
import {
  MovieListActionType,
  MovieListAction,
  RatingUpdateAction,
  SetMovieDataListAction,
} from "../actions/movieListActions";
import { MovieListElement } from "../actions/userInfoActions";

export interface MovieListState {
  loading: LoadingState;
  listDataLoading: LoadingState;
  movieIDList: MovieListElement[];
  movieDataList: any[];
  ratingLoadingStatus: {
    [key: string]: LoadingState;
  };
}

const initialState: MovieListState = {
  loading: LoadingState.IDLE,
  listDataLoading: LoadingState.IDLE,
  movieIDList: [],
  movieDataList: [],
  ratingLoadingStatus: {},
};

export const movieListReducer = (
  state = initialState,
  action: MovieListAction | SetMovieDataListAction | RatingUpdateAction
): MovieListState => {
  switch (action.type) {
    case MovieListActionType.PUT_RATING_BEGIN: {
      let newMovieIDList = state.movieIDList;
      let movieIndex = state.movieIDList.findIndex(
        (e) => e.tmdb_id === (action as RatingUpdateAction).payload.tmdb_id
      );

      if (movieIndex >= 0)
        newMovieIDList[
          movieIndex
        ].rating = (action as RatingUpdateAction).payload.rating!;

      return {
        ...state,
        ratingLoadingStatus: {
          ...state.ratingLoadingStatus,
          [(action as RatingUpdateAction).payload.tmdb_id]:
            LoadingState.LOADING,
        },
        movieIDList: newMovieIDList,
      };
    }
    case MovieListActionType.DELETE_RATING_BEGIN: {
      let newMovieIDList = state.movieIDList;
      let movieIndex = state.movieIDList.findIndex(
        (e) => e.tmdb_id === (action as RatingUpdateAction).payload.tmdb_id
      );

      if (movieIndex >= 0) newMovieIDList[movieIndex].rating = 0;

      return {
        ...state,
        ratingLoadingStatus: {
          ...state.ratingLoadingStatus,
          [(action as RatingUpdateAction).payload.tmdb_id]:
            LoadingState.LOADING,
        },
      };
    }
    case MovieListActionType.UPDATE_RATING_END:
      return {
        ...state,
        ratingLoadingStatus: {
          ...state.ratingLoadingStatus,
          [(action as RatingUpdateAction).payload.tmdb_id]: LoadingState.DONE,
        },
      };
    case MovieListActionType.LIST_BEGIN:
      return {
        ...state,
        loading: LoadingState.LOADING,
        movieIDList: [],
        movieDataList: [],
      };
    case MovieListActionType.LIST_END:
      return {
        ...state,
        loading: LoadingState.DONE,
        movieIDList: (action as MovieListAction).payload.movieList!,
      };
    case MovieListActionType.SET_MOVIE_LIST_DATA_BEGIN:
      return {
        ...state,
        listDataLoading: LoadingState.LOADING,
      };
    case MovieListActionType.SET_MOVIE_LIST_DATA_END:
      return {
        ...state,
        listDataLoading: LoadingState.DONE,
        movieDataList: (action as SetMovieDataListAction).payload.movieDataList,
      };
    case MovieListActionType.CLEAR_MOVIE_LIST_DATA:
      return initialState;
    default:
      return state;
  }
};
