import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { checkLogin } from "../actions/loginActions";
import { UsernameField } from "../components/Username";
import { PasswordField } from "../components/Password";
import { LoadingButton } from "../components/LoadingButton";
import { GlobalState } from "../reducers/rootReducer";

// Email regex used to determine if the entered email address is valid
//eslint-disable-next-line
const EMAIL_FORMAT = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

function LoginForm() {
  const [localUsername, setLocalUsername] = useState("");
  const [localPassword, setLocalPassword] = useState("");

  const feedback: any = useSelector<GlobalState>(
    (state) => state.loginData.loginFeedback
  );
  const dispatch = useDispatch();

  const handleSubmit = () => {
    console.log(
      "EMAIL_FORMAT test: " +
        EMAIL_FORMAT.test(String(localUsername).toLowerCase())
    );
    console.log("LoginForm localUsername: " + localUsername);

    if (localUsername === "" || localPassword === "") {
      alert(
        "Your username or password is empty. Please provide" +
          " both a username and a password"
      );
    } else if (!EMAIL_FORMAT.test(String(localUsername).toLowerCase())) {
      alert("Your username must be a valid email address");
    } else {
      dispatch(checkLogin(localUsername, localPassword));
    }
  };

  return (
    <div className="user-form">
      <UsernameField
        error={
          localUsername !== "" &&
          !EMAIL_FORMAT.test(String(localUsername).toLowerCase())
        }
        username={localUsername}
        loading={false}
        setUsername={setLocalUsername}
      />
      <div className="divider"></div>
      <PasswordField
        password={localPassword}
        loading={false}
        setPassword={setLocalPassword}
        placeholder={"Password"}
      />
      <div className="divider"></div>
      <LoadingButton onClick={handleSubmit} loading={false}>
        Submit
      </LoadingButton>
      {feedback}
    </div>
  );
}

export default LoginForm;
