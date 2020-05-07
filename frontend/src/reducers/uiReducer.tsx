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
}

const initialState: UIState = {
  accountModalOpen: false,
  accountModalContent: AccountModalContent.LOGIN,
  accountDrawerOpen: false,
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
    default:
      return state;
  }
};
