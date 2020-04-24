import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { changePassword } from "../actions/loginActions";
import { GlobalState } from "../reducers/rootReducer";
import { PasswordField } from "../components/Password";
import { LoadingButton } from "../components/LoadingButton";

function ChangePassword() {
  const [localPassword, setLocalPassword] = useState("");
  const [newLocalPassword, setNewLocalPassword] = useState("");

  const username: any = useSelector<GlobalState>(
    (state) => state.loginData.username
  );

  const feedback: any = useSelector<GlobalState>(
    (state) => state.loginData.passwordChangeFeedback
  );

  const dispatch = useDispatch();

  const handleSubmit = () => {
    if (localPassword === "" || newLocalPassword === "") {
      alert(
        "Your current password or new password password is empty. Please provide" +
          " both your current password and new password"
      );
    } else {
      dispatch(changePassword(username, localPassword, newLocalPassword));
    }
  };

  return (
    <div className="user-form">
      <PasswordField
        password={localPassword}
        loading={false}
        setPassword={setLocalPassword}
        placeholder={"Old Password"}
      />
      <div className="divider"></div>
      <PasswordField
        password={newLocalPassword}
        loading={false}
        setPassword={setNewLocalPassword}
        placeholder={"New Password"}
      />
      <div className="divider"></div>
      <LoadingButton onClick={handleSubmit} loading={false}>
        Submit
      </LoadingButton>
      {feedback}
    </div>
  );
}

export default ChangePassword;
