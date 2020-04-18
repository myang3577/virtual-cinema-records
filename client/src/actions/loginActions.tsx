import { Dispatch } from "redux";

export enum LoginType {
  LOGIN_BEGIN = "LOGIN_BEGIN",
  LOGIN_END = "LOGIN_END",
  CREATE_ACCT_END = "CREATE_ACCT_END",
}

export interface Login {
  type: LoginType;
  payload: {
    isLoggedIn: boolean;
    requestFeedback: string;
  };
  // requestResult: boolean;
  username: string;
  password: string;
}

// export interface LoginCredentials {
//   type: LoginType;
//   username: string;
//   password: string;
// }

export const initiateLoading = (): Login => {
  return {
    type: LoginType.LOGIN_BEGIN,
    payload: {
      isLoggedIn: false,
      requestFeedback: "",
    },
    // requestResult: false,
    username: "",
    password: "",
  };
};

// export const checkLoginBegin = (): Login => {
//   return {
//     type: LoginType.LOGIN_BEGIN,
//     payload: {},
//     loginResult: false,
//     username: "",
//     password: "",
//   };
// };

export const checkLoginEnd = (
  payload: {
    isLoggedIn: boolean;
    requestFeedback: string;
  },
  // requestResult: boolean,
  username: string,
  password: string
): Login => {
  return {
    type: LoginType.LOGIN_END,
    payload: {
      isLoggedIn: payload.isLoggedIn,
      requestFeedback: payload.requestFeedback,
    },
    // requestResult: requestResult,
    username: username,
    password: password,
  };
};

export const createAcctEnd = (
  payload: {
    // isLoggedIn: boolean;
    requestFeedback: string;
  },
  // requestResult: boolean,
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

export const checkLogin = (username: string, password: string) => {
  return (dispatch: Dispatch) => {
    console.log("username is: " + username);
    dispatch(initiateLoading());
    // dispatch(setCredentials(username, password));

    return fetch(
      `/aws/checkLogin?username=${encodeURIComponent(username)}
                    &password=${encodeURIComponent(password)}`,
      {
        method: "GET",
        mode: "cors",
        headers: {
          "access-control-allow-origin": "*",
        },
        // credentials: 'include'
      }
    )
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        dispatch(checkLoginEnd(json, username, password));
      })
      .catch((err) => alert(err));

    // return fetch(
    //   `/aws/checkLogin?name=${encodeURIComponent(username)}
    //                 &password=${encodeURIComponent(password)}`,
    //   {
    //     method: "GET",
    //     mode: "cors",
    //     headers: {
    //       "access-control-allow-origin": "*",
    //     },
    //     // credentials: 'include'
    //   }
    // )
    //   .then((response) => response.json())
    //   .then((json) => {
    //     dispatch(checkLoginEnd(json, username, password));
    //   })
    //   .catch((err) => alert(err));
  };
};

export const createAcct = (username: string, password: string) => {
  return (dispatch: Dispatch) => {
    console.log("username is: " + username);
    dispatch(initiateLoading());

    return fetch(
      `/aws/createAccount?username=${encodeURIComponent(username)}
                    &password=${encodeURIComponent(password)}`,
      {
        method: "GET",
        mode: "cors",
        headers: {
          "access-control-allow-origin": "*",
        },
      }
    )
      .then((response) => response.json())
      .then((json) => {
        dispatch(createAcctEnd(json, username, password));
      })
      .catch((err) => alert(err));
  };
};
