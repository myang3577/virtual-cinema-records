import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { forgotPassword } from "../actions/loginActions";
import { GlobalState } from "../reducers/rootReducer";
import { UsernameField } from "../components/Username";
import { LoadingButton } from "../components/LoadingButton";

// Email regex used to determine if the entered email address is valid
//eslint-disable-next-line
const EMAIL_FORMAT = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

function ForgotPassword() {
  const [localUsername, setLocalUsername] = useState("");

  const feedback: any = useSelector<GlobalState>(
    (state) => state.loginData.passwordRecoverFeedback
  );

  const dispatch = useDispatch();

  const handleSubmit = () => {
    if (localUsername === "") {
      alert(
        "Your entered username is empty. Please provide a valid email username"
      );
    } else if (!EMAIL_FORMAT.test(String(localUsername).toLowerCase())) {
      alert("Your username must be a valid email address");
    } else {
      dispatch(forgotPassword(localUsername));
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
      <LoadingButton onClick={handleSubmit} loading={false}>
        Submit
      </LoadingButton>
      {feedback}
    </div>
  );
}

export default ForgotPassword;
