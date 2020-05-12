import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GlobalState } from "../../reducers/rootReducer";
import {
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import "../../styles/App.css";
import {
  closeAccountModal,
  AccountModalContent,
  openSnackBar,
  SnackBarActionType,
} from "../../actions/uiActions";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ForgotPasswordForm from "./ForgotPasswordForm";
import ChangePasswordForm from "./ChangePasswordForm";
import VCRSmallLogo from "../../images/VCRIconOnly.png";

function AccountModal() {
  const isLoggedIn = useSelector<GlobalState, boolean>(
    (state) => state.loginData.isLoggedIn
  );

  const username = useSelector<GlobalState, string>(
    (state) => state.loginData.username
  );

  const isModalOpen = useSelector<GlobalState, boolean>(
    (state) => state.uiData.accountModalOpen
  );

  const modalType = useSelector<GlobalState, AccountModalContent>(
    (state) => state.uiData.accountModalContent
  );

  const dispatch = useDispatch();

  const closeModal = () => {
    dispatch(closeAccountModal());
  };

  const accountModal = () => {
    switch (modalType) {
      case AccountModalContent.LOGIN:
        return <LoginForm />;
      case AccountModalContent.REGISTER:
        return <RegisterForm />;
      case AccountModalContent.CHANGE_PASSWORD:
        return <ChangePasswordForm />;
      case AccountModalContent.FORGOT_PASSWORD:
        return <ForgotPasswordForm />;
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(
        openSnackBar(username + " logged in", SnackBarActionType.MYMOVIES)
      );
    }
  }, [dispatch, isLoggedIn, username]);

  return (
    <Dialog open={isModalOpen} onClose={closeModal} className="account-modal">
      <DialogTitle>
        <div className="account-modal-close-button">
          <IconButton onClick={closeModal}>
            <CloseIcon />
          </IconButton>
        </div>
      </DialogTitle>
      <DialogContent>
        <div id="account-modal-content">
          <img src={VCRSmallLogo} id="modal-img" alt="VCR logo" />
          {accountModal()}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AccountModal;
