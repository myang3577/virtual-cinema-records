import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { searchMovies } from "../actions/actions";
import { LoadingState } from "../reducers/otherReducer";
import { ThemeProvider } from "@material-ui/core/styles";
import { checkLogin, createAcct } from "../actions/loginActions";
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

  // const [localUsername, setLocalUsername] = useState("");
  // const [localPassword, setLocalPassword] = useState("");

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

  // const username: any = useSelector<GlobalState>(
  //   (state) => state.loginData.username
  // );
  // const password: any = useSelector<GlobalState>(
  //   (state) => state.loginData.password
  // );
  // const isLoggedIn: any = useSelector<GlobalState>(
  //   (state) => state.loginData.isLoggedIn
  // );
  // const requestFeedback: any = useSelector<GlobalState>(
  //   (state) => state.loginData.requestFeedback
  // );

  const dispatch = useDispatch();

  // const re2 = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])

  // const partOne = (
  //   <div>
  //     Count: {count}
  //     <br />
  //     <button onClick={() => setCount(count + 1)}>+1</button>
  //     <br />
  //     <input
  //       value={movieQuery}
  //       onChange={(e) => setMovieQuery(e.target.value)}
  //     ></input>
  //     &nbsp;
  //     {/* This is thunk specific. Use it as is. Always call dispatch on the async api call */}
  //     <ThemeProvider theme={tealLimeTheme}>
  //       <LoadingButton
  //         onClick={() => {
  //           dispatch(searchMovies(movieQuery));
  //         }}
  //         loading={loading === LoadingState.LOADING}
  //       >
  //         Search Movies
  //       </LoadingButton>
  //     </ThemeProvider>
  //     {movieSearchResult.results
  //       ? movieSearchResult.results.map((e: any, index: number) => (
  //           <div key={index}>{e.title}</div>
  //         ))
  //       : ""}
  //   </div>
  // );

  return (
    // This component layout will need to change, temporary for starter code
    <div>
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
      <Login />
      <CreateAccount />
    </div>
  );
}

function Login() {
  const [localUsername, setLocalUsername] = useState("");
  const [localPassword, setLocalPassword] = useState("");

  // const loading: LoadingState = useSelector<GlobalState>(
  //   (state) => state.otherData.loading
  // ) as LoadingState;

  const username: any = useSelector<GlobalState>(
    (state) => state.loginData.username
  );
  const password: any = useSelector<GlobalState>(
    (state) => state.loginData.password
  );
  const isLoggedIn: any = useSelector<GlobalState>(
    (state) => state.loginData.isLoggedIn
  );

  const loginFeedback: any = useSelector<GlobalState>(
    (state) => state.loginData.loginFeedback
  );

  const EMAIL_FORMAT = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  const dispatch = useDispatch();

  return (
    <div id="loginContainer">
      <h1>Welcome to CAO!</h1>
      <p>Please login below</p>
      <div id={"formWrapper"}>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            // console.log(EMAIL_FORMAT.test(String(username).toLowerCase()));
            console.log(EMAIL_FORMAT.test(String(localUsername).toLowerCase()));
            console.log(localUsername);

            if (localUsername === "" || localPassword === "") {
              alert(
                "Your username or password is empty. Please provide" +
                  " both a username and a password"
              );
            } else if (
              !EMAIL_FORMAT.test(String(localUsername).toLowerCase())
            ) {
              alert("Your username must be a valid email address");
            } else {
              dispatch(checkLogin(localUsername, localPassword));
            }
          }}
        >
          Username: &nbsp;
          <input
            type={"text"}
            value={localUsername}
            onChange={(event) => {
              setLocalUsername(event.target.value);
            }}
            placeholder="Enter username here"
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
        {loginFeedback}
        <br />
        Current store username is: {username.toString()} and its password is:{" "}
        {password} and isLoggedIn is: {isLoggedIn.toString()}
      </div>
    </div>
  );
}

function CreateAccount() {
  const [localUsername, setLocalUsername] = useState("");
  const [localPassword, setLocalPassword] = useState("");

  // const loading: LoadingState = useSelector<GlobalState>(
  //   (state) => state.otherData.loading
  // ) as LoadingState;

  // const username: any = useSelector<GlobalState>(
  //   (state) => state.loginData.username
  // );
  // const password: any = useSelector<GlobalState>(
  //   (state) => state.loginData.password
  // );

  // const isLoggedIn: any = useSelector<GlobalState>(
  //   (state) => state.loginData.isLoggedIn
  // );
  const createAcctFeedback: any = useSelector<GlobalState>(
    (state) => state.loginData.createAcctFeedback
  );

  const dispatch = useDispatch();
  return (
    <div id="createAccountContainer">
      <h3>If you do not have an account, please create one below</h3>
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
              dispatch(createAcct(localUsername, localPassword));
            }
          }}
        >
          Username: &nbsp;
          <input
            type={"text"}
            value={localUsername}
            onChange={(event) => {
              setLocalUsername(event.target.value);
            }}
            placeholder="Enter username here"
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
        {createAcctFeedback}
        <br />
        {/* After creating an account try signing in above. */}
        {/* Current store username is: {username.toString()} and its password is:{" "}
        {password} and isLoggedIn is: {isLoggedIn.toString()} */}
      </div>
    </div>
  );
}

export default Home;
