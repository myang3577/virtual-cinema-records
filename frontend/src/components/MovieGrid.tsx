import React from "react";
import {
  GridList,
  GridListTile,
  withWidth,
  isWidthUp,
  WithWidthProps,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import MovieCard from "../containers/MovieCard";
import { LoadingState } from "../reducers/tmdbReducer";
import { PageType } from "../constants/General";
import { Breakpoint } from "@material-ui/core/styles/createBreakpoints";
import { MovieListElement } from "../actions/userInfoActions";

interface MovieGridProps {
  displayMovieList: [];
  userMyMoviesList: any[];
  userBlackList?: any[];
  userMovieIDList: MovieListElement[];
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

  const movieInBlackList = (movie: any): boolean =>
    props.userBlackList!.some((e: any) => movie.id === e.id);

  return (
    <div className="movie-grid">
      <GridList cellHeight={140} cols={getGridListCols()} style={gridStyle}>
        {props.loading !== LoadingState.LOADING && props.displayMovieList
          ? props.displayMovieList.map((e: any, i: number) => (
              <GridListTile key={i} cols={1} rows={1} style={gridItemStyle}>
                {props.userBlackList ? (
                  <MovieCard
                    movie={e}
                    inUserList={movieInUserList(e)}
                    inBlackList={movieInBlackList(e)}
                    page={props.page}
                  />
                ) : (
                  <MovieCard
                    movie={e}
                    inUserList={movieInUserList(e)}
                    page={props.page}
                  />
                )}
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
