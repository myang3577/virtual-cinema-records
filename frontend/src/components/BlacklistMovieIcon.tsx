import React from "react";
import {
  IconButton,
  Tooltip,
  makeStyles,
  createStyles,
  Theme,
} from "@material-ui/core";
import BlockIcon from "@material-ui/icons/Block";

export interface BlacklistMovieProps {
  inBlacklist: boolean;
  isLoggedIn: boolean;
  onClick: () => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    blacklist: {
      margin: 0,
      fontSize: "inherit",
    },
  })
);

function BlacklistMovieIcon(props: BlacklistMovieProps) {
  const classes = useStyles();

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
          size="small"
          onClick={props.onClick}
          disabled={!props.isLoggedIn}
        >
          {props.inBlacklist ? (
            <BlockIcon className={classes.blacklist} style={{ color: "red" }} />
          ) : (
            <BlockIcon
              className={classes.blacklist}
              style={{ color: "grey" }}
            />
          )}
        </IconButton>
      </span>
    </Tooltip>
  );
}

export default BlacklistMovieIcon;
