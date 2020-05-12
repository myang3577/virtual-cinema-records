import React, { useState, useEffect } from "react";
import { withStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox, { CheckboxProps } from "@material-ui/core/Checkbox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import Favorite from "@material-ui/icons/Favorite";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";
// import { GenreItem, genreList } from "../containers/pages/Constants";

interface CheckBoxProps {
  handlerFunction: (event: React.ChangeEvent<HTMLInputElement>) => any;
  //   userMyMoviesList: [];
  //   loading: LoadingState;
  //   page: PageType;
}

const GreenCheckbox = withStyles({
  root: {
    color: green[400],
    "&$checked": {
      color: green[600],
    },
  },
  checked: {},
})((props: CheckboxProps) => <Checkbox color="default" {...props} />);

export default function CheckboxLabels(props: CheckBoxProps) {
  const [checkState, setCheckState]: [any, any] = useState({
    "Now Playing": true,
    Popular: true,
    Upcoming: true,
    Action: false,
    Adventure: false,
    Animation: false,
    Comedy: false,
    Crime: false,
    Documentary: false,
    Drama: false,
    Family: false,
    Fantasy: false,
    History: false,
    Horror: false,
    Music: false,
    Mystery: false,
    Romance: false,
    "Science Fiction": false,
    "TV Movie": false,
    Thriller: false,
    War: false,
    Western: false,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckState({ ...checkState, [event.target.name]: event.target.checked });
    props.handlerFunction(event);
    // Call passed down handle change function
  };

  return (
    <div>
      <FormGroup row>
        <FormControlLabel
          control={
            <Checkbox
              checked={checkState["Now Playing"]}
              onChange={handleChange}
              name="Now Playing"
            />
          }
          label="Now Playing"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={checkState.Popular}
              onChange={handleChange}
              name="Popular"
            />
          }
          label="Popular"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={checkState.Upcoming}
              onChange={handleChange}
              name="Upcoming"
            />
          }
          label="Upcoming"
        />
      </FormGroup>
      <FormGroup row>
        <FormControlLabel
          control={
            <Checkbox
              checked={checkState.Action}
              onChange={handleChange}
              name="Action"
            />
          }
          label="Action"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={checkState.Adventure}
              onChange={handleChange}
              name="Adventure"
            />
          }
          label="Adventure"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={checkState.Animation}
              onChange={handleChange}
              name="Animation"
            />
          }
          label="Animation"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={checkState.Comedy}
              onChange={handleChange}
              name="Comedy"
            />
          }
          label="Comedy"
        />
      </FormGroup>
      <FormGroup row>
        <FormControlLabel
          control={
            <Checkbox
              checked={checkState.Crime}
              onChange={handleChange}
              name="Crime"
            />
          }
          label="Crime"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={checkState.Documentary}
              onChange={handleChange}
              name="Documentary"
            />
          }
          label="Documentary"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={checkState.Drama}
              onChange={handleChange}
              name="Drama"
            />
          }
          label="Drama"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={checkState.Family}
              onChange={handleChange}
              name="Family"
            />
          }
          label="Family"
        />
      </FormGroup>
      <FormGroup row>
        <FormControlLabel
          control={
            <Checkbox
              checked={checkState.Fantasy}
              onChange={handleChange}
              name="Fantasy"
            />
          }
          label="Fantasy"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={checkState.History}
              onChange={handleChange}
              name="History"
            />
          }
          label="History"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={checkState.Horror}
              onChange={handleChange}
              name="Horror"
            />
          }
          label="Horror"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={checkState.Music}
              onChange={handleChange}
              name="Music"
            />
          }
          label="Music"
        />
      </FormGroup>
      <FormGroup row>
        <FormControlLabel
          control={
            <Checkbox
              checked={checkState.Mystery}
              onChange={handleChange}
              name="Mystery"
            />
          }
          label="Mystery"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={checkState.Romance}
              onChange={handleChange}
              name="Romance"
            />
          }
          label="Romance"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={checkState["Science Fiction"]}
              onChange={handleChange}
              name="Science Fiction"
            />
          }
          label="Science Fiction"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={checkState["TV Movie"]}
              onChange={handleChange}
              name="TV Movie"
            />
          }
          label="TV Movie"
        />
      </FormGroup>
      <FormGroup row>
        <FormControlLabel
          control={
            <Checkbox
              checked={checkState.Thriller}
              onChange={handleChange}
              name="Thriller"
            />
          }
          label="Thriller"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={checkState.War}
              onChange={handleChange}
              name="War"
            />
          }
          label="War"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={checkState.Western}
              onChange={handleChange}
              name="Western"
            />
          }
          label="Western"
        />
      </FormGroup>
    </div>
  );
}
