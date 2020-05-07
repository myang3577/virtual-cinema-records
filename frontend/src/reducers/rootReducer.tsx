import { combineReducers } from "redux";
import { tmdbReducer, TMDBState } from "./tmdbReducer";
import { loginReducer, LoginState } from "./loginReducer";
import { movieListReducer, MovieListState } from "./movieListReducer";
import { userInfoReducer, UserInfoState } from "./userReducer";
import { uiReducer, UIState } from "./uiReducer";

export interface GlobalState {
  tmdbData: TMDBState;
  loginData: LoginState;
  movieListData: MovieListState;
  userInfo: UserInfoState;
  uiData: UIState;
}

// combineReducers just takes multiple reducers and puts them all into one big
// reducer. We write reducers in different places because it's clearer to
// separate them. This also means never write the exact same case for two
// reducers because the behavior will be unexpected
const rootReducer = combineReducers<GlobalState>({
  tmdbData: tmdbReducer,
  loginData: loginReducer,
  movieListData: movieListReducer,
  userInfo: userInfoReducer,
  uiData: uiReducer,
});

export default rootReducer;
