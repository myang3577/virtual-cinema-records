import React from "react";
import { useDispatch } from "react-redux";
import { logout } from "../actions/loginActions";
import { LoadingButton } from "../components/LoadingButton";
import { accountLoginModal, accountCloseModal } from  "../actions/uiActions";

function LoginForm() {
  const dispatch = useDispatch();

  const handleSubmit = () => {
    dispatch(logout());
    dispatch(accountCloseModal());
    dispatch(accountLoginModal());
  };

  return (
    <div className="user-form">
      <LoadingButton onClick={handleSubmit} loading={false}>
        Logout
      </LoadingButton>
    </div>
  );
}

export default LoginForm;
