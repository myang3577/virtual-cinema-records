var express = require("express");
var router = express.Router();
var AWS = require("aws-sdk");

AWS.config.loadFromPath("./config.json");
AWS.config.apiVersion = {
  dynamodb: "latest",
};
const {
  checkIfKeyAndSortExists,
  fetchAndCheck,
  getSearchParam,
  updateMovieCategories,
} = require("../tools/movieListTools");
const db = new AWS.DynamoDB.DocumentClient();

// Table names
const movieTableName = "MovieList";
const genreTableName = "Genre";
const actorTableName = "Actors";

// API key to query themoviedb database
const apiKey = "5e38014a47f9412c29d0ca4667091633";

// api end point to get the movie details (specifically the title)
const MOVIE_DETAILS_API =
  "https://api.themoviedb.org/3/movie/$TMDB_ID?api_key=$APIKEY&language=en-US";

// Number of actors to consider when updating actor preferences
const ACTOR_THRESHOLD = 5;

// Represents the number of actors before decay occurs
const ACTOR_DECAY_THRESHOLD = 3;

// Represents the number of genres before decay occurs
const GENRE_DECAY_THRESHOLD = 2;

// Represens the decay in score as we progress down the actor list.
// For example, with a movie rating of 5 and a decay threshold of 3:
// actor 1,2, and 3 will receive a 5 but actor 4 will only receive 5 * ACTOR_DECAY.
const DECAY_RATE = 0.9;

// users/:email/movie-list
router.get("/:email/movie-list", getList);

// users/:email/movie
router.delete("/:email/movie", deleteMovie);
router.put("/:email/movie", putMovie);

// users/:email/movie-rating
router.delete("/:email/movie-rating", deleteRating);
router.put("/:email/movie-rating", putRating);

// Get the user's list
function getList(req, res, next) {
  var params = {
    TableName: movieTableName,
    KeyConditionExpression: "#user = :user",
    ExpressionAttributeNames: {
      "#user": "username",
    },
    ExpressionAttributeValues: {
      ":user": req.params.email,
    },
  };

  db.query(params, function (err, data) {
    if (err) {
      console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
      res.status(err.statusCode);
      res.send("Unable to query. See console for output.");
    } else {
      res.send(data.Items);
    }
  });
}

// Adds the movie without any rating attached to it
function putMovie(req, res, next) {
  let movieApiEndpoint = MOVIE_DETAILS_API.replace(
    "$TMDB_ID",
    req.body.tmdb_id
  ).replace("$APIKEY", apiKey);
  // console.log(movieApiEndpoint);
  fetchAndCheck(movieApiEndpoint).then((json) => {
    var params = {
      TableName: movieTableName,
      Item: {
        username: req.params.email,
        tmdb_id: req.body.tmdb_id,
        movie_name: json.original_title,
      },
    };

    // Place or update the rating in the table
    db.put(params, function (err, data) {
      if (err) {
        res.status(err.statusCode).end();
        throw new Error(
          "Unable to put movie item. Error JSON:",
          JSON.stringify(err, null, 2)
        );
      } else {
        console.log("Put item successfully.");
        res.end();
      }
    });
  });
}

// Create or update a user's rating for movie, actor, genre.
//
// Edge case acknowledgement: This function fails if the user submits the same
// rating for the same movie multiple times. This can occur when the user clicks
// 5 stars twice. This edge case should not occur because the front end will
// check if the user taps the same rating and will call the DELETE request
// instead
function putRating(req, res, next) {
  // Check if the username key and movie_id sort key exist.
  checkIfKeyAndSortExists(
    movieTableName,
    "username",
    "tmdb_id",
    req.params.email,
    req.body.tmdb_id
  )
    .then((checkResponse) => {
      // Query tmdb to get the movie name for the given id
      let movieApiEndpoint = MOVIE_DETAILS_API.replace(
        "$TMDB_ID",
        req.body.tmdb_id
      ).replace("$APIKEY", apiKey);
      fetchAndCheck(movieApiEndpoint).then((json) => {
        var params = {
          TableName: movieTableName,
          Item: {
            username: req.params.email,
            tmdb_id: req.body.tmdb_id,
            movie_name: json.original_title,
            rating: req.body.rating,
          },
        };
        // console.log("params is:");
        // console.log(params);

        // Place or update the rating in the table
        db.put(params, function (err, data) {
          if (err) {
            res.status(err.statusCode).end();
            throw new Error(
              "Unable to put movie item. Error JSON:",
              JSON.stringify(err, null, 2)
            );
          } else {
            console.log("Put item successfully.");
            res.end();
          }
        });
      });

      // The value used to update the ranking by
      // let movieRating = req.body.rating - parseInt(checkResponse.currRating);
      // console.log(checkResponse.currRating);
      // update the actors
      let actorParams = {
        apiEndPoint:
          "https://api.themoviedb.org/3/movie/" +
          req.body.tmdb_id +
          "/credits?api_key=" +
          apiKey,
        newRating: req.body.rating,
        currRating: parseFloat(checkResponse.currRating),
        email: req.params.email,
        tableName: actorTableName,
        isExist: checkResponse.isExist,
        type: "actor",
        isDelete: false,
        DECAY_THRESHOLD: ACTOR_DECAY_THRESHOLD,
        DECAY_RATE: DECAY_RATE,
        THRESHOLD: ACTOR_THRESHOLD,
      };

      updateMovieCategories(actorParams);

      // update the actors
      let genreParams = {
        apiEndPoint:
          "https://api.themoviedb.org/3/movie/" +
          req.body.tmdb_id +
          "?api_key=" +
          apiKey,
        newRating: req.body.rating,
        currRating: parseFloat(checkResponse.currRating),
        email: req.params.email,
        tableName: genreTableName,
        isExist: checkResponse.isExist,
        type: "genre",
        isDelete: false,
        DECAY_THRESHOLD: GENRE_DECAY_THRESHOLD,
        DECAY_RATE: DECAY_RATE,
      };

      updateMovieCategories(genreParams);
    })
    .catch((err) => {
      console.error(err);
    });
}

// Delete a user's movie
function deleteMovie(req, res, next) {
  var params = {
    TableName: movieTableName,
    Key: {
      username: req.params.email,
      tmdb_id: req.body.tmdb_id,
    },
    ConditionExpression: "attribute_exists(tmdb_id)",
  };

  // Check if the username key and movie_id sort key exist.
  checkIfKeyAndSortExists(
    movieTableName,
    "username",
    "tmdb_id",
    req.params.email,
    req.body.tmdb_id
  )
    .then((checkResponse) => {
      // If the movie entry does not exist, just return
      if (!checkResponse.isExist) {
        throw new Error(
          "Attempting to delete movie that is not in the user's movie list. "
        );
      }

      // If rating exists, then wipe it first. Otherwise, directly delete the
      // movie
      if (checkResponse.currRating !== 0) {
        req.deleteMovie = true;
        // Call the delete rating to update the actor and genre tables
        deleteRating(req, res, next, () => {
          db.delete(params, function (err, data) {
            if (err) {
              res.status(err.statusCode).end();
              throw new Error(
                "Unable to delete item. Error:",
                JSON.stringify(err, null, 2)
              );
            } else {
              console.log("Deleted item successfully.");
              res.end();
            }
          });
        });
      } else {
        db.delete(params, function (err, data) {
          if (err) {
            res.status(err.statusCode).end();
            throw new Error(
              "Unable to delete item. Error:",
              JSON.stringify(err, null, 2)
            );
          } else {
            console.log("Deleted item successfully.");
            res.end();
          }
        });
      }
    })
    .catch((err) => {
      console.error(err);
    });
}

// Delete a user's rating
function deleteRating(req, res, next, callback = undefined) {
  checkIfKeyAndSortExists(
    movieTableName,
    "username",
    "tmdb_id",
    req.params.email,
    req.body.tmdb_id
  ).then((checkResponse) => {
    if (!checkResponse.isExist) {
      throw new Error(
        "Attempting to remove rating of movie that is not in the user's movie list. "
      );
    }

    // Check if user is trying to delete the rating of a movie with no rating
    if (checkResponse.currRating === 0) {
      console.error("Attempted deleted rating on a movie that has no rating");
      res.end();
      return;
    }
    // let updateRating = parseInt(checkResponse.currRating);

    // If the callback is defind, then allow the movie data to be deleted
    if (callback !== undefined) {
      callback();
    }

    // Wipe the rating if the movie has not been deleted
    if (req.deleteMovie === undefined) {
      var params = {
        TableName: movieTableName,
        Key: {
          username: req.params.email,
          tmdb_id: req.body.tmdb_id,
        },
        UpdateExpression: "REMOVE rating",
        ConditionExpression: "attribute_exists(tmdb_id)",
      };

      db.update(params, function (err, data) {
        if (err) {
          console.error(
            "Unable to update rating. Error JSON:",
            JSON.stringify(err, null, 2)
          );
          res.status(err.statusCode).end();
        } else {
          console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
          res.send();
        }
      });
    }
    // console.log("CHECKREPONSE");
    // console.log(checkResponse);

    // update the actors
    let actorParams = {
      apiEndPoint:
        "https://api.themoviedb.org/3/movie/" +
        req.body.tmdb_id +
        "/credits?api_key=" +
        apiKey,
      newRating: 0,
      currRating: parseFloat(checkResponse.currRating),
      email: req.params.email,
      tableName: actorTableName,
      isExist: checkResponse.isExist,
      type: "actor",
      isDelete: true,
      DECAY_THRESHOLD: ACTOR_DECAY_THRESHOLD,
      DECAY_RATE: DECAY_RATE,
      THRESHOLD: ACTOR_THRESHOLD,
    };

    updateMovieCategories(actorParams);

    // update the actors
    let genreParams = {
      apiEndPoint:
        "https://api.themoviedb.org/3/movie/" +
        req.body.tmdb_id +
        "?api_key=" +
        apiKey,
      newRating: 0,
      currRating: parseFloat(checkResponse.currRating),
      email: req.params.email,
      tableName: genreTableName,
      isExist: checkResponse.isExist,
      type: "genre",
      isDelete: true,
      DECAY_THRESHOLD: GENRE_DECAY_THRESHOLD,
      DECAY_RATE: DECAY_RATE,
    };

    updateMovieCategories(genreParams);
  });
}

module.exports = router;
