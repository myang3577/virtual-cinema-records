import { UI, UIType } from "../actions/uiActions";
import { LoadingState } from "./otherReducer";
import LoginForm from "../containers/LoginForm"
import LogoutForm from "../containers/LogoutForm"
import RegisterForm from "../containers/RegisterForm"
import React from "react";

export interface UIState {
  accountModalOpen: boolean,
  accountModalType: any,
  // add additional attributes here.
  // These attributes can come from the payload or another
  // separate variable from the action
};

const initialState: UIState = {
  accountModalOpen: false,
  accountModalType: <LoginForm />,
};

export const uiReducer = (
  state = initialState,
  action: UI
): UIState => {
  switch (action.type) {
    case UIType.LOGIN_MODAL:
      return {
        ...state,
        accountModalType: <LoginForm />,
      };
    case UIType.LOGOUT_MODAL:
      return {
          ...state,
          accountModalType: <LogoutForm />,
      };
    case UIType.REGISTER_MODAL:
      return {
        ...state,
        accountModalType: <RegisterForm />,
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
