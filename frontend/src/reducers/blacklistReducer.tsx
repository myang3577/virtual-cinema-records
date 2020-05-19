import { LoadingState } from "./tmdbReducer";
import {
  BlacklistAction,
  BlacklistActionType,
} from "../actions/blacklistAction";

export interface BlacklistState {
  loading: LoadingState;
  blacklist: [];
}

const initialState: BlacklistState = {
  loading: LoadingState.IDLE,
  blacklist: [],
};

export const blacklistReducer = (
  state = initialState,
  action: BlacklistAction
): BlacklistState => {
  switch (action.type) {
    case BlacklistActionType.BLACKLIST_BEGIN:
      return {
        ...state,
        loading: LoadingState.LOADING,
      };
    case BlacklistActionType.GET_BLACKLIST_END:
      return {
        ...state,
        loading: LoadingState.DONE,
        blacklist: action.payload.blacklist!,
      };
    default:
      return state;
  }
};
