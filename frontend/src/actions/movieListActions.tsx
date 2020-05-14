import { Dispatch, Action } from "redux";
import { apiKey } from "./tmdbActions";
import { MovieListElement } from "./userInfoActions";

export enum MovieListActionType {
  PUT_RATING_BEGIN = "PUT_RATING_BEGIN",
  PUT_RATING_END = "PUT_RATING_END",
  LIST_BEGIN = "LIST_BEGIN",
  LIST_END = "LIST_END",
  ADD_MOVIE_DATA = "ADD_MOVIE_DATA",
  ADD_ALL_MOVIE_LIST_DATA_END = "ADD_ALL_MOVIE_LIST_DATA_END",
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

export interface RatingUpdateAction {
  type: MovieListActionType;
  payload: {
    tmdb_id: number;
  };
}

const putRatingBegin = (tmdb_id: number): RatingUpdateAction => {
  return {
    type: MovieListActionType.PUT_RATING_BEGIN,
    payload: { tmdb_id },
  };
};

const putRatingEnd = (tmdb_id: number): RatingUpdateAction => {
  return {
    type: MovieListActionType.PUT_RATING_END,
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

const addMovieDataAction = (payload: any): MovieListAction => {
  return {
    type: MovieListActionType.ADD_MOVIE_DATA,
    payload: {
      movieData: payload,
    },
  };
};

export const addAllMovieListDataEnd = (): Action => {
  return {
    type: MovieListActionType.ADD_ALL_MOVIE_LIST_DATA_END,
  };
};

export const clearMovieListData = (): Action => {
  return {
    type: MovieListActionType.CLEAR_MOVIE_LIST_DATA,
  };
};

export const listMovies = (email: string) => {
  return (dispatch: any) => {
    dispatch(listMoviesBegin());

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

        // Wait for all movie additions to complete before sending finished
        // signal
        return new Promise((resolve, reject) => {
          let counter = json.length;
          json.forEach((movie) => {
            fetchAndAddMovieData(movie.tmdb_id, dispatch).then(() => {
              counter--;
              if (counter === 0) {
                resolve();
              }
            });
          });
        });
      })
      .then(() => {
        dispatch(addAllMovieListDataEnd());
      })
      .catch((error) => console.log("An error occurred.", error));
  };
};

const fetchAndAddMovieData = (tmdb_id: number, dispatch: Dispatch) => {
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
    .then((json) => {
      dispatch(addMovieDataAction(json));
      return;
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
      .then(() => dispatch(listMovies(email)))
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
      .then(() => dispatch(listMovies(email)))
      .catch((error) => console.log("An error occurred.", error));
  };
};

export const putRating = (email: string, tmdb_id: number, rating: number) => {
  return (dispatch: Dispatch) => {
    dispatch(putRatingBegin(tmdb_id));

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
      .then(() => dispatch(putRatingEnd(tmdb_id)))
      .catch((error) => console.log("An error occurred.", error));
  };
};

export const deleteRating = (email: string, tmdb_id: number) => {
  return (dispatch: Dispatch) => {
    dispatch(putRatingBegin(tmdb_id));

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
      .then(() => dispatch(putRatingEnd(tmdb_id)))
      .catch((error) => console.log("An error occurred.", error));
  };
};
