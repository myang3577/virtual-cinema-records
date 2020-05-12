import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createAcct } from "../../actions/loginActions";
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
      dispatch(
        openSnackBar(
          "Your username or password is empty. Please provide" +
            " both a username and a password"
        )
      );
    } else if (!validEmail(localUsername)) {
      dispatch(openSnackBar("Your username must be a valid email address"));
    } else if (localPassword !== localRepeatPassword) {
      dispatch(openSnackBar("Passwords do not match"));
    } else {
      dispatch(createAcct(localUsername, localPassword, localRepeatPassword));
    }
  };

  useEffect(() => {
    if (feedback !== "") {
      dispatch(openSnackBar(feedback, SnackBarActionType.LOGIN));
    }
  }, [dispatch, feedback]);

  const openLogin = () => {
    dispatch(setAccountModalContent(AccountModalContent.LOGIN));
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
        <Link onClick={openLogin} className="text-link">
          Already a member? Login
        </Link>
      </div>
    </div>
  );
}

export default LoginForm;
