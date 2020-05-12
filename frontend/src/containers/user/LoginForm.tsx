import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { checkLogin } from "../../actions/loginActions";
import { UsernameField } from "../../components/Username";
import { PasswordField } from "../../components/Password";
import { LoadingButton } from "../../components/LoadingButton";
import { GlobalState } from "../../reducers/rootReducer";
import { Link } from "@material-ui/core";
import {
  AccountModalContent,
  setAccountModalContent,
  openSnackBar,
  SnackBarActionType,
} from "../../actions/uiActions";
import { validEmail } from "../../Constants";
import SnackBar from "../SnackBar";

function LoginForm() {
  const [localUsername, setLocalUsername] = useState("");
  const [localPassword, setLocalPassword] = useState("");

  const feedback: any = useSelector<GlobalState>(
    (state) => state.loginData.loginFeedback
  );

  const dispatch = useDispatch();

  const handleSubmit = () => {
    if (localUsername === "" || localPassword === "") {
      dispatch(
        openSnackBar(
          "Your username or password is empty. Please provide" +
            " both a username and a password"
        )
      );
    } else if (!validEmail(localUsername)) {
      dispatch(openSnackBar("Your username must be a valid email address"));
    } else {
      dispatch(checkLogin(localUsername, localPassword));
    }
  };

  useEffect(() => {
    if (feedback !== "") {
      dispatch(openSnackBar(feedback, SnackBarActionType.MYMOVIES));
    }
  }, [dispatch, feedback]);

  const openRegister = () => {
    dispatch(setAccountModalContent(AccountModalContent.REGISTER));
  };

  const openForgotPassword = () => {
    dispatch(setAccountModalContent(AccountModalContent.FORGOT_PASSWORD));
  };

  return (
    <div className="user-form">
      <UsernameField
        error={localUsername !== "" && !validEmail(localUsername)}
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
      <br />
      <div className="account-link">
        <Link onClick={openRegister} className="text-link">
          Not a member? Register
        </Link>
      </div>
      <br />
      <div className="account-link">
        <Link onClick={openForgotPassword} className="text-link">
          Forgot password?
        </Link>
      </div>
    </div>
  );
}

export default LoginForm;
