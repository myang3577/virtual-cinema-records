import React, { useState } from "react";
import { useSelector } from "react-redux";
import { GlobalState } from "../reducers/rootReducer";
import ChangePasswordForm from "./ChangePasswordForm";
import ForgotPassword from "./ForgotPasswordForm";
import MovieGrid from "./MovieGrid";


/**
 * Home is a component that we want to render. It has been implemented with
 * react hooks here instead of a react class
 */
function Home() {
  // This is the same as creating a state field called count and tying
  // a setter called setCount to it. useState(0) means the initial state is 0
  const [count, setCount] = useState(0);

  // Same as above but for the movie query
  const [] = useState("");



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
        &nbsp;
        {/* This is thunk specific. Use it as is. Always call dispatch on the async api call */}
        <MovieGrid />
      </div>
      <h1>Welcome to CAO!</h1>
      <h2>Please login by clicking above</h2>
      {/* {loginFeedback} */}
      <br />
      Current store username is: {username.toString()} and its password is:{" "}
      {password} and isLoggedIn is: {isLoggedIn.toString()}
      {/* Remove later ^ */}
      <h2>
        If you want to change your password, please login above first.
        <br />
        Then provide your old and new password
      </h2>
      <ChangePasswordForm />
      <h2>
        If you forgot your password, please provide your email below.
        <br />
      </h2>
      <ForgotPassword />
    </div>
  );
}

export default Home;
