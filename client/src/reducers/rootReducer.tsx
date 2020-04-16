import { combineReducers } from "redux";
import { otherReducer, OtherState } from "./otherReducer";
import { loginReducer, LoginState } from "./loginReducer";

export interface GlobalState {
  otherData: OtherState;
  loginData: LoginState;
}

// combineReducers just takes multiple reducers and puts them all into one big
// reducer. We write reducers in different places because it's clearer to
// separate them. This also means never write the exact same case for two
// reducers because the behavior will be unexpected
const rootReducer = combineReducers({
  otherData: otherReducer,
  loginData: loginReducer,
});

export default rootReducer;
