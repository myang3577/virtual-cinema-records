var express = require("express");
var router = express.Router();
var AWS = require("aws-sdk");
const fetch = require("node-fetch");
var async = require("async");

AWS.config.loadFromPath("./config.json");
AWS.config.apiVersion = {
  dynamodb: "latest",
};

const {
  fetchAndCheck,
  getSearchAndFilterParam,
  sortByRating,
  sortByRatingAndCount,
} = require("../tools/movieListTools");

const db = new AWS.DynamoDB.DocumentClient();

const movieTableName = "MovieList";
const genreTableName = "Genre";
const actorTableName = "Actors";
const apiKey = "5e38014a47f9412c29d0ca4667091633";

// The minimum movie rating to receive a recommendation
// Anything lower than this threshold will be
// discarded
const MINIMUM_MOVIE_RATING = 2;

// The minimum actor rating to receive a recommendation
// Anything lower than this threshold will be
// discarded
const MINIMUM_ACTOR_RATING = 0;

// The minimum genre rating to receive a recommendation
// Anything lower than this threshold will be
// discard
const MINIMUM_GENRE_RATING = 0;

// Only the top 3 actors will produce recommendations
const NUM_ACTORS_TO_RECOMMEND_FOR = 3;

// Only the top 3 movies will produce recommendations
const NUM_MOVIES_TO_RECOMMEND_FOR = 3;

// Only the top 3 genres will produce recommendations
const NUM_GENRE_TO_RECOMMEND_FOR = 3;

// Only the top 5 recommended movies for each user movie will be recommended
const NUM_RECOMMENDATION_PER_MOVIE = 5;

// Only the top 5 recommended movies for each user's actors will be recommended
const NUM_RECOMMENDATION_PER_ACTOR = 5;

// Only the top 5 recommended movies for each user's genre will be recommended
const NUM_RECOMMENDATION_PER_GENRE = 5;

// Indicates which page of the given genre should be used for recommendations
const GENRE_PAGE = 1;

// users/:email/movie-list
router.get("/:email/movie-recommendation", movieRecommendation);
router.get("/:email/actor-recommendation", actorRecommendation);
router.get("/:email/genre-recommendation", genreRecommendation);

// Gets recommendations based on movies the user likes
function movieRecommendation(req, res, next) {
  var queryMovie = getSearchAndFilterParam(
    movieTableName,
    "username",
    "rating",
    req.params.email,
    MINIMUM_MOVIE_RATING
  );

  db.query(queryMovie, function (err, data) {
    if (err) {
      res.status(err.statusCode);
      res.send("Unable to query. See console for output.");
      throw new Error("Unable to query. Error:", JSON.stringify(err, null, 2));
    } else {
      let recommendedMovieData = [];

      data.Items.sort(sortByRating);

      // Only recommend for the first NUM_MOVIES_TO_RECOMMEND_FOR
      data.Items = data.Items.slice(0, NUM_MOVIES_TO_RECOMMEND_FOR);

      // Get recommendations for the desiganted number of movies above minimum ranking
      async
        .each(data.Items, function (item_data, callback) {
          let apiMovieRecEndpoint =
            "https://api.themoviedb.org/3/movie/" +
            item_data.tmdb_id +
            "/recommendations?api_key=" +
            apiKey +
            "&language=en-US&page=1";

          fetchAndCheck(apiMovieRecEndpoint)
            .then((json) => {
              let recommendedMoviesArray = json.results.slice(
                0,
                NUM_RECOMMENDATION_PER_MOVIE
              );
              async
                .each(recommendedMoviesArray, function (item_data, callback) {
                  let apiMovieDetailEndpoint =
                    "https://api.themoviedb.org/3/movie/" +
                    item_data.id +
                    "?api_key=" +
                    apiKey +
                    "&language=en-US";
                  fetchAndCheck(apiMovieDetailEndpoint)
                    .then((json) => {
                      recommendedMovieData.push(json);
                      callback();
                    })
                    .catch((err) => {
                      console.err(err);
                    });
                })
                .then(() => callback())
                .catch((err) => {
                  console.err(err);
                });
            })
            .catch((err) => {
              console.err(err);
            });
        })
        .then(() => {
          res.send(recommendedMovieData);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
}

// Get recommendations based on actors
function actorRecommendation(req, res, next) {
  var queryActor = getSearchAndFilterParam(
    actorTableName,
    "username",
    "rating",
    req.params.email,
    MINIMUM_ACTOR_RATING
  );

  db.query(queryActor, function (err, data) {
    if (err) {
      res.status(err.statusCode);
      res.send("Unable to query. See console for output.");
      throw new Error("Unable to query. Error:", JSON.stringify(err, null, 2));
    } else {
      let recommendedActorData = [];

      // Sort based on the actor rating and movie_count
      data.Items.sort(sortByRatingAndCount);

      // Only get the number of actors to recommend for
      data.Items = data.Items.slice(0, NUM_ACTORS_TO_RECOMMEND_FOR);

      async
        .each(data.Items, function (item_data, callback) {
          // Which Actors we select can be changed. Currently it looks at the
          // top five actors based on rating and movie_count.
          // console.log(item_data);
          let actor_id = item_data.actor_id;
          let apiActorDetailEndpoint =
            "https://api.themoviedb.org/3/person/" +
            item_data.actor_id +
            "/movie_credits?api_key=" +
            apiKey +
            "&language=en-US";
          fetchAndCheck(apiActorDetailEndpoint).then((json) => {
            let recommendedMoviesArray = json.cast.slice(
              0,
              NUM_RECOMMENDATION_PER_ACTOR
            );

            async
              .each(recommendedMoviesArray, function (item_data, callback) {
                console.log("adding recommendations for actor_id" + actor_id);

                let apiMovieDetailEndpoint =
                  "https://api.themoviedb.org/3/movie/" +
                  item_data.id +
                  "?api_key=" +
                  apiKey +
                  "&language=en-US";
                fetchAndCheck(apiMovieDetailEndpoint)
                  .then((json) => {
                    recommendedActorData.push(json);
                    callback();
                  })
                  .catch((err) => {
                    console.err(err);
                  });
              })
              .then(() => callback())
              .catch((err) => {
                console.err(err);
              });
          });
        })
        .then(() => {
          console.log(
            "final actor recommendation json length is: " +
              recommendedActorData.length
          );
          res.send(recommendedActorData);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
}

// Get recommendations based on genre
function genreRecommendation(req, res, next) {
  var queryGenre = getSearchAndFilterParam(
    genreTableName,
    "username",
    "rating",
    req.params.email,
    MINIMUM_GENRE_RATING
  );

  db.query(queryGenre, function (err, data) {
    if (err) {
      console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
      res.status(err.statusCode);
      res.send("Unable to query. See console for output.");
    } else {
      let recommendedGenreData = [];

      // Sort based on the genre rating and movie_count
      data.Items.sort(sortByRatingAndCount);

      // Only get the specified number of genres to recommend for
      data.Items = data.Items.slice(0, NUM_GENRE_TO_RECOMMEND_FOR);

      async
        .each(data.Items, function (item_data, callback) {
          let genre_id = item_data.genre_id;
          let apiGenreDetailEndpoint =
            "https://api.themoviedb.org/3/discover/movie?api_key=" +
            apiKey +
            "&with_genres=" +
            item_data.genre_id +
            "&page=" +
            GENRE_PAGE +
            "&language=en-US";
          fetchAndCheck(apiGenreDetailEndpoint)
            .then((json) => {
              let recommendedMoviesArray = json.results.slice(
                0,
                NUM_RECOMMENDATION_PER_GENRE
              );
              async
                .each(recommendedMoviesArray, function (item_data, callback) {
                  console.log("adding recommendations for genre_id" + genre_id);
                  let apiMovieDetailEndpoint =
                    "https://api.themoviedb.org/3/movie/" +
                    item_data.id +
                    "?api_key=" +
                    apiKey +
                    "&language=en-US";

                  fetchAndCheck(apiMovieDetailEndpoint)
                    .then((json) => {
                      recommendedGenreData.push(json);
                      callback();
                    })
                    .catch((err) => {
                      console.err(err);
                    });
                })
                .then(() => callback())
                .catch((err) => {
                  console.err(err);
                });
            })
            .catch((err) => {
              console.err(err);
            });
        })
        .then(() => {
          console.log(
            "final genre recommendation json length is: " +
              recommendedGenreData.length
          );
          res.send(recommendedGenreData);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
}

module.exports = router;
