import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { searchMovies } from "../actions/actions";
import { LoadingState } from "../reducers/otherReducer";
import { ThemeProvider } from "@material-ui/core/styles";
import { checkLogin } from "../actions/loginActions";
import { LoadingButton } from "./LoadingButton";
import { tealLimeTheme } from "../styles/MUITheme";
import "./App.css";
import { GlobalState } from "../reducers/rootReducer";

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

  const [localUsername, setLocalUsername] = useState("");
  const [localPassword, setLocalPassword] = useState("");

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

  const username: any = useSelector<GlobalState>(
    (state) => state.loginData.username
  );
  const password: any = useSelector<GlobalState>(
    (state) => state.loginData.password
  );
  const loginResult: any = useSelector<GlobalState>(
    (state) => state.loginData.loginResult
  );

  const dispatch = useDispatch();

  const partOne = (
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
      {/* This is thunk specific. Use it as it. Always call dispatch on the async api call */}
      <ThemeProvider theme={tealLimeTheme}>
        <LoadingButton
          onClick={() => {
            dispatch(searchMovies(movieQuery));
          }}
          loading={loading === LoadingState.LOADING}
        >
          Search Movies
        </LoadingButton>
      </ThemeProvider>
      {movieSearchResult.results
        ? movieSearchResult.results.map((e: any, index: number) => (
            <div key={index}>{e.title}</div>
          ))
        : ""}
    </div>
  );

  return (
    // This component layout will need to change, temporary for starter code
    <div>
      {partOne}
      <div>
        <h1>Welcome to CAO!</h1>
        <p>Please login below</p>
        <div id={"formWrapper"}>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (localUsername === "" || localPassword === "") {
                alert(
                  "Your username or password is empty. Please provide" +
                    " both a username and a password"
                );
              } else {
                dispatch(checkLogin(localUsername, localPassword));
              }
            }}
          >
            Name: &nbsp;
            <input
              type={"text"}
              value={localUsername}
              onChange={(event) => {
                setLocalUsername(event.target.value);
              }}
              placeholder="Enter name here"
            />
            <br />
            <br />
            Password: &nbsp;
            <input
              type={"password"}
              value={localPassword}
              onChange={(event) => {
                setLocalPassword(event.target.value);
              }}
              placeholder="Enter password here"
            />
            <br />
            <input type={"submit"} value={"Submit"} />
          </form>
          Current store username is: {username.toString()} and its password is:{" "}
          {password} and loginResult is: {loginResult.toString()}
        </div>
      </div>
    </div>
  );
}

export default Home;
