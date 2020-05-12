import { Dispatch, Action } from "redux";

// API key to query themoviedb database
export const apiKey = "5e38014a47f9412c29d0ca4667091633";

/**
 * Define your own enumerator called ActionType with two possible
 * values.
 */
export enum TMDBActionType {
  SEARCH_MOVIES_BEGIN = "SEARCH_MOVIES_BEGIN",
  SEARCH_MOVIES_END = "SEARCH_MOVIES_END",
  GET_POPULAR_MOVIES_END = "GET_POPULAR_MOVIES_END",
  GET_MOVIE_CAST_END = "GET_MOVIE_CAST",
}

/**
 * Define a "class" or object called Action that has two fields: type and
 * payload. We want a type because it allows us to know what objects we are
 * dealing with. We want payload because it is the object variable that is going
 * to hold our API response (which will be a JSONified object).
 *
 * At the end of the day an action is something that is brought to a reducer
 * which brings it to the store to update the state
 *
 * Actions MUST have a type. Everything else is up to you
 */
export interface TMDBAction {
  type: TMDBActionType;
  payload: {};
}

/**
 * An action creater that ONLY returns the specified Action. It's sole job is to
 * return actions. The return type of this particular action creator is Action
 * as seen by the (): Action
 *
 * This action creator does not take any parameters. So we are just setting some
 * default parameters. Ie. type is ActionType.FETCH_BEGIN and the payload is an
 * empty object
 */
export const searchMoviesBegin = (): Action => {
  return {
    type: TMDBActionType.SEARCH_MOVIES_BEGIN,
  };
};

/**
 * An action creater that ONLY returns the specified Action. It's sole job is to
 * return actions. The return type of this particular action creator is Action
 * as seen by the (): Action
 *
 * This action creator does take parameters. Specifically it takes a parameter
 * called payload which is of type object. Then Within the function it just
 * return an action with the payload variable in the returned object set to be
 * the payload that was passed. See below why we would want to do this.
 *
 * @param payload
 */
export const searchMoviesEnd = (payload: {}): TMDBAction => {
  return {
    type: TMDBActionType.SEARCH_MOVIES_END,
    payload,
  };
};

export const getPopularMoviesEnd = (payload: {}): TMDBAction => {
  return {
    type: TMDBActionType.GET_POPULAR_MOVIES_END,
    payload,
  };
};

export const getMovieCastEnd = (payload: {}): TMDBAction => {
  return {
    type: TMDBActionType.GET_MOVIE_CAST_END,
    payload,
  };
};

/**
 * Conducts the API query. This is an async funciton partially handled by Thunk.
 * The first return returns a function. The second return actually returns the
 * result of the JSON
 *
 * The flow of this function is the following:
 * searchMovies is called with a query ->
 * we immediately update the state to show "loading" because we are beginning
 * the API query ->
 * We query the API ->
 * We either .json the response or show error
 * Finally we pass the json to fetchDataEnd which produces an action where the
 * payload is now filled with the json response ->
 * We then dispatch the Action to the reducer to hopefully update the states
 *
 * dispatch
 * @param query The name of the movie we want to search for
 */
export const searchMovies = (query: string) => {
  return (dispatch: Dispatch) => {
    dispatch(searchMoviesBegin());
    return fetch(
      "https://api.themoviedb.org/3/search/movie?api_key=" +
        apiKey +
        "&language=en-US&query=" +
        query
    )
      .then((response) => response.json())
      .then((json) => dispatch(searchMoviesEnd(json)))
      .catch((error) => console.log("An error occurred.", error));
  };
};

export const getPopularMovies = () => {
  return (dispatch: Dispatch) => {
    return fetch(
      "https://api.themoviedb.org/3/movie/popular?api_key=" +
        apiKey +
        "&language=en-US"
    )
      .then((response) => response.json())
      .then((json) => dispatch(getPopularMoviesEnd(json)))
      .catch((error) => console.log("An error occurred.", error));
  };
};

export const getMovieCast = (movieID: string) => {
  return (dispatch: Dispatch) => {
    return fetch(
      "https://api.themoviedb.org/3/movie/" +
        movieID +
        "/credits?api_key=" +
        apiKey
    )
      .then((response) => response.json())
      .then((json) => dispatch(getMovieCastEnd(json)))
      .catch((error) => console.log("An error occurred.", error));
  };
};
