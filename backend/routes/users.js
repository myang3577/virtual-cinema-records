var express = require("express");
var router = express.Router();
var movie_list = require("./movie_list");
var recommender = require("./recommender");

// users
router.use("/", movie_list);
router.use("/", recommender);

module.exports = router;
