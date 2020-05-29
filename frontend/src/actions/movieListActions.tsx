import { Dispatch, Action } from "redux";
import { apiKey } from "./tmdbActions";
import { MovieListElement } from "./userInfoActions";
import { hideMovie, unhideMovie } from "./recommendationActions";

export enum MovieListActionType {
  PUT_RATING_BEGIN = "PUT_RATING_BEGIN",
  DELETE_RATING_BEGIN = "DELETE_RATING_BEGIN",
  UPDATE_RATING_END = "UPDATE_RATING_END",
  LIST_BEGIN = "LIST_BEGIN",
  LIST_END = "LIST_END",
  SET_MOVIE_LIST_DATA_BEGIN = "ADD_ALL_MOVIE_LIST_DATA_BEGIN",
  SET_MOVIE_LIST_DATA_END = "ADD_ALL_MOVIE_LIST_DATA_END",
  CLEAR_MOVIE_LIST_DATA = "CLEAR_MOVIE_LIST_DATA",
  RATING_UPDATE_BEGIN = "RATING_UPDATE_BEGIN",
  RATING_UPDATE_END = "RATING_UPDATE_END",
}

export interface MovieListAction {
  type: MovieListActionType;
  payload: {
    movieList?: MovieListElement[];
    movieData?: {};
  };
}

export interface SetMovieDataListAction {
  type: MovieListActionType;
  payload: {
    movieDataList: any[];
  };
}

export interface RatingUpdateAction {
  type: MovieListActionType;
  payload: {
    tmdb_id: number;
    rating?: number;
  };
}

const putRatingBegin = (
  tmdb_id: number,
  rating: number
): RatingUpdateAction => {
  return {
    type: MovieListActionType.PUT_RATING_BEGIN,
    payload: {
      tmdb_id,
      rating,
    },
  };
};

const deleteRatingBegin = (tmdb_id: number): RatingUpdateAction => {
  return {
    type: MovieListActionType.PUT_RATING_BEGIN,
    payload: {
      tmdb_id,
    },
  };
};

const updateRatingEnd = (tmdb_id: number): RatingUpdateAction => {
  return {
    type: MovieListActionType.UPDATE_RATING_END,
    payload: { tmdb_id },
  };
};

export const listMoviesBegin = (): MovieListAction => {
  return {
    type: MovieListActionType.LIST_BEGIN,
    payload: {},
  };
};

export const listMoviesEnd = (payload: any): MovieListAction => {
  return {
    type: MovieListActionType.LIST_END,
    payload: {
      movieList: payload,
    },
  };
};

export const setMovieDataListBegin = (): MovieListAction => {
  return {
    type: MovieListActionType.SET_MOVIE_LIST_DATA_BEGIN,
    payload: {},
  };
};

export const setMovieDataListEnd = (
  movieDataList: any[]
): SetMovieDataListAction => {
  return {
    type: MovieListActionType.SET_MOVIE_LIST_DATA_END,
    payload: { movieDataList },
  };
};

export const clearMovieDataList = (): Action => {
  return {
    type: MovieListActionType.CLEAR_MOVIE_LIST_DATA,
  };
};

export const listMovies = (email: string) => {
  return (dispatch: any) => {
    dispatch(listMoviesBegin());
    dispatch(setMovieDataListBegin());

    return fetch("/users/" + email + "/movie-list")
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw Error("Error occurred, status: " + response.status);
        }
      })
      .then((json: MovieListElement[]) => {
        dispatch(listMoviesEnd(json));

        const promises = json.map((e) => {
          return fetchMovieData(e.tmdb_id);
        });

        Promise.all(promises).then((movieData) =>
          dispatch(setMovieDataListEnd(movieData))
        );
      })
      .catch((error) => console.log("An error occurred.", error));
  };
};

const fetchMovieData = (tmdb_id: number) => {
  return fetch(
    "https://api.themoviedb.org/3/movie/" +
      tmdb_id +
      "?api_key=" +
      apiKey +
      "&language=en-US"
  )
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw Error("Error occurred, status: " + response.status);
      }
    })
    .catch((error) => console.log("An error occurred.", error));
};

export const putMovie = (email: string, tmdb_id: number) => {
  return (dispatch: Dispatch<any>) => {
    const ratingRequestBody = {
      tmdb_id,
    };

    return fetch("/users/" + email + "/movie", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ratingRequestBody),
    })
      .then(() => {
        dispatch(listMovies(email));
        dispatch(hideMovie(tmdb_id));
      })
      .catch((error) => console.log("An error occurred.", error));
  };
};

export const deleteMovie = (email: string, tmdb_id: number) => {
  return (dispatch: Dispatch<any>) => {
    // Begin/end actions can be added based on UI need
    const ratingRequestBody = {
      tmdb_id,
    };

    return fetch("/users/" + email + "/movie", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ratingRequestBody),
    })
      .then(() => {
        dispatch(listMovies(email));
        dispatch(unhideMovie(tmdb_id));
      })
      .catch((error) => console.log("An error occurred.", error));
  };
};

export const putRating = (email: string, tmdb_id: number, rating: number) => {
  return (dispatch: Dispatch) => {
    dispatch(putRatingBegin(tmdb_id, rating));

    const ratingRequestBody = {
      tmdb_id,
      rating,
    };

    return fetch("/users/" + email + "/movie-rating", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ratingRequestBody),
    })
      .then(() => dispatch(updateRatingEnd(tmdb_id)))
      .catch((error) => console.log("An error occurred.", error));
  };
};

export const deleteRating = (email: string, tmdb_id: number) => {
  return (dispatch: Dispatch) => {
    dispatch(deleteRatingBegin(tmdb_id));

    const ratingRequestBody = {
      tmdb_id,
    };

    return fetch("/users/" + email + "/movie-rating", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ratingRequestBody),
    })
      .then(() => dispatch(updateRatingEnd(tmdb_id)))
      .catch((error) => console.log("An error occurred.", error));
  };
};
