import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GlobalState } from "../reducers/rootReducer";
import {
  GridList,
  GridListTile,
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from "@material-ui/core";
import { setMovieDetail } from "../actions/movieDetailsActions";
import { getMovieDetails } from "../actions/tmdbActions";

interface RelatedMoviesProps {
  tmdb_id: number;
}

function RelatedMovies(props: RelatedMoviesProps) {
  const relatedMovies = useSelector<GlobalState, any>((state) =>
    state.tmdbData.movieDetails[props.tmdb_id]
      ? state.tmdbData.movieDetails[props.tmdb_id].similar.results
      : undefined
  );

  const baseUrl = useSelector<GlobalState, string>(
    (state) => state.uiData.tmdbBaseUrl
  );

  const dispatch = useDispatch();

  const userMyMoviesList = useSelector<GlobalState, any[]>(
    (state) => state.myMoviesData.movieDataList
  );
  const userBlackList = useSelector<GlobalState, any[]>(
    (state) => state.blacklistData.blacklist
  );

  const movieInUserList = (movie: any): boolean =>
    userMyMoviesList.some((e: any) => movie.id === e.id);

  const movieInBlackList = (movie: any): boolean =>
    userBlackList.some((e: any) => movie.id === e.id);

  const [currMovie, setCurrMovie] = useState<any>({});

  const userRating = useSelector<GlobalState, number>((state) => {
    const userMovieIDList = state.myMoviesData.movieIDList;
    const userMovieIDElement = userMovieIDList.find(
      (e) => e.tmdb_id === currMovie.id
    );
    if (userMovieIDElement) {
      const userRating = userMovieIDElement.rating;
      return userRating ? userRating : 0;
    }
    return 0;
  });

  const relatedMovieClicked = (movie: any) => {
    setCurrMovie(movie);
    dispatch(
      setMovieDetail(
        movie,
        movie.id,
        movieInUserList(movie),
        movieInBlackList(movie),
        userRating
      )
    );
    dispatch(getMovieDetails(movie.id));
  };

  const displayRelatedMovies = () => {
    return (
      relatedMovies &&
      relatedMovies.slice(0, 8).map((movie: any, i: number) => (
        <GridListTile key={i}>
          <Card elevation={3} style={{ margin: "3px" }}>
            <CardActionArea
              style={{
                backgroundImage: "url(" + baseUrl + movie.backdrop_path + ")",
                backgroundSize: "cover",
              }}
              onClick={(e) => {
                relatedMovieClicked(movie);
              }}
            >
              <CardContent>
                <Typography
                  style={{
                    display: "inline-block",
                    paddingLeft: "5px",
                    paddingRight: "5px",
                    textShadow:
                      "0px 0px 8px rgba(0, 0, 0, 1),0px 0px 8px rgba(0, 0, 0, 1),0px 0px 8px rgba(0, 0, 0, 1),0px 0px 8px rgba(0, 0, 0, 1),0px 0px 8px rgba(0, 0, 0, 1),0px 0px 8px rgba(0, 0, 0, 1)",
                    color: "white",
                  }}
                >
                  {movie.title}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </GridListTile>
      ))
    );
  };

  console.log(relatedMovies);
  return relatedMovies ? (
    <GridList cellHeight={"auto"} cols={2}>
      {displayRelatedMovies()}
    </GridList>
  ) : null;
}

export default RelatedMovies;
