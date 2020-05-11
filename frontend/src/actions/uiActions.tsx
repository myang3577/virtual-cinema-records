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
  };
}

export enum AccountModalContent {
  LOGIN = "LOGIN",
  LOGOUT = "LOGOUT",
  REGISTER = "REGISTER",
  CHANGE_PASSWORD = "CHANGE_PASSWORD",
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

export const toggleDetailDrawer = (open: boolean): UIAction => {
  if (open) {
    return {
      type: UIActionType.OPEN_DETAIL_DRAWER,
    };
  }
  return {
    type: UIActionType.CLOSE_DETAIL_DRAWER,
  };
};

export const openSnackBar = (str: string): UISnackBarAction => {
  return {
    type: UIActionType.OPEN_SNACKBAR,
    payload: {
      snackBarString: str,
    },
  };
};

export const closeSnackBar = (): UIAction => {
  return {
    type: UIActionType.CLOSE_SNACKBAR,
  };
};
