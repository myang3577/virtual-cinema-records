var express = require("express");
var router = express.Router();
var AWS = require("aws-sdk");
AWS.config.loadFromPath("./config.json");
AWS.config.apiVersion = {
  dynamodb: "latest",
};

const db = new AWS.DynamoDB();

// Routes
router.get("/table-list", tableList);

// Dummy function to ping the backend server and database to see if operational
function tableList(req, res, next) {
  db.listTables(function (err, data) {
    console.log(data.TableNames);
  });
  res.send("AWS - See the console plz");
}

module.exports = router;
