import React, { useState, useEffect } from "react";
import {
  GridList,
  GridListTile,
  withWidth,
  isWidthUp,
  WithWidthProps,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import MovieCards from "./MovieCards";
import { LoadingState } from "../reducers/tmdbReducer";
import { PageType } from "../Constants";
import { Breakpoint } from "@material-ui/core/styles/createBreakpoints";

interface MovieGridProps {
  displayMovieList: [];
  userMyMoviesList: [];
  loading: LoadingState;
  page: PageType;
}

function MovieGrid(props: MovieGridProps) {
  const gridItemStyle = {
    height: "auto",
  };

  const gridStyle = {
    display: "flex",
    justifyContent: "flex-start",
  };

  const getGridListCols = () => {
    if (isWidthUp("xl", (props as WithWidthProps).width as Breakpoint)) {
      return 6;
    }

    if (isWidthUp("lg", (props as WithWidthProps).width as Breakpoint)) {
      return 5;
    }

    if (isWidthUp("md", (props as WithWidthProps).width as Breakpoint)) {
      return 4;
    }

    if (isWidthUp("sm", (props as WithWidthProps).width as Breakpoint)) {
      return 3;
    }

    if (isWidthUp("xs", (props as WithWidthProps).width as Breakpoint)) {
      return 2;
    }

    return 1;
  };

  const movieInUserList = (movie: any): boolean =>
    props.userMyMoviesList.some((e: any) => movie.id === e.id);

  return (
    <div className="movie-grid">
      <GridList cellHeight={140} cols={getGridListCols()} style={gridStyle}>
        {props.loading !== LoadingState.LOADING && props.displayMovieList
          ? props.displayMovieList.map((e: any, i: number) => (
              <GridListTile key={i} cols={1} rows={1} style={gridItemStyle}>
                <MovieCards
                  movie={e}
                  inUserList={movieInUserList(e)}
                  page={props.page}
                />
              </GridListTile>
            ))
          : [...Array(18).keys()].map((e, i) => (
              <GridListTile key={i} cols={1} style={gridItemStyle}>
                <Skeleton
                  variant="text"
                  animation={props.loading === LoadingState.DONE && "wave"}
                  height={80}
                />
                <Skeleton
                  variant="rect"
                  animation={props.loading === LoadingState.DONE && "wave"}
                  height={450}
                />
              </GridListTile>
            ))}
      </GridList>
    </div>
  );
}

export default withWidth()(MovieGrid);
