import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createAcct } from "../actions/loginActions";
import { UsernameField } from "../components/Username";
import { PasswordField } from "../components/Password";
import { LoadingButton } from "../components/LoadingButton";
import { GlobalState } from "../reducers/rootReducer";
import { Link } from "@material-ui/core";
import { accountLoginModal } from "../actions/uiActions";
import { FullscreenExit } from "@material-ui/icons";

// Email regex used to determine if the entered email address is valid
//eslint-disable-next-line
const EMAIL_FORMAT = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

function LoginForm() {
  const [localUsername, setLocalUsername] = useState("");
  const [localPassword, setLocalPassword] = useState("");
  const [localRepeatPassword, setLocalRepeatPassword] = useState("");

  const feedback: any = useSelector<GlobalState>(
    (state) => state.loginData.createAcctFeedback
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
    } else if (localPassword !== localRepeatPassword) {
      alert("Passwords do not match");
    } else {
      dispatch(createAcct(localUsername, localPassword, localRepeatPassword));
    }
  };

  const openLogin = () => {
    dispatch(accountLoginModal(false));
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
      <PasswordField
        password={localRepeatPassword}
        loading={false}
        setPassword={setLocalRepeatPassword}
        placeholder={"Confirm Password"}
      />
      <div className="divider"></div>
      <LoadingButton onClick={handleSubmit} loading={false}>
        Register
      </LoadingButton>
      <br />
      <div className="account-link">
        <Link onClick={openLogin}>Already a member? Login</Link>
      </div>
      {feedback}
    </div>
  );
}

export default LoginForm;
