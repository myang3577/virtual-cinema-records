import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GlobalState } from "../reducers/rootReducer";
import { GridList, GridListTile } from "@material-ui/core";
// go through and render a bunch of movie cards. But this file has to decide
// what to render. The API call would be contained in here

function MovieGrid() {

  var baseUrl = "https://image.tmdb.org/t/p/w500/";
  const movieSearchResult: any = useSelector<GlobalState>(
    (state) => state.otherData.movieSearchResult
  );

  return(
    <GridList cols={3}>
      {movieSearchResult.results
          ? movieSearchResult.results.map((e: any, index: number) => (
              //<MovieCard key={e}
              <GridListTile key={e} cols={1}>
                <img src={baseUrl + e.poster_path} />
              </GridListTile>
            ))
          : ""}
    </GridList>
  );
};

export default MovieGrid;
