import {
  MovieDetailAction,
  MovieDetailType,
} from "../actions/movieDetailsActions";

export interface MovieDetailState {
  movie: any;
  tmdb_id: number;
  movieDetailsOpen: boolean;
  inUserList: boolean;
  inBlackList: boolean;
  userRating: number;
}

const initialState: MovieDetailState = {
  movie: {},
  tmdb_id: 0,
  movieDetailsOpen: false,
  inUserList: false,
  inBlackList: false,
  userRating: 0,
};

export const movieDetailReducer = (
  state = initialState,
  action: MovieDetailAction
): MovieDetailState => {
  switch (action.type) {
    case MovieDetailType.MOVIE_DETAIL_OPEN: {
      return {
        ...state,
        movie: action.payload.movie,
        tmdb_id: action.payload.tmdb_id,
        movieDetailsOpen: action.payload.movieDetailsOpen,
        inUserList: action.payload.inUserList,
        inBlackList: action.payload.inBlackList,
        userRating: action.payload.userRating,
      };
    }
    case MovieDetailType.MOVIE_DETAIL_CLOSED: {
      return initialState;
    }
    case MovieDetailType.MOVIE_DETAIL_CHANGE: {
      return {
        ...state,
        movie: action.payload.movie,
        tmdb_id: action.payload.tmdb_id,
        inUserList: action.payload.inUserList,
        inBlackList: action.payload.inBlackList,
        userRating: action.payload.userRating,
      };
    }
    case MovieDetailType.MOVIE_DETAIL_UPDATE: {
      return {
        ...state,
        inUserList: action.payload.inUserList,
        inBlackList: action.payload.inBlackList,
      };
    }
    case MovieDetailType.MOVIE_DETAIL_RATING_UPDATE: {
      return {
        ...state,
        userRating: action.payload.userRating,
      };
    }
    default: {
      return state;
    }
  }
};
