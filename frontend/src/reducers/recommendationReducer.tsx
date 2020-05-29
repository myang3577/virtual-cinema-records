import { LoadingState } from "./tmdbReducer";

import {
  RecommendationActionType,
  RecommendationAction,
  MovieResultElement,
  GeneralRecommendationAction,
  getMovieRecommendation,
} from "../actions/recommendationActions";

export interface RecommendationListObject {
  [key: string]: MovieResultElement[];
}

export interface RecommendationState {
  loading: LoadingState;
  movieRecommendationList: RecommendationListObject;
  actorRecommendationList: RecommendationListObject;
  genreRecommendationList: RecommendationListObject;
  movieRecommendationListCopy: RecommendationListObject;
  actorRecommendationListCopy: RecommendationListObject;
  genreRecommendationListCopy: RecommendationListObject;
  generalRecommendationList: RecommendationListObject;
}

const initialState: RecommendationState = {
  loading: LoadingState.IDLE,
  movieRecommendationList: {},
  actorRecommendationList: {},
  genreRecommendationList: {},
  movieRecommendationListCopy: {},
  actorRecommendationListCopy: {},
  genreRecommendationListCopy: {},
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
  let newRecommendations: any = [{}, {}, {}, {}];
  let allRecommendations = [
    state.movieRecommendationList,
    state.actorRecommendationList,
    state.genreRecommendationList,
    state.generalRecommendationList,
  ];
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
        movieRecommendationListCopy: (action as RecommendationAction).payload
          .recommendationList!,
      };
    case RecommendationActionType.GET_ACTOR_RECOMMENDATION_END:
      return {
        ...state,
        loading: LoadingState.DONE,
        actorRecommendationList: (action as RecommendationAction).payload
          .recommendationList!,
        actorRecommendationListCopy: (action as RecommendationAction).payload
          .recommendationList!,
      };
    case RecommendationActionType.GET_GENRE_RECOMMENDATION_END:
      return {
        ...state,
        loading: LoadingState.DONE,
        genreRecommendationList: (action as RecommendationAction).payload
          .recommendationList!,
        genreRecommendationListCopy: (action as RecommendationAction).payload
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
    case RecommendationActionType.HIDE_BLACKLIST:
      for (let i = 0; i < allRecommendations.length; i++) {
        Object.keys(allRecommendations[i]).forEach((element: string) => {
          if (allRecommendations[i][element].length !== 0) {
            newRecommendations[i][element] = allRecommendations[i][
              element
            ].filter((movieData: any) => {
              return movieData.id !== (action as RecommendationAction).tmdb_id;
            });
          } else {
            newRecommendations[i][element] = [];
          }
        });
      }

      return {
        ...state,
        loading: LoadingState.DONE,
        movieRecommendationList: newRecommendations[0],
        actorRecommendationList: newRecommendations[1],
        genreRecommendationList: newRecommendations[2],
        generalRecommendationList: newRecommendations[3],
      };
    case RecommendationActionType.UNHIDE_BLACKLIST:
      let copyRecommendations = [
        state.movieRecommendationListCopy,
        state.actorRecommendationListCopy,
        state.genreRecommendationListCopy,
      ];
      for (let i = 0; i < copyRecommendations.length; i++) {
        Object.keys(copyRecommendations[i]).forEach((element: string) => {
          if (copyRecommendations[i][element].length !== 0) {
            // Get the index in the original
            let originalIdx = copyRecommendations[i][element].findIndex(
              (movie: any) => {
                return movie.id === (action as RecommendationAction).tmdb_id;
              }
            );

            let addMovie = copyRecommendations[i][element][originalIdx];

            // If the array does not contain the movie we are adding back, skip
            // processing the list
            if (originalIdx === -1) {
              newRecommendations[i][element] = allRecommendations[i][element];
              return;
            }

            let addAtFront = true;
            for (let j = originalIdx - 1; j >= 0; j--) {
              // Represents the movie object id at index j of the movie array
              let previousId = copyRecommendations[i][element][j].id;
              let addIdx = allRecommendations[i][element].findIndex(
                (movie: any) => {
                  return movie.id === previousId;
                }
              );

              // If the add index is not -1, then we can successfully add
              if (addIdx !== -1) {
                allRecommendations[i][element].splice(addIdx + 1, 0, addMovie);
                newRecommendations[i][element] = allRecommendations[i][element];
                addAtFront = false;
                break;
              }
            }

            // Check if we should add the element at the front
            if (addAtFront === true) {
              allRecommendations[i][element].splice(0, 0, addMovie);
              newRecommendations[i][element] = allRecommendations[i][element];
            }
          } else {
            newRecommendations[i][element] = [];
          }
        });
      }
      return {
        ...state,
        loading: LoadingState.DONE,
        movieRecommendationList: newRecommendations[0],
        actorRecommendationList: newRecommendations[1],
        genreRecommendationList: newRecommendations[2],
      };
    case RecommendationActionType.CLEAR_RECOMMENDATION_DATA:
      return initialState;
    default:
      return state;
  }
};
