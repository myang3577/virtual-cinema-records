import { TMDBAction, TMDBActionType } from "../actions/tmdbActions";

// Defines the possible loading states
export enum LoadingState {
  IDLE = "IDLE",
  LOADING = "LOADING",
  DONE = "DONE",
}

/**
 * Essentially a class definition. Defines what
 * fields are inside of the InitialState object.
 * In this case we have a variable called loading
 * of type LoadingState
 * There is another variable called movieSearchResult
 * that is of type object. {} means object type
 */
export interface TMDBState {
  loading: LoadingState;
  movieSearchResult: {};
  popularMovies: {};
  movieCast: {};
}

/**
 * Define a variable called initialState that is of type
 * InitialState. We then define the loading state to be
 * LoadingState.IDLE
 * We also define the movieSearchResult field to be an empty
 * object
 *
 * Note that InitialState is an arbitrary name. One reducer will have one set of
 * attributes defined by this type that it can modify. So we could have
 * userDataInitialState, movieListInitialState etc. And each one would define
 * the attributes that the respective reducer will be able to modify. BUT NOTE
 * THAT STATE IS ALWAYS GLOBAL. JUST BECAUSE REDUCER 1 CAN MODIFY X AND REDUCER
 * 2 CAN MODIFY Y DOES NOT MEAN THAT X AND Y ARE STORED SEPARATELY. THAT WOULD
 * DEFEAT THE POINT OF REDUX. Accessing them just becomes state.reducer1.x and
 * state.reducer2.y. All components are still allowed to read the global state,
 * but only if you are a reducer with the set attribute can you modify the
 * state.
 */
const initialState: TMDBState = {
  loading: LoadingState.IDLE,
  movieSearchResult: {},
  popularMovies: {},
  movieCast: {},
};

/**
 * Define the other reducer. Takes 2 parameters state and action.
 * Every reducer must take these two things. The job of the
 * reducer is supposed to be used to set the state within the
 * storej.
 * action: Action): InitialState=>
 * The InitialState means the return type needs to be InitialState
 * It is also worth mentioning here that state = initialState
 *
 * @param state all of the states currently in the store. The default state it
 *              is set to is the variable initialState. This means that
 *              all of the states/attributes that exist have already been
 *              defined inside of initialState
 *
 * @param action the action we want to perform on the states in the store
 */
export const tmdbReducer = (
  state = initialState,
  action: TMDBAction
): TMDBState => {
  // Check the action type and choose the appropriate action. Within each action
  // you set the states you want to set
  switch (action.type) {
    case TMDBActionType.SEARCH_MOVIES_BEGIN:
      // Function calling because sometimes the cases get a bit long.
      // In this case you are just passing on the state and action for the
      // fetch reducer to do the state setting.
      // Reducers always return back the state. The action of returning back the
      // state is what actually sets the state within the store
      return fetchBeginReducer(state, action);
    case TMDBActionType.SEARCH_MOVIES_END:
      // Another example of setting state. In this case it sets the
      // movieSearchResult and the loading state. Note that states are
      // overrided. That's what it means to set them
      return {
        ...state,
        movieSearchResult: action.payload,
        loading: LoadingState.DONE,
      };
    case TMDBActionType.GET_POPULAR_MOVIES_END:
      return {
        ...state,
        popularMovies: action.payload,
      };
    case TMDBActionType.GET_MOVIE_CAST_END:
      return {
        ...state,
        movieCast: action.payload,
      };
    default:
      return state;
  }
};

const fetchBeginReducer = (state: TMDBState, action: TMDBAction) => {
  // Reducers always return back the state. The action of returning back the
  // state is what actually sets the state within the store
  return {
    ...state,
    loading: LoadingState.LOADING,
  };
};

export default tmdbReducer;
