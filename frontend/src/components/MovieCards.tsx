import React from "react";
import { Card, CardHeader, CardMedia, CardContent } from "@material-ui/core";
import { RatingButtons, RatingType } from "./RatingButtons";
import { useSelector } from "react-redux";
import { GlobalState } from "../reducers/rootReducer";
import { PageType } from "../actions/uiActions";

// Material UI coode will be copy pasted in here and customized
export interface MovieCardProps {
  movie: any;
}

function MovieCards(props: MovieCardProps) {
  var baseUrl = "https://image.tmdb.org/t/p/w500/";

  const cardTitle = () => {
    var title = props.movie.title;

    if (props.movie.release_date) {
      title += " (" + props.movie.release_date.slice(0, 4) + ")";
    }
    if (props.movie.id) {
      title += " [" + props.movie.id + "]";
    }

    return title;
  };

  const username: any = useSelector<GlobalState>(
    (state) => state.loginData.username
  );

  const currentPageType: any = useSelector<GlobalState>(
    (state) => state.uiData.currentPage
  );

  const ratingButtons = () => {
    if (currentPageType == PageType.HOME) {
      return;
    } else {
      return (
        <RatingButtons
          username={username}
          movie_id={props.movie.id}
          rating={RatingType.TWO}
        />
      );
    }
  };

  return (
    <Card elevation={3} style={{ margin: "5px" }}>
      <CardHeader
        titleTypographyProps={{ variant: "body2" }}
        title={cardTitle()}
      />
      <CardContent>{ratingButtons()}</CardContent>
      <CardMedia
        component="img"
        image={
          props.movie.poster_path
            ? baseUrl + props.movie.poster_path
            : "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1200px-No_image_available.svg.png"
        }
        style={{ height: "auto", width: "100%" }}
      />
    </Card>
  );
}

export default MovieCards;
