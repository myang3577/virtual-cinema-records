import {
  UIAction,
  UIActionType,
  AccountModalContent,
  UISetModalContentAction,
} from "../actions/uiActions";

export interface UIState {
  accountModalOpen: boolean;
  accountModalContent: AccountModalContent;
  accountDrawerOpen: boolean;
  detailDrawerOpen: boolean;
  tmdbBaseUrl: string;
}

const initialState: UIState = {
  accountModalOpen: false,
  accountModalContent: AccountModalContent.LOGIN,
  accountDrawerOpen: false,
  detailDrawerOpen: false,
  tmdbBaseUrl: "https://image.tmdb.org/t/p/w500/",
};

export const uiReducer = (
  state = initialState,
  action: UIAction | UISetModalContentAction
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
    default:
      return state;
  }
};
