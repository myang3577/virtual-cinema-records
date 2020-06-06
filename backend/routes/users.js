var express = require("express");
var router = express.Router();
var movie_list = require("./movie_list");
var recommender = require("./recommender");
var blacklist = require("./blacklist");
var AWS = require("aws-sdk");

AWS.config.update({ region: "us-east-2" });
AWS.config.apiVersion = {
  dynamodb: "latest",
};

const db = new AWS.DynamoDB.DocumentClient();

const userTableName = "Users";

// users
router.use("/", movie_list);
router.use("/", recommender);
router.use("/", blacklist);

// users/:email
router.get("/:email", getUserInfo);
// users/:email/preferences-flag
router.put("/:email/preferences-flag", setPreferencesFlag);

function getUserInfo(req, res, next) {
  var params = {
    TableName: userTableName,
    Key: {
      username: req.params.email,
    },
  };

  db.get(params, function (err, data) {
    if (err) {
      console.error("Unable to get. Error:", JSON.stringify(err, null, 2));
      res.status(err.statusCode);
      res.send("Unable to get. See console for output.");
    } else if (!data.Item) {
      res.status(404);
      res.send("User does not exist.");
    } else {
      var response = {
        username: data.Item.username,
        hasUpdatedPreferences: !!data.Item.hasUpdatedPreferences,
      };

      res.send(response);
    }
  });
}

function setPreferencesFlag(req, res, next) {
  var params = {
    TableName: userTableName,
    Key: {
      username: req.params.email,
    },
    UpdateExpression: "set hasUpdatedPreferences = :h",
    ExpressionAttributeValues: {
      ":h": req.body.hasUpdatedPreferences,
    },
    ConditionExpression: "attribute_exists(username)",
  };

  db.update(params, function (err, data) {
    if (err) {
      console.error("Unable to set flag. Error:", JSON.stringify(err, null, 2));
      res.status(err.statusCode);
      res.send("Unable to set flag. See console for output.");
    } else {
      res.end();
    }
  });
}

module.exports = router;
