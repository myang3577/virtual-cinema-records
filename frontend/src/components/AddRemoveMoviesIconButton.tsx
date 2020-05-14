import React from "react";
import { IconButton, Tooltip } from "@material-ui/core";
import { Add, Delete } from "@material-ui/icons";

export interface AddRemoveMoviesIconButtonProps {
  inUserList: boolean;
  isLoggedIn: boolean;
  onClick: () => void;
}

function AddRemoveMoviesIconButton(props: AddRemoveMoviesIconButtonProps) {
  return (
    <Tooltip
      title={
        props.inUserList
          ? "Remove from MyMovies"
          : props.isLoggedIn
          ? "Add to MyMovies"
          : "Login to add to MyMovies"
      }
      placement="top"
    >
      <span>
        <IconButton
          size="medium"
          style={{ margin: 0 }}
          onClick={props.onClick}
          disabled={!props.isLoggedIn}
        >
          {props.inUserList ? <Delete /> : <Add />}
        </IconButton>
      </span>
    </Tooltip>
  );
}

export default AddRemoveMoviesIconButton;
