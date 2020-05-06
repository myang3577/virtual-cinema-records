var express = require("express");
var router = express.Router();
var AWS = require("aws-sdk");
const fetch = require("node-fetch");
var async = require("async");

AWS.config.loadFromPath("./config.json");
AWS.config.apiVersion = {
    dynamodb: "latest",
};

const db = new AWS.DynamoDB.DocumentClient();

const blacklistTableName = "Blacklist";

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
            console.error("Unable to query from blacklist table. Error:", JSON.stringify(err, null, 2));
            res.status(err.statusCode);
            res.send("Unable to query. See console for output.");
        } else {
            res.send(data.Items);
        }
    });
}

// Add a movie to the user's blacklist
function putBlacklistedMovie(req, res, next) {
    console.log(req.params.email);
    console.log(req.body.tmdb_id);
    console.log(req.body);
    var params = {
        TableName: blacklistTableName,
        Item: {
            username: req.params.email,
            tmdb_id: req.body.tmdb_id
        }
    };

    db.put(params, function (err, data) {
        if (err) {
            res.status(err.statusCode).end();
            console.error("Unable to put movie into blacklist table on blacklisting movie. Error:");
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
            tmdb_id: req.body.tmdb_id
        },
        ConditionExpression: "attribute_exists(tmdb_id)",
    };

    db.delete(params, function (err, data) {
        if (err) {
            res.status(err.statusCode).end();
            console.error("Unable to delete item from blacklist table. Error:");
        } else {
            console.log("Deleted item from blacklist table successfully.");
            res.end();
        }
    });
}
module.exports = router;