import React from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../actions/loginActions";
import { LoadingButton } from "../../components/LoadingButton";
import {
  closeAccountModal,
  setAccountModalContent,
  AccountModalContent,
  openSnackBar,
} from "../../actions/uiActions";

function LoginForm() {
  const dispatch = useDispatch();

  const handleSubmit = () => {
    dispatch(logout());
    dispatch(closeAccountModal());
    dispatch(setAccountModalContent(AccountModalContent.LOGIN));
    dispatch(openSnackBar("Logged out"));
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
