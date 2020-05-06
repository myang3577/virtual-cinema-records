import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GlobalState } from "../reducers/rootReducer";
import { Card, CardHeader, CardMedia } from "@material-ui/core";

// Material UI coode will be copy pasted in here and customized
export interface MovieCardProps {
  movie: any;
}

function MovieCards(props: MovieCardProps) {
  var baseUrl = "https://image.tmdb.org/t/p/w500/";

  return (
    <Card>
      <CardHeader
        titleTypographyProps={{ variant: "body2" }}
        title={props.movie.title}
      />
      <CardMedia
        component="img"
        image={baseUrl + props.movie.poster_path}
        style={{ height: "auto", width: "100%" }}
      />
    </Card>
  );
}

export default MovieCards;
