import {
  UIAction,
  UIActionType,
  AccountModalContent,
  UISetModalContentAction,
  UISnackBarAction,
} from "../actions/uiActions";

export interface UIState {
  accountModalOpen: boolean;
  accountModalContent: AccountModalContent;
  accountDrawerOpen: boolean;
  detailDrawerOpen: boolean;
  snackBarOpen: boolean;
  snackBarString: string;
  tmdbBaseUrl: string;
}

const initialState: UIState = {
  accountModalOpen: false,
  accountModalContent: AccountModalContent.LOGIN,
  accountDrawerOpen: false,
  detailDrawerOpen: false,
  snackBarOpen: false,
  snackBarString: "",
  tmdbBaseUrl: "https://image.tmdb.org/t/p/w500/",
};

export const uiReducer = (
  state = initialState,
  action: UIAction | UISetModalContentAction | UISnackBarAction
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
      };
    case UIActionType.CLOSE_SNACKBAR:
      return {
        ...state,
        snackBarOpen: false,
      };
    default:
      return state;
  }
};
