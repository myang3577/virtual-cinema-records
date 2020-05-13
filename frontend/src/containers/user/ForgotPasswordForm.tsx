import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { forgotPassword } from "../../actions/loginActions";
import { GlobalState } from "../../reducers/rootReducer";
import { UsernameField } from "../../components/Username";
import { LoadingButton } from "../../components/LoadingButton";
import { openSnackBar } from "../../actions/uiActions";
import { validEmail } from "../../Constants";
import { Typography } from "@material-ui/core";

function ForgotPassword() {
  const [localUsername, setLocalUsername] = useState("");

  const feedback: any = useSelector<GlobalState>(
    (state) => state.loginData.passwordRecoverFeedback
  );

  const dispatch = useDispatch();

  const handleSubmit = () => {
    if (localUsername === "") {
      dispatch(
        openSnackBar(
          "Your entered username is empty. Please provide a valid email username"
        )
      );
    } else if (!validEmail(localUsername)) {
      dispatch(openSnackBar("Your username must be a valid email address"));
    } else {
      dispatch(forgotPassword(localUsername));
    }
  };

  useEffect(() => {
    if (feedback !== "") {
      dispatch(openSnackBar(feedback));
    }
  }, [dispatch, feedback]);

  return (
    <div className="user-form">
      <Typography variant="h6">
        Enter your username to send an email to recover your password
      </Typography>
      <UsernameField
        error={localUsername !== "" && !validEmail(localUsername)}
        username={localUsername}
        loading={false}
        setUsername={setLocalUsername}
      />
      <div className="divider"></div>
      <LoadingButton onClick={handleSubmit} loading={false}>
        Send Email
      </LoadingButton>
    </div>
  );
}

export default ForgotPassword;
