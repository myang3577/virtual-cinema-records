export enum UIActionType {
  OPEN_ACCOUNT_MODAL = "OPEN_MODAL",
  CLOSE_ACCOUNT_MODAL = "CLOSE_MODAL",
  SET_ACCOUNT_MODAL_CONTENT = "SET_ACCOUNT_MODAL_CONTENT",
  OPEN_ACCOUNT_DRAWER = "OPEN_DRAWER",
  CLOSE_ACCOUNT_DRAWER = "CLOSE_DRAWER",
  SET_CURRENT_PAGE = "SET_CURRENT_PAGE",
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

export interface UISetPageAction {
  type: UIActionType;
  payload: {
    pageType: PageType;
  };
}

export enum PageType {
  HOME = "HOME",
  RECS = "RECS",
  MYMOVIES = "MYMOVIES",
}

export enum AccountModalContent {
  LOGIN = "LOGIN",
  LOGOUT = "LOGOUT",
  REGISTER = "REGISTER",
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

export const setPageType = (pageType: PageType): UISetPageAction => {
  return {
    type: UIActionType.SET_CURRENT_PAGE,
    payload: {
      pageType,
    },
  };
};
