import { Login, LoginType } from "../actions/loginActions";
import { LoadingState } from "./otherReducer";

export interface LoginState {
  loading: LoadingState;
  loginFeedback: String;
  createAcctFeedback: String;
  passwordChangeFeedback: String;
  passwordRecoverFeedback: String;
  isLoggedIn: boolean;
  username: string;
  password: string;
  // add additional attributes here.
  // These attributes can come from the payload or another
  // separate variable from the action
}

const initialState2: LoginState = {
  loading: LoadingState.IDLE,
  loginFeedback: "",
  createAcctFeedback: "",
  passwordChangeFeedback: "",
  passwordRecoverFeedback: "",
  isLoggedIn: false,
  username: "",
  password: "",
};

export const loginReducer = (
  state = initialState2,
  action: Login
): LoginState => {
  console.log(action.payload);

  switch (action.type) {
    case LoginType.LOGIN_BEGIN:
      return {
        ...state,
        loading: LoadingState.LOADING,
        loginFeedback: action.payload.requestFeedback,
        createAcctFeedback: action.payload.requestFeedback,
        passwordChangeFeedback: action.payload.requestFeedback,
        passwordRecoverFeedback: action.payload.requestFeedback,
      };
    case LoginType.LOGIN_END:
      // let isLoggedIn: boolean;
      // let obj = JSON.parse(action.payload);
      // action.payload["yes"];
      // console.log(action.payload);
      if (action.payload.isLoggedIn) {
        return {
          ...state,
          isLoggedIn: action.payload.isLoggedIn,
          loading: LoadingState.DONE,
          username: action.username,
          password: action.password,
        };
      } else {
        return {
          ...state,
          isLoggedIn: action.payload.isLoggedIn,
          loading: LoadingState.DONE,
          loginFeedback: action.payload.requestFeedback,
          username: "",
          password: "",
        };
      }
    case LoginType.CREATE_ACCT_END:
      return {
        ...state,
        loading: LoadingState.DONE,
        createAcctFeedback: action.payload.requestFeedback,
      };

    default:
      return state;
  }
};
