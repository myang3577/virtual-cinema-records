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
  genreToDisplay: { [key: string]: boolean };
  // genreToDisplay: {
  //   Popular: boolean;
  //   Upcoming: boolean;
  //   Action: boolean;
  //   Adventure: boolean;
  //   Animation: boolean;
  //   Comedy: boolean;
  //   Crime: boolean;
  //   Documentary: boolean;
  //   Drama: boolean;
  //   Family: boolean;
  //   Fantasy: boolean;
  //   History: boolean;
  //   Horror: boolean;
  //   Music: boolean;
  //   Mystery: boolean;
  //   Romance: boolean;
  //   "Science Fiction": boolean;
  //   "TV Movie": boolean;
  //   Thriller: boolean;
  //   War: boolean;
  //   Western: boolean;
  // };
}

export default function CheckboxLabels(props: CheckBoxProps) {
  const [checkState, setCheckState]: [any, any] = useState(
    props.genreToDisplay
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckState({ ...checkState, [event.target.name]: event.target.checked });
    props.handlerFunction(event);
  };

  const CHECKBOX_PER_LINE = 4;

  const renderCheckBoxes = () => {
    let jsxArray = [];

    let keys = Object.keys(props.genreToDisplay);
    // let slicedArray = []
    for (let i = 0; i < keys.length; i += CHECKBOX_PER_LINE) {
      let slicedArray = keys.slice(i, i + CHECKBOX_PER_LINE);
      jsxArray.push(
        <FormGroup row>
          {slicedArray.map((keyName: any, keyIndex: number) => {
            return (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checkState[keyName]}
                    onChange={handleChange}
                    name={keyName}
                  />
                }
                label={keyName}
              />
            );
          })}
        </FormGroup>
      );
    }
    return jsxArray;
  };

  return <div>{renderCheckBoxes()}</div>;
}
