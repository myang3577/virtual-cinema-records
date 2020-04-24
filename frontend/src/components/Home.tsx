import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { searchMovies } from "../actions/actions";
import { LoadingState } from "../reducers/otherReducer";
import { LoadingButton } from "./LoadingButton";
import { GlobalState } from "../reducers/rootReducer";
import LoginForm from "../containers/LoginForm";
import RegisterForm from "../containers/RegisterForm";
import ChangePasswordForm from "../containers/ChangePasswordForm";
import ForgotPassword from "../containers/ForgotPasswordForm";
import LogoutForm from "../containers/LogoutForm";

// Email regex used to determine if the entered email address is valid
//eslint-disable-next-line
const EMAIL_FORMAT = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

/**
 * Home is a component that we want to render. It has been implemented with
 * react hooks here instead of a react class
 */
function Home() {
  // This is the same as creating a state field called count and tying
  // a setter called setCount to it. useState(0) means the initial state is 0
  const [count, setCount] = useState(0);

  // Same as above but for the movie query
  const [movieQuery, setMovieQuery] = useState("");

  // Define two local variables that represent the movieSearchREsult and
  // loading. The local variables defined here should be the ones you intend to
  // use in rendering the component. the userSelector is the magic function that
  // binds the local variable to a particular state. By binding them to that
  // state, this variable will be updated anytime the state its bound to changes
  const movieSearchResult: any = useSelector<GlobalState>(
    (state) => state.otherData.movieSearchResult
  );
  const loading: LoadingState = useSelector<GlobalState>(
    (state) => state.otherData.loading
  ) as LoadingState;

  const dispatch = useDispatch();

  // Temp selectors
  const username: any = useSelector<GlobalState>(
    (state) => state.loginData.username
  );
  const password: any = useSelector<GlobalState>(
    (state) => state.loginData.password
  );
  const isLoggedIn: any = useSelector<GlobalState>(
    (state) => state.loginData.isLoggedIn
  );

  return (
    // This component layout will need to change, temporary for starter code
    <div>
      {/* Should be refactored into MovieSearch or something */}
      <div>
        Count: {count}
        <br />
        <button onClick={() => setCount(count + 1)}>+1</button>
        <br />
        <input
          value={movieQuery}
          onChange={(e) => setMovieQuery(e.target.value)}
        ></input>
        &nbsp;
        {/* This is thunk specific. Use it as is. Always call dispatch on the async api call */}
        <LoadingButton
          onClick={() => {
            dispatch(searchMovies(movieQuery));
          }}
          loading={loading === LoadingState.LOADING}
        >
          Search Movies (primary color)
        </LoadingButton>
        <LoadingButton
          onClick={() => {
            dispatch(searchMovies(movieQuery));
          }}
          loading={loading === LoadingState.LOADING}
          color={"secondary"}
        >
          Search Movies (secondary color)
        </LoadingButton>
        {movieSearchResult.results
          ? movieSearchResult.results.map((e: any, index: number) => (
              <div key={index}>{e.title}</div>
            ))
          : ""}
      </div>
      <h1>Welcome to CAO!</h1>
      <h2>Please login below</h2>
      <LoginForm />
      {/* {loginFeedback} */}
      <br />
      Current store username is: {username.toString()} and its password is:{" "}
      {password} and isLoggedIn is: {isLoggedIn.toString()}
      {/* Remove later ^ */}
      <h2>If you do not have an account, please create one below</h2>
      <RegisterForm />
      <h2>
        If you want to change your password, please login above first.
        <br />
        Then provide your old and new password
      </h2>
      <ChangePasswordForm />
      <h2>
        If you want to reset your password, please provide your email below.
        <br />
      </h2>
      <ForgotPassword />
      <h2>
        If you want to logout of your account, click the button below
        <br />
      </h2>
      <LogoutForm />
    </div>
  );
}

export default Home;
