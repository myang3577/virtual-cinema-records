import { Dispatch } from "redux";

export enum MovieDetailType {
  MOVIE_DETAIL_OPEN = "MOVIE_DETAIL_OPEN",
  MOVIE_DETAIL_CLOSED = "MOVIE_DETAIL_OPEN",
  MOVIE_DETAIL_CHANGE = "MOVIE_DETAIL_CHANGE",
  MOVIE_DETAIL_UPDATE = "MOVIE_DETAIL_UPDATE",
  MOVIE_DETAIL_RATING_UPDATE = "MOVIE_DETAIL_RATING_UPDATE",
}

export interface MovieDetailAction {
  type: MovieDetailType;
  payload: {
    movie: any;
    tmdb_id: number;
    movieDetailsOpen: boolean;
    inUserList: boolean;
    inBlackList: boolean;
    userRating: number;
  };
}

export const openMovieDetail = (
  m: any,
  t_id: number,
  movieOpen: boolean,
  inUser: boolean,
  inBlack: boolean,
  userRate: number
): MovieDetailAction => {
  return {
    type: MovieDetailType.MOVIE_DETAIL_OPEN,
    payload: {
      movie: m,
      tmdb_id: t_id,
      movieDetailsOpen: movieOpen,
      inUserList: inUser,
      inBlackList: inBlack,
      userRating: userRate,
    },
  };
};

export const closeMovieDetail = (): MovieDetailAction => {
  return {
    type: MovieDetailType.MOVIE_DETAIL_CLOSED,
    payload: {
      movie: {},
      tmdb_id: 0,
      movieDetailsOpen: false,
      inUserList: false,
      inBlackList: false,
      userRating: 0,
    },
  };
};

export const setMovieDetail = (
  m: any,
  t_id: number,
  inUser: boolean,
  inBlack: boolean,
  userRate: number
): MovieDetailAction => {
  return {
    type: MovieDetailType.MOVIE_DETAIL_CHANGE,
    payload: {
      movie: m,
      tmdb_id: t_id,
      movieDetailsOpen: true,
      inUserList: inUser,
      inBlackList: inBlack,
      userRating: userRate,
    },
  };
};

export const setMovieButtons = (
  inUser: boolean,
  inBlack: boolean
): MovieDetailAction => {
  return {
    type: MovieDetailType.MOVIE_DETAIL_UPDATE,
    payload: {
      movie: {},
      tmdb_id: 0,
      movieDetailsOpen: true,
      inUserList: inUser,
      inBlackList: inBlack,
      userRating: 0,
    },
  };
};

export const setMovieRating = (userRate: number | null): MovieDetailAction => {
  if (userRate) {
    return {
      type: MovieDetailType.MOVIE_DETAIL_RATING_UPDATE,
      payload: {
        movie: {},
        tmdb_id: 0,
        movieDetailsOpen: true,
        inUserList: false,
        inBlackList: false,
        userRating: userRate,
      },
    };
  } else {
    return {
      type: MovieDetailType.MOVIE_DETAIL_RATING_UPDATE,
      payload: {
        movie: {},
        tmdb_id: 0,
        movieDetailsOpen: true,
        inUserList: false,
        inBlackList: false,
        userRating: 0,
      },
    };
  }
};
