import React from "react";
import { Button, CircularProgress } from "@material-ui/core";
import "./App.css";

export interface LoadingButtonProps {
  onClick: () => any;
  loading: boolean;
  children: React.ReactNode;
}

export function LoadingButton(props: LoadingButtonProps) {
  return (
    <Button
      variant="contained"
      color="primary"
      disableElevation
      disabled={props.loading}
      onClick={props.onClick}
    >
      {props.loading && <CircularProgress size={18} color="secondary" />}
      &nbsp; {props.children} &nbsp;
    </Button>
  );
}

export default LoadingButton;
