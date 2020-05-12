export enum UIActionType {
  OPEN_ACCOUNT_MODAL = "OPEN_MODAL",
  CLOSE_ACCOUNT_MODAL = "CLOSE_MODAL",
  SET_ACCOUNT_MODAL_CONTENT = "SET_ACCOUNT_MODAL_CONTENT",
  OPEN_ACCOUNT_DRAWER = "OPEN_DRAWER",
  CLOSE_ACCOUNT_DRAWER = "CLOSE_DRAWER",
  SET_CURRENT_PAGE = "SET_CURRENT_PAGE",
  OPEN_DETAIL_DRAWER = "OPEN_DETAILS",
  CLOSE_DETAIL_DRAWER = "CLOSE_DETAILS",
  OPEN_SNACKBAR = "OPEN_SNACKBAR",
  CLOSE_SNACKBAR = "CLOSE_SNACKBAR",
  ADD_CURRENT_MOVIE = "ADD_CURRENT_MOVIE",
  REMOVE_CURRENT_MOVIE = "REMOVE_CURRENT_MOVIE",
}

export interface UIAction {
  type: UIActionType;
}

export interface UISetModalContentAction {
  type: UIActionType;
  payload: {
    modalContent: AccountModalContent;
  };
}

export interface UISetMovieAction {
  type: UIActionType;
  payload: {
    movie: any;
    inUserList: boolean;
  };
}

export interface UISnackBarAction {
  type: UIActionType;
  payload: {
    snackBarString: string;
    snackBarAction: SnackBarActionType;
  };
}

export enum AccountModalContent {
  LOGIN = "LOGIN",
  REGISTER = "REGISTER",
  CHANGE_PASSWORD = "CHANGE_PASSWORD",
  FORGOT_PASSWORD = "FORGOT_PASSWORD",
}

export enum SnackBarActionType {
  LOGIN = "LOGIN",
  MYMOVIES = "MYMOVIES",
  NONE = "NONE",
}

export const setAccountModalContent = (
  modalContent: AccountModalContent
): UISetModalContentAction => {
  return {
    type: UIActionType.SET_ACCOUNT_MODAL_CONTENT,
    payload: {
      modalContent,
    },
  };
};

export const openAccountModal = (): UIAction => {
  return {
    type: UIActionType.OPEN_ACCOUNT_MODAL,
  };
};

export const closeAccountModal = (): UIAction => {
  return {
    type: UIActionType.CLOSE_ACCOUNT_MODAL,
  };
};

export const toggleAccountDrawer = (open: boolean): UIAction => {
  if (open) {
    return {
      type: UIActionType.OPEN_ACCOUNT_DRAWER,
    };
  }
  return {
    type: UIActionType.CLOSE_ACCOUNT_DRAWER,
  };
};

export const toggleDetailDrawer = (
  open: boolean,
  inList: boolean,
  currMovie?: any
): UISetMovieAction => {
  if (open && currMovie) {
    return {
      type: UIActionType.OPEN_DETAIL_DRAWER,
      payload: {
        movie: currMovie,
        inUserList: inList,
      },
    };
  }
  return {
    type: UIActionType.CLOSE_DETAIL_DRAWER,
    payload: {
      movie: null,
      inUserList: false,
    },
  };
};

export const openSnackBar = (
  str: string,
  action?: SnackBarActionType
): UISnackBarAction => {
  if (action) {
    return {
      type: UIActionType.OPEN_SNACKBAR,
      payload: {
        snackBarString: str,
        snackBarAction: action,
      },
    };
  }
  return {
    type: UIActionType.OPEN_SNACKBAR,
    payload: {
      snackBarString: str,
      snackBarAction: SnackBarActionType.NONE,
    },
  };
};

export const closeSnackBar = (): UIAction => {
  return {
    type: UIActionType.CLOSE_SNACKBAR,
  };
};

export const addCurrentMovie = (): UIAction => {
  return {
    type: UIActionType.ADD_CURRENT_MOVIE,
  };
};

export const removeCurrentMovie = (): UIAction => {
  return {
    type: UIActionType.REMOVE_CURRENT_MOVIE,
  };
};
