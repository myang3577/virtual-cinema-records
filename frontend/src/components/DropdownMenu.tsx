import React, { useEffect } from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import CheckBoxLabels from "./CheckBox";
import { Check } from "@material-ui/icons";
import { GenreItem } from "../containers/pages/Constants";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.background.paper,
    },
  })
);

interface MenuProps {
  handlerFunction: (event: React.ChangeEvent<HTMLInputElement>) => any;
  genreToDisplay: { [key: string]: boolean };
  // Popular: boolean;
  // Upcoming: boolean;
  // Action: boolean;
  // Adventure: boolean;
  // Animation: boolean;
  // Comedy: boolean;
  // Crime: boolean;
  // Documentary: boolean;
  // Drama: boolean;
  // Family: boolean;
  // Fantasy: boolean;
  // History: boolean;
  // Horror: boolean;
  // Music: boolean;
  // Mystery: boolean;
  // Romance: boolean;
  // "Science Fiction": boolean;
  // "TV Movie": boolean;
  // Thriller: boolean;
  // War: boolean;
  // Western: boolean;
  // };
}

export default function SimpleListMenu(props: MenuProps) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedIndex, setSelectedIndex] = React.useState(1);
  const [genreString, setGenreString] = React.useState("");

  const handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    let newGenreString = "";
    Object.keys(props.genreToDisplay).map(
      (keyName: string, keyIndex: number) => {
        if (props.genreToDisplay[keyName]) {
          newGenreString += keyName + ", ";
        }
      }
    );

    setGenreString(newGenreString.substring(0, newGenreString.length - 2));
  }, [props.genreToDisplay]);

  return (
    <div className={classes.root}>
      <List component="nav" aria-label="Device settings">
        <ListItem
          button
          aria-haspopup="true"
          aria-controls="lock-menu"
          //   aria-label="when device is locked"
          onClick={handleClickListItem}
        >
          <ListItemText
            primary="Selected Genres"
            secondary={
              genreString
            } /*"Now Playing, Popular" secondary="Now Playing, Popular"*/
          />
        </ListItem>
      </List>
      <Menu
        id="lock-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem
          disableRipple
          disableTouchRipple
          style={{ backgroundColor: "transparent" }}
        >
          <CheckBoxLabels
            handlerFunction={props.handlerFunction}
            genreToDisplay={props.genreToDisplay}
          />
        </MenuItem>
      </Menu>
    </div>
  );
}
