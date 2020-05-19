import React, { useEffect } from "react";
import List from "@material-ui/core/List";
import {
  ListItem,
  ListItemText,
  Popper,
  ClickAwayListener,
  Paper,
} from "@material-ui/core";
import CheckBoxLabels from "./CheckBoxLabels";

interface MenuProps {
  handlerFunction: (event: React.ChangeEvent<HTMLInputElement>) => any;
  genreToDisplay: { [key: string]: boolean };
  recommendationToDisplay: { [key: string]: boolean };
}

export default function SimpleListMenu(props: MenuProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [genreString, setGenreString] = React.useState("");
  const [genreSelectOpen, setGenreSelectOpen] = React.useState<boolean>(false);

  useEffect(() => {
    let newGenreString = "";
    Object.keys(props.recommendationToDisplay).forEach((keyName: string) => {
      if (props.recommendationToDisplay[keyName]) {
        newGenreString += keyName + ", ";
      }
    });
    Object.keys(props.genreToDisplay).forEach((keyName: string) => {
      if (props.genreToDisplay[keyName]) {
        newGenreString += keyName + ", ";
      }
    });

    setGenreString(newGenreString.substring(0, newGenreString.length - 2));
  }, [props.genreToDisplay, props.recommendationToDisplay]);

  return (
    <ClickAwayListener onClickAway={() => setGenreSelectOpen(false)}>
      <Paper>
        <List component="nav">
          <ListItem
            button
            onClick={(event: React.MouseEvent<HTMLElement>) => {
              setAnchorEl(event.currentTarget);
              setGenreSelectOpen(!genreSelectOpen);
            }}
          >
            <ListItemText
              primary="Selected Genres"
              secondary={
                genreString
              } /*"Now Playing, Popular" secondary="Now Playing, Popular"*/
            />
          </ListItem>
        </List>

        <Popper
          open={genreSelectOpen}
          anchorEl={anchorEl}
          placement={"bottom-start"}
        >
          {/* Hello world */}
          {props.recommendationToDisplay &&
          Object.keys(props.recommendationToDisplay).length !== 0 ? (
            <CheckBoxLabels
              handlerFunction={props.handlerFunction}
              genreToDisplay={props.recommendationToDisplay}
              recommendationType={"Personal Recommendations"}
            />
          ) : (
            ""
          )}
          <CheckBoxLabels
            handlerFunction={props.handlerFunction}
            genreToDisplay={props.genreToDisplay}
            recommendationType={"General Recommendations"}
          />
        </Popper>
      </Paper>
    </ClickAwayListener>
  );
}
