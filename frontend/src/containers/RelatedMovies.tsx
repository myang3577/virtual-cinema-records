import React from "react";
import { useSelector } from "react-redux";
import { GlobalState } from "../reducers/rootReducer";
import {
  GridList,
  Grid,
  GridListTile,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  makeStyles,
} from "@material-ui/core";

const useStyles = makeStyles({
  card: {
    height: "auto",
    width: "90%",
    margin: "5px",
    marginLeft: "5%",
    marginRight: "5%",
  },
  media: {
    height: "auto",
  },
});

function RelatedMovies() {
  const classes = useStyles();

  const relatedMovies = useSelector<GlobalState, any>(
    (state) => state.tmdbData.relatedMovies
  );
  const baseUrl = useSelector<GlobalState, string>(
    (state) => state.uiData.tmdbBaseUrl
  );
  /*
  const displayRelatedMovies = () => {
    return (
      relatedMovies.results &&
      relatedMovies.results.slice(0, 3).map((movie: any) => (
        <GridListTile>
          <img src={baseUrl + movie.backdrop_path} alt="related" />
        </GridListTile>
      ))
    );
  };*/

  const displayRelatedMovies = () => {
    return (
      relatedMovies.results &&
      relatedMovies.results.slice(0, 3).map((movie: any) => (
        <GridListTile cols={1} rows={1}>
          <Card className={classes.card}>
            <CardActionArea>
              <CardMedia
                className={classes.media}
                image={baseUrl + movie.background_path}
                title="related"
              />
              <CardContent>
                <Typography gutterBottom>{movie.title}</Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </GridListTile>
      ))
    );
  };

  return (
    <Grid>
      <GridList
        cellHeight={"auto"}
        style={{ height: "50%", width: "100%", margin: "0%" }}
        cols={1}
        spacing={0}
      >
        {displayRelatedMovies()}
      </GridList>
    </Grid>
  );
}

export default RelatedMovies;
