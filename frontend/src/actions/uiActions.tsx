import { Dispatch } from "redux";

export enum UIType {
  LOGIN_MODAL = "LOGIN_MODAL",
  LOGOUT_MODAL = "LOGOUT_MODAL",
  REGISTER_MODAL = "REGISTER_MODAL",
  OPEN_MODAL = "OPEN_MODAL",
  CLOSE_MODAL = "CLOSE_MODAL",
}

export interface UI {
  type: UIType;
}

export const accountLoginModal = (isLoggedIn: boolean): UI => {
  if(isLoggedIn) {
    return {
      type: UIType.LOGOUT_MODAL,
    };
  }
  return {
    type: UIType.LOGIN_MODAL,
  };
};

export const accountLogoutModal = (isLoggedIn: boolean): UI => {
  if(isLoggedIn) {
    return {
      type: UIType.LOGOUT_MODAL,
    };
  }
  return {
    type: UIType.LOGIN_MODAL,
  };
};

export const accountRegisterModal = (): UI => {
  return {
    type: UIType.REGISTER_MODAL,
  };
};

export const accountOpenModal = (): UI => {
  return {
    type: UIType.OPEN_MODAL,
  };
};

export const accountCloseModal = (): UI => {
  return {
    type: UIType.CLOSE_MODAL,
  };
};

export const accountToggleModal = (isLoggedIn: boolean): UI => {
  if(isLoggedIn) {
    return {
      type: UIType.CLOSE_MODAL,
    };
  }

  return {
    type: UIType.OPEN_MODAL,
  };
}
