import React, { useState } from "react";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { Grid, Paper } from "@material-ui/core";

interface CheckBoxLabelsProps {
  handlerFunction: (event: React.ChangeEvent<HTMLInputElement>) => any;
  genreToDisplay: { [key: string]: boolean };
  recommendationType: string;
}

export default function CheckboxLabels(props: CheckBoxLabelsProps) {
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
    for (let i = 0; i < keys.length; i += CHECKBOX_PER_LINE) {
      let slicedArray = keys.slice(i, i + CHECKBOX_PER_LINE);
      jsxArray.push(
        <Grid container item spacing={2} key={i}>
          {slicedArray.map((keyName: any, keyIndex: number) => (
            <Grid item sm={6} md={4} lg={3} xl={3} key={keyIndex}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checkState[keyName]}
                    onChange={handleChange}
                    name={keyName}
                    color="primary"
                  />
                }
                label={keyName}
              />
            </Grid>
          ))}
        </Grid>
      );
    }
    return jsxArray;
  };

  return (
    <Paper style={{ paddingLeft: "10px" }} elevation={4}>
      <Grid container spacing={1} style={{ width: "60vw" }}>
        <div
          style={{ fontSize: "20px", paddingTop: "10px", paddingLeft: "5px" }}
        >
          {props.recommendationType}
        </div>
        {/* General Recommendations */}
        {renderCheckBoxes()}
      </Grid>
    </Paper>
  );
}
