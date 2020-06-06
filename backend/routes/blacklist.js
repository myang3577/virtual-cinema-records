var express = require("express");
var router = express.Router();
var AWS = require("aws-sdk");
const fetch = require("node-fetch");
var async = require("async");

AWS.config.update({ region: "us-east-2" });
AWS.config.apiVersion = {
  dynamodb: "latest",
};

const db = new AWS.DynamoDB.DocumentClient();

const blacklistTableName = "Blacklist";
const MOVIE_DETAILS_API =
  "https://api.themoviedb.org/3/movie/$TMDB_ID?api_key=$APIKEY&language=en-US";
const apiKey = "5e38014a47f9412c29d0ca4667091633";

const { fetchAndCheck } = require("../tools/movieListTools");
// users/:email/movie-blacklist
router.get("/:email/movie-blacklist", getBlacklist);

// users/:email/blacklisted-movie
router.delete("/:email/blacklisted-movie", deleteBlacklistedMovie);
router.put("/:email/blacklisted-movie", putBlacklistedMovie);

// Get the user's blacklist
function getBlacklist(req, res, next) {
  var params = {
    TableName: blacklistTableName,
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
      console.error(
        "Unable to query from blacklist table. Error:",
        JSON.stringify(err, null, 2)
      );
      res.status(err.statusCode);
      res.send("Unable to query. See console for output.");
    } else {
      let movieDetailsArray = [];
      async
        .each(data.Items, function (item_data, callback) {
          let apiMovieDetailEndpoint = MOVIE_DETAILS_API.replace(
            "$APIKEY",
            apiKey
          ).replace("$TMDB_ID", item_data.tmdb_id);
          fetchAndCheck(apiMovieDetailEndpoint)
            .then((json) => {
              //   console.log("adding");
              movieDetailsArray.push(json);
              //   console.log(json);
            })
            .then(() => {
              //   console.log("calling back");
              callback();
            })
            .catch((error) => {
              console.log(
                "Error getting movie data for blacklist. Error:",
                error
              );
            });
        })
        .then(() => {
          //   console.log("ready to send");
          res.send(movieDetailsArray);
        });
    }
  });
}

// Add a movie to the user's blacklist
function putBlacklistedMovie(req, res, next) {
  // console.log(req.params.email);
  // console.log(req.body.tmdb_id);
  // console.log(req.body);
  var params = {
    TableName: blacklistTableName,
    Item: {
      username: req.params.email,
      tmdb_id: req.body.tmdb_id,
    },
  };

  db.put(params, function (err, data) {
    if (err) {
      res.status(err.statusCode).end();
      console.error(
        "Unable to put movie into blacklist table on blacklisting movie. Error:",
        err
      );
    } else {
      console.log("Movie successfully added to blacklist table");
      res.end();
    }
  });
}

function deleteBlacklistedMovie(req, res, next) {
  var params = {
    TableName: blacklistTableName,
    Key: {
      username: req.params.email,
      tmdb_id: req.body.tmdb_id,
    },
    ConditionExpression: "attribute_exists(tmdb_id)",
  };

  db.delete(params, function (err, data) {
    if (err) {
      res.status(err.statusCode).end();
      console.error("Unable to delete item from blacklist table. Error:", err);
    } else {
      console.log("Deleted item from blacklist table successfully.");
      res.end();
    }
  });
}
module.exports = router;
