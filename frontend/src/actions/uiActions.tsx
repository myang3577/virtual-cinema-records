export enum UIActionType {
  OPEN_ACCOUNT_MODAL = "OPEN_MODAL",
  CLOSE_ACCOUNT_MODAL = "CLOSE_MODAL",
  SET_ACCOUNT_MODAL_CONTENT = "SET_ACCOUNT_MODAL_CONTENT",
  OPEN_ACCOUNT_DRAWER = "OPEN_DRAWER",
  CLOSE_ACCOUNT_DRAWER = "CLOSE_DRAWER",
  SET_CURRENT_PAGE = "SET_CURRENT_PAGE",
  OPEN_SNACKBAR = "OPEN_SNACKBAR",
  CLOSE_SNACKBAR = "CLOSE_SNACKBAR",
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

export interface UISnackBarAction {
  type: UIActionType;
  payload: {
    snackBarString: string;
    snackBarAction: SnackBarActionType;
    snackBarExtraPayload: {
      movie: any;
      userRating: number;
    };
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
  RATING = "RATING",
  BLACKLIST = "BLACKLIST",
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

export const openSnackBar = (
  str: string,
  action?: SnackBarActionType,
  movie?: any,
  userRating?: number | null
): UISnackBarAction => {
  if (action) {
    if (movie && userRating) {
      return {
        type: UIActionType.OPEN_SNACKBAR,
        payload: {
          snackBarString: str,
          snackBarAction: action,
          snackBarExtraPayload: {
            movie: movie,
            userRating: userRating,
          },
        },
      };
    }
    return {
      type: UIActionType.OPEN_SNACKBAR,
      payload: {
        snackBarString: str,
        snackBarAction: action,
        snackBarExtraPayload: {
          movie: {},
          userRating: 0,
        },
      },
    };
  }
  return {
    type: UIActionType.OPEN_SNACKBAR,
    payload: {
      snackBarString: str,
      snackBarAction: SnackBarActionType.NONE,
      snackBarExtraPayload: {
        movie: {},
        userRating: 0,
      },
    },
  };
};

export const closeSnackBar = (): UIAction => {
  return {
    type: UIActionType.CLOSE_SNACKBAR,
  };
};
