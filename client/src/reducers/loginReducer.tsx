import { Login, LoginType } from "../actions/loginActions";
import { LoadingState } from "./otherReducer";

export interface LoginState {
  loading: LoadingState;
  loginResult: boolean;
  username: string;
  password: string;
}

const initialState2: LoginState = {
  loading: LoadingState.IDLE,
  loginResult: false,
  username: "",
  password: "",
};

export const loginReducer = (
  state = initialState2,
  action: Login
): LoginState => {
  switch (action.type) {
    case LoginType.LOGIN_BEGIN:
      return {
        ...state,
        loading: LoadingState.LOADING,
        username: action.username,
        password: action.password,
      };
    case LoginType.LOGIN_END:
      return {
        ...state,
        loginResult: action.payload,
        loading: LoadingState.DONE,
      };
    default:
      return state;
  }
};
