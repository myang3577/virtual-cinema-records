import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GlobalState } from "../reducers/rootReducer";
import { GridList, GridListTile } from "@material-ui/core";
import SearchBar from "./SearchBar";
import MovieCards from "../components/MovieCards";
// go through and render a bunch of movie cards. But this file has to decide
// what to render. The API call would be contained in here

function MovieGrid() {
  const movieSearchResult: any = useSelector<GlobalState>(
    (state) => state.otherData.movieSearchResult
  );

const gridItemStyle = {
    height: "auto"
  };

const gridStyle = {
      display: "flex",
      justifyContent: "space-between",
      marginTop: "10px"
  };

  return(
    <div>
      <SearchBar />
      <GridList cols={6} style={gridStyle}>
        {movieSearchResult.results
            ? movieSearchResult.results.map((e: any, index: number) => (
                //<MovieCard key={e}
                <GridListTile key={e} cols={1} style={gridItemStyle}>
                  <MovieCards movie={e}/>
                </GridListTile>
              ))
            : ""}
      </GridList>
    </div>
  );
};

export default MovieGrid;
