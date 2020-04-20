import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { checkLogin } from "../actions/loginActions";
import { UserForm } from "../components/UserForm";

// Email regex used to determine if the entered email address is valid
//eslint-disable-next-line
const EMAIL_FORMAT = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

function LoginForm() {
  const [localUsername, setLocalUsername] = useState("");
  const [localPassword, setLocalPassword] = useState("");

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
    <UserForm
      error={
        localUsername !== "" &&
        !EMAIL_FORMAT.test(String(localUsername).toLowerCase())
      }
      username={localUsername}
      password={localPassword}
      setUsername={setLocalUsername}
      setPassword={setLocalPassword}
      onSubmit={handleSubmit}
      loading={false} // Add value here later
    />
  );
}

export default LoginForm;
