import React from "react";
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  IconButton,
  CardActionArea,
} from "@material-ui/core";
import { RatingButtons, RatingType } from "../containers/RatingButtons";
import { Add, Delete } from "@material-ui/icons";
import { PageType } from "../containers/pages/Constants";
import { useDispatch, useSelector } from "react-redux";
import { toggleDetailDrawer } from "../actions/uiActions";
import { GlobalState } from "../reducers/rootReducer";

export interface MovieCardProps {
  movie: any;
  inUserList: boolean;
  page: PageType;
}

function MovieCards(props: MovieCardProps) {
  const baseUrl: any = useSelector<GlobalState>(
    (state) => state.uiData.tmdbBaseUrl
  );

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

  const iconButtonClick = () => {
    if (props.inUserList) {
      //dispatch call for adding to user list
    } else {
      //dispatch call for deleting from user list
    }
  };

  const dispatch = useDispatch();

  const openMovieDetailDrawer = () => {
    dispatch(toggleDetailDrawer(true));
  };

  return (
    <div>
      <Card elevation={3} style={{ margin: "5px" }}>
        <CardHeader
          titleTypographyProps={{ variant: "subtitle1" }}
          title={cardTitle()}
          action={
            <IconButton size="medium" onClick={iconButtonClick}>
              {props.inUserList ? <Delete /> : <Add />}
            </IconButton>
          }
        />
        <CardContent>
          {props.page === PageType.MY_MOVIES && (
            <RatingButtons movie_id={props.movie.id} rating={RatingType.TWO} />
          )}
        </CardContent>
        <CardActionArea onClick={openMovieDetailDrawer}>
          <CardMedia
            component="img"
            image={
              props.movie.poster_path
                ? baseUrl + props.movie.poster_path
                : "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1200px-No_image_available.svg.png"
            }
            style={{ height: "auto", width: "100%" }}
          />
        </CardActionArea>
      </Card>
    </div>
  );
}

export default MovieCards;
