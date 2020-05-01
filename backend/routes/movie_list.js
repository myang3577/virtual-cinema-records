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
  checkIfKeyAndSortExists,
  fetchAndCheck,
  getSearchParam,
} = require("../tools/movieListTools");
const db = new AWS.DynamoDB.DocumentClient();

// Table names
const movieTableName = "MovieList";
const genreTableName = "Genre";
const actorTableName = "Actors";

// API key to query themoviedb database
const apiKey = "5e38014a47f9412c29d0ca4667091633";

// Number of actors to consider when updating actor preferences
const ACTOR_THRESHOLD = 5;

// users/:email/movie-list
router.get("/:email/movie-list", getList);

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

// Create or update a user's rating for movie, actor, genre.
//
// Edge case acknowledgement: This function fails if the user submits the same
// rating for the same movie multiple times. This can occur when the user clicks
// 5 stars twice. This edge case should not occur because the front end will
// check if the user taps the same rating and will call the DELETE request
// instead
function putRating(req, res, next) {
  var params = {
    TableName: movieTableName,
    Item: {
      username: req.params.email,
      tmdb_id: req.body.tmdb_id,
      rating: req.body.rating,
    },
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

      // The value used to update the ranking by
      let updateRating = req.body.rating - parseInt(checkResponse.currRating);

      let apiEndPoint =
        "https://api.themoviedb.org/3/movie/" +
        req.body.tmdb_id +
        "/credits?api_key=" +
        apiKey;

      // Get the actors for the given tmdb_id. Parse and check response is
      // successful.
      fetchAndCheck(apiEndPoint)
        .then((json) => {
          let castArray = json.cast;

          // Loop through the top ACTOR_THRESHOLD actors. async not required
          // because db query by default will be async
          for (let i = 0; i < ACTOR_THRESHOLD; i++) {
            // Get actor query parameters
            let searchActor = getSearchParam(
              actorTableName,
              "username",
              "actor_id",
              req.params.email,
              castArray[i].id
            );

            // Query actor table for current rating and movie count
            db.query(searchActor, function (err, data) {
              if (err) {
                throw new Error(
                  "Unable to query Actors table. Error:",
                  JSON.stringify(err, null, 2)
                );
              } else {
                // Default is a new movie and new actor
                let putActor = {
                  TableName: actorTableName,
                  Item: {
                    username: req.params.email,
                    actor_id: castArray[i].id,
                    rating: updateRating,
                    movie_count: 1,
                  },
                };

                // Case where the actor exists, update the rating and movie
                // count
                if (data.Items.length !== 0) {
                  // If the movie already exists, keep the movie count
                  if (checkResponse.isExist) {
                    putActor.Item.movie_count = data.Items[0].movie_count;
                  }
                  // Else add 1 to the movie_count
                  else {
                    putActor.Item.movie_count = data.Items[0].movie_count + 1;
                  }

                  // Update the average rating
                  putActor.Item.rating =
                    (updateRating +
                      data.Items[0].rating * data.Items[0].movie_count) /
                    putActor.Item.movie_count;
                }
                console.log("putActor.Item.rating is: " + putActor.Item.rating);

                // Update the actors ranking
                db.put(putActor, function (err, data) {
                  if (err) {
                    throw new Error(
                      "Unable to put actor into table on add movie. Error:",
                      JSON.stringify(err, null, 2)
                    );
                  } else {
                    console.log(
                      "Actor rating successfully updated on movie add"
                    );
                  }
                });
              }
            });
          }
        })
        .catch((err) => {
          console.err(err);
        });

      apiEndPoint =
        "https://api.themoviedb.org/3/movie/" +
        req.body.tmdb_id +
        "?api_key=" +
        apiKey;

      fetchAndCheck(apiEndPoint)
        .then((json) => {
          let genreArray = json.genres; // this is an array of numbers

          // Loop and update all genres for the rated movie
          for (let i = 0; i < genreArray.length; i++) {
            let searchGenre = getSearchParam(
              genreTableName,
              "username",
              "genre_id",
              req.params.email,
              genreArray[i].id
            );

            db.query(searchGenre, function (err, data) {
              if (err) {
                throw new Error(
                  "Unable to query Genre table. Error:",
                  JSON.stringify(err, null, 2)
                );
              } else {
                let putGenre = {
                  TableName: genreTableName,
                  Item: {
                    username: req.params.email,
                    genre_id: genreArray[i].id,
                    rating: updateRating,
                    movie_count: 1,
                  },
                };

                // Case where the genre exists, conduct the update
                if (data.Items.length !== 0) {
                  // If the movie already exists, keep the movie count
                  if (checkResponse.isExist) {
                    putGenre.Item.movie_count = data.Items[0].movie_count;
                  }
                  // Else add 1 to the movie_count
                  else {
                    putGenre.Item.movie_count = data.Items[0].movie_count + 1;
                  }

                  // Update the average rating
                  putGenre.Item.rating =
                    (updateRating +
                      data.Items[0].rating * data.Items[0].movie_count) /
                    putGenre.Item.movie_count;
                }
                console.log("putGenre.Item.rating is: " + putGenre.Item.rating);

                db.put(putGenre, function (err, data) {
                  if (err) {
                    throw new Error(
                      "Unable to put genre into table on add movie. Error:",
                      JSON.stringify(err, null, 2)
                    );
                  } else {
                    console.log(
                      "Genre rating successfully updated on movie add"
                    );
                  }
                });
              }
            });
          }
        })
        .catch((err) => {
          console.err(err);
        });
    })
    .catch((err) => {
      console.err(err);
    });
}

// Delete a user's rating
function deleteRating(req, res, next) {
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

      let updateRating = parseInt(checkResponse.currRating);

      let apiEndPoint =
        "https://api.themoviedb.org/3/movie/" +
        req.body.tmdb_id +
        "/credits?api_key=" +
        apiKey;

      // Fetch and check api response is ok
      fetchAndCheck(apiEndPoint)
        .then((json) => {
          let castArray = json.cast;

          // Loop through the top ACTOR_THRESHOLD actors and delete/update each
          for (let i = 0; i < ACTOR_THRESHOLD; i++) {
            let searchActor = getSearchParam(
              actorTableName,
              "username",
              "actor_id",
              req.params.email,
              castArray[i].id
            );

            db.query(searchActor, function (err, data) {
              if (err) {
                throw new Error(
                  "Unable to query Actors table. Error:",
                  JSON.stringify(err, null, 2)
                );
              } else {
                if (data.Items.length === 0) {
                  throw new Error(
                    "Empty data.Items object of actor query." +
                      " This means a movie was added successfully but one of the actors were not. "
                  );
                }

                // If deleting sets the movie_count for this actor to 0 remove
                // the entry instead and skip update
                if (data.Items[0].movie_count === 1) {
                  let deleteActor = {
                    TableName: actorTableName,
                    Key: {
                      username: req.params.email,
                      actor_id: data.Items[0].actor_id,
                    },
                    ConditionExpression: "attribute_exists(actor_id)",
                  };
                  db.delete(deleteActor, function (err, data) {
                    if (err) {
                      throw new Error(
                        "Unable to delete Actor item. Error:",
                        JSON.stringify(err, null, 2)
                      );
                    } else {
                      console.log("Deleted Actor item successfully.");
                    }
                  });
                }

                // Otherwise update the movie
                else {
                  let putActor = {
                    TableName: actorTableName,
                    Item: {
                      username: req.params.email,
                      actor_id: castArray[i].id,
                      rating:
                        (data.Items[0].rating * data.Items[0].movie_count -
                          updateRating) /
                        (data.Items[0].movie_count - 1),
                      movie_count: data.Items[0].movie_count - 1,
                    },
                  };

                  db.put(putActor, function (err, data) {
                    if (err) {
                      throw new Error(
                        "Unable to put actor into table on delete movie. Error:",
                        JSON.stringify(err, null, 2)
                      );
                    } else {
                      console.log(
                        "Actor rating successfully updated on movie delete"
                      );
                    }
                  });
                }
              }
            });
          }
        })
        .catch((err) => {
          console.err(err);
        });

      apiEndPoint =
        "https://api.themoviedb.org/3/movie/" +
        req.body.tmdb_id +
        "?api_key=" +
        apiKey;

      // Fetch and check api response is ok
      fetchAndCheck(apiEndPoint)
        .then((json) => {
          let genreArray = json.genres;

          // Loop through the genres and update each
          for (let i = 0; i < genreArray.length; i++) {
            let searchGenre = getSearchParam(
              genreTableName,
              "username",
              "genre_id",
              req.params.email,
              genreArray[i].id
            );

            db.query(searchGenre, function (err, data) {
              if (err) {
                throw new Error(
                  "Unable to query Genre table. Error:",
                  JSON.stringify(err, null, 2)
                );
              } else {
                if (data.Items.length === 0) {
                  throw new Error(
                    "Empty data.Items object of genre query." +
                      " This means a movie was added successfully but one of the genres was not. "
                  );
                }

                if (data.Items[0].movie_count === 1) {
                  let deleteGenre = {
                    TableName: genreTableName,
                    Key: {
                      username: req.params.email,
                      genre_id: data.Items[0].genre_id,
                    },
                    ConditionExpression: "attribute_exists(genre_id)",
                  };
                  db.delete(deleteGenre, function (err, data) {
                    if (err) {
                      throw new Error(
                        "Unable to delete Genre item. Error:",
                        JSON.stringify(err, null, 2)
                      );
                    } else {
                      console.log("Deleted Genre item successfully.");
                    }
                  });
                } else {
                  let putGenre = {
                    TableName: genreTableName,
                    Item: {
                      username: req.params.email,
                      genre_id: genreArray[i].id,
                      rating:
                        (data.Items[0].rating * data.Items[0].movie_count -
                          updateRating) /
                        (data.Items[0].movie_count - 1),
                      movie_count: data.Items[0].movie_count - 1,
                    },
                  };

                  db.put(putGenre, function (err, data) {
                    if (err) {
                      throw new Error(
                        "Unable to put genre into table on movie delete. Error:",
                        JSON.stringify(err, null, 2)
                      );
                    } else {
                      console.log(
                        "Genre rating successfully updated on movie delete"
                      );
                    }
                  });
                }
              }
            });
          }
        })
        .catch((err) => {
          console.err(err);
        });
    })
    .catch((err) => {
      console.err(err);
    });
}

module.exports = router;
