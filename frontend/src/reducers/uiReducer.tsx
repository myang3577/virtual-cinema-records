import { UI, UIType } from "../actions/uiActions";

export enum AccountModalType {
  LOGIN = "LOGIN",
  LOGOUT = "LOGOUT",
  REGISTER = "REGISTER",
}

export interface UIState {
  accountModalOpen: boolean;
  accountModalType: AccountModalType;
  // add additional attributes here.
  // These attributes can come from the payload or another
  // separate variable from the action
}

const initialState: UIState = {
  accountModalOpen: false,
  accountModalType: AccountModalType.LOGIN,
};

export const uiReducer = (state = initialState, action: UI): UIState => {
  switch (action.type) {
    case UIType.LOGIN_MODAL:
      return {
        ...state,
        accountModalType: AccountModalType.LOGIN,
      };
    case UIType.LOGOUT_MODAL:
      return {
        ...state,
        accountModalType: AccountModalType.LOGOUT,
      };
    case UIType.REGISTER_MODAL:
      return {
        ...state,
        accountModalType: AccountModalType.REGISTER,
      };
    case UIType.OPEN_MODAL:
      return {
        ...state,
        accountModalOpen: true,
      };
    case UIType.CLOSE_MODAL:
      return {
        ...state,
        accountModalOpen: false,
      };
    default:
      return state;
  }
};
