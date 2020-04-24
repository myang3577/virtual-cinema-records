import React from "react";
import { useDispatch } from "react-redux";
import { logout } from "../actions/loginActions";
import { LoadingButton } from "../components/LoadingButton";

function LoginForm() {
  const dispatch = useDispatch();

  const handleSubmit = () => {
    dispatch(logout());
  };

  return (
    <div className="user-form">
      <LoadingButton onClick={handleSubmit} loading={false}>
        Submit
      </LoadingButton>
    </div>
  );
}

export default LoginForm;
