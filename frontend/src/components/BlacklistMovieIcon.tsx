import React from "react";
import { IconButton, Tooltip } from "@material-ui/core";
import BlockIcon from "@material-ui/icons/Block";

export interface BlacklistMovieProps {
  inBlacklist: boolean;
  isLoggedIn: boolean;
  onClick: () => void;
}

function BlacklistMovieIcon(props: BlacklistMovieProps) {
  return (
    <Tooltip
      title={
        props.inBlacklist
          ? "Remove from blacklist"
          : props.isLoggedIn
          ? "Add to blacklist"
          : "Login to add to blacklist"
      }
      placement="top"
    >
      <span>
        <IconButton
          size="medium"
          onClick={props.onClick}
          disabled={!props.isLoggedIn}
        >
          {props.inBlacklist ? (
            <BlockIcon style={{ color: "red" }} />
          ) : (
            <BlockIcon style={{ color: "grey" }} />
          )}
        </IconButton>
      </span>
    </Tooltip>
  );
}

export default BlacklistMovieIcon;
