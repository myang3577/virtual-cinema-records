import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { checkLogin, Login } from "../actions/loginActions";
import { UsernameField } from "../components/Username";
import { PasswordField } from "../components/Password";
import { LoadingButton } from "../components/LoadingButton";
import { GlobalState } from "../reducers/rootReducer";
import { Link } from "@material-ui/core";
import {
  accountLogoutModal,
  accountRegisterModal,
  accountCloseModal,
} from "../actions/uiActions";

// Email regex used to determine if the entered email address is valid
//eslint-disable-next-line
const EMAIL_FORMAT = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

function LoginForm() {
  const [localUsername, setLocalUsername] = useState("");
  const [localPassword, setLocalPassword] = useState("");

  const feedback: any = useSelector<GlobalState>(
    (state) => state.loginData.loginFeedback
  );

  const isLoggedIn: any = useSelector<GlobalState>(
    (state) => state.loginData.isLoggedIn
  );

  const dispatch = useDispatch();

  const handleSubmit = () => {
    if (localUsername === "" || localPassword === "") {
      alert(
        "Your username or password is empty. Please provide" +
          " both a username and a password"
      );
    } else if (!EMAIL_FORMAT.test(String(localUsername).toLowerCase())) {
      alert("Your username must be a valid email address");
    } else {
      dispatch(checkLogin(localUsername, localPassword));
      if (isLoggedIn) {
        dispatch(accountLogoutModal());
        dispatch(accountCloseModal());
      }
    }
  };

  const openRegister = () => {
    dispatch(accountRegisterModal());
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
        Login
      </LoadingButton>
      {feedback}
      <br />
      <div className="account-link">
        <Link onClick={openRegister}>Not a member? Register</Link>
      </div>
    </div>
  );
}

export default LoginForm;
