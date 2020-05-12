import {
  UIAction,
  UIActionType,
  AccountModalContent,
  UISetModalContentAction,
  UISnackBarAction,
  UISetMovieAction,
  SnackBarActionType,
} from "../actions/uiActions";

export interface UIState {
  accountModalOpen: boolean;
  accountModalContent: AccountModalContent;
  accountDrawerOpen: boolean;
  detailDrawerOpen: boolean;
  snackBarOpen: boolean;
  snackBarString: string;
  snackBarAction: SnackBarActionType;
  currentMovie: {
    movie: any;
    inUserList: boolean;
  };
  tmdbBaseUrl: string;
}

const initialState: UIState = {
  accountModalOpen: false,
  accountModalContent: AccountModalContent.LOGIN,
  accountDrawerOpen: false,
  detailDrawerOpen: false,
  snackBarOpen: false,
  snackBarString: "",
  snackBarAction: SnackBarActionType.NONE,
  currentMovie: {
    movie: {},
    inUserList: false,
  },
  tmdbBaseUrl: "https://image.tmdb.org/t/p/w500/",
};

export const uiReducer = (
  state = initialState,
  action:
    | UIAction
    | UISetModalContentAction
    | UISetMovieAction
    | UISnackBarAction
): UIState => {
  switch (action.type) {
    case UIActionType.OPEN_ACCOUNT_MODAL:
      return {
        ...state,
        accountModalOpen: true,
      };
    case UIActionType.CLOSE_ACCOUNT_MODAL:
      return {
        ...state,
        accountModalOpen: false,
      };
    case UIActionType.SET_ACCOUNT_MODAL_CONTENT:
      return {
        ...state,
        accountModalContent: (action as UISetModalContentAction).payload
          .modalContent,
      };
    case UIActionType.OPEN_ACCOUNT_DRAWER:
      return {
        ...state,
        accountDrawerOpen: true,
      };
    case UIActionType.CLOSE_ACCOUNT_DRAWER:
      return {
        ...state,
        accountDrawerOpen: false,
      };
    case UIActionType.OPEN_DETAIL_DRAWER:
      return {
        ...state,
        detailDrawerOpen: true,
        currentMovie: {
          movie: (action as UISetMovieAction).payload.movie,
          inUserList: (action as UISetMovieAction).payload.inUserList,
        },
      };
    case UIActionType.CLOSE_DETAIL_DRAWER:
      return {
        ...state,
        detailDrawerOpen: false,
      };
    case UIActionType.OPEN_SNACKBAR:
      return {
        ...state,
        snackBarOpen: true,
        snackBarString: (action as UISnackBarAction).payload.snackBarString,
        snackBarAction: (action as UISnackBarAction).payload.snackBarAction,
      };
    case UIActionType.CLOSE_SNACKBAR:
      return {
        ...state,
        snackBarOpen: false,
      };
    case UIActionType.ADD_CURRENT_MOVIE:
      return {
        ...state,
        currentMovie: {
          ...state.currentMovie,
          inUserList: true,
        },
      };
    case UIActionType.REMOVE_CURRENT_MOVIE:
      return {
        ...state,
        currentMovie: {
          ...state.currentMovie,
          inUserList: false,
        },
      };
    default:
      return state;
  }
};
