import { Dispatch } from "redux";

export enum LoginType {
  LOGIN_BEGIN = "LOGIN_BEGIN",
  LOGIN_END = "LOGIN_END",
  CREATE_ACCT_END = "CREATE_ACCT_END",
  CHANGE_PASSWORD_END = "CHANGE_PASSWORD_END",
  RESET_PASSWORD_END = "RESET_PASSWORD_END",
  LOGOUT_END = "LOGOUT_END",
}

export interface Login {
  type: LoginType;
  payload: {
    isLoggedIn: boolean;
    requestFeedback: string;
  };
  username: string;
  password: string;
}

export const initiateLoading = (): Login => {
  return {
    type: LoginType.LOGIN_BEGIN,
    payload: {
      isLoggedIn: false,
      requestFeedback: "",
    },
    username: "",
    password: "",
  };
};

export const checkLoginEnd = (
  payload: {
    isLoggedIn: boolean;
    requestFeedback: string;
  },
  username: string,
  password: string
): Login => {
  return {
    type: LoginType.LOGIN_END,
    payload: {
      isLoggedIn: payload.isLoggedIn,
      requestFeedback: payload.requestFeedback,
    },
    username: username,
    password: password,
  };
};

export const createAcctEnd = (
  payload: {
    requestFeedback: string;
  },
  username: string,
  password: string
): Login => {
  return {
    type: LoginType.CREATE_ACCT_END,
    payload: {
      isLoggedIn: false,
      requestFeedback: payload.requestFeedback,
    },
    username: username,
    password: password,
  };
};

export const changePasswordEnd = (
  payload: {
    requestFeedback: string;
    isPassChange: boolean;
  },
  username: string,
  password: string
): Login => {
  return {
    type: LoginType.CHANGE_PASSWORD_END,
    payload: {
      isLoggedIn: true,
      requestFeedback: payload.requestFeedback,
    },
    username: username,
    password: password,
  };
};

export const forgotPasswordEnd = (payload: {
  requestFeedback: string;
}): Login => {
  return {
    type: LoginType.RESET_PASSWORD_END,
    payload: {
      isLoggedIn: false,
      requestFeedback: payload.requestFeedback,
    },
    username: "",
    password: "",
  };
};

export const logoutEnd = (): Login => {
  return {
    type: LoginType.LOGOUT_END,
    payload: {
      isLoggedIn: false,
      requestFeedback: "",
    },
    username: "",
    password: "",
  };
};

export const checkLogin = (username: string, password: string) => {
  return (dispatch: Dispatch) => {
    dispatch(initiateLoading());

    const requestOptions: RequestInit = {
      method: "POST",
      mode: "cors",
      headers: {
        "access-control-allow-origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    };

    return fetch(`/login/checkLogin`, requestOptions)
      .then((response) => response.json())
      .then((json) => {
        dispatch(checkLoginEnd(json, username, password));
      })
      .catch((err) => alert(err));
  };
};

export const createAcct = (
  username: string,
  password: string,
  repeatPassword: string
) => {
  return (dispatch: Dispatch) => {
    dispatch(initiateLoading());

    const requestOptions: RequestInit = {
      method: "POST",
      mode: "cors",
      headers: {
        "access-control-allow-origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
        repeatPassword: repeatPassword,
      }),
    };

    return fetch(`/login/createAccount`, requestOptions)
      .then((response) => response.json())
      .then((json) => {
        dispatch(createAcctEnd(json, username, password));
      })
      .catch((err) => alert(err));
  };
};

export const changePassword = (
  username: string,
  currPassword: string,
  newPassword: string
) => {
  return (dispatch: Dispatch) => {
    dispatch(initiateLoading());

    const requestOptions: RequestInit = {
      method: "POST",
      mode: "cors",
      headers: {
        "access-control-allow-origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        currPassword: currPassword,
        newPassword: newPassword,
      }),
    };

    return fetch(`/login/changePassword`, requestOptions)
      .then((response) => response.json())
      .then((json) => {
        let password = currPassword;

        // Save the new password only if successfully changed
        if (json.isPassChange) {
          password = newPassword;
        }
        dispatch(changePasswordEnd(json, username, password));
      })
      .catch((err) => alert(err));
  };
};

export const forgotPassword = (username: string) => {
  return (dispatch: Dispatch) => {
    dispatch(initiateLoading());

    const requestOptions: RequestInit = {
      method: "POST",
      mode: "cors",
      headers: {
        "access-control-allow-origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
      }),
    };

    return fetch(`/login/resetPassword`, requestOptions)
      .then((response) => response.json())
      .then((json) => {
        dispatch(forgotPasswordEnd(json));
      })
      .catch((err) => alert(err));
  };
};

export const logout = () => {
  return (dispatch: Dispatch) => {
    dispatch(initiateLoading());
    dispatch(logoutEnd());
  };
};
