var express = require("express");
var router = express.Router();
var AWS = require("aws-sdk");
var async = require("async");

AWS.config.update({ region: "us-east-2" });
AWS.config.apiVersion = {
  dynamodb: "latest",
};

const {
  fetchAndCheck,
  getSearchAndFilterParam,
} = require("../tools/movieListTools");

const db = new AWS.DynamoDB.DocumentClient();

const movieTableName = "MovieList";
const genreTableName = "Genre";
const actorTableName = "Actors";
const blacklistTableName = "Blacklist";
const apiKey = "5e38014a47f9412c29d0ca4667091633";
const MOVIE_DETAILS_API =
  "https://api.themoviedb.org/3/movie/$TMDB_ID?api_key=$APIKEY&language=en-US";

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

// Indicates when to stop searching.
const MAX_PAGE_SEARCH_LIMIT = 10;

// users/:email/movie-list
router.get("/:email/movie-recommendation", movieRecommendation);
router.get("/:email/actor-recommendation", actorRecommendation);
router.get("/:email/genre-recommendation", genreRecommendation);

function getRecommendation(req, res, next, params) {
  let query = params.query; // dynamodb query object
  let recType = params.recType; // string representing the recommendation type. As of 05/07/20 only movie, actor, genre
  let tmdbIdArray = params.tmdbIdArray; // Array containing tmdb id of all movies in user's mymovies list
  let blacklistTmdbIdArray = params.blacklistTmdbIdArray; // Array containing tmdb id of movies in user's blacklist
  let NUM_OBJ = params.NUM_OBJ; // Represents the number of movies, actors, or genres to  recommend for
  let NUM_REC = params.NUM_REC; // Represent the number of recommendations per movie, actor, genre

  // Represents the specific end point to query for each actor to get the recommendations. This apiQuery will
  // have $ID and $APIKEY that needs to be replaced. Genre will also have
  // $PAGE for the page of the genre to get movies from
  let apiQuery = params.apiQuery;

  db.query(query, function (err, data) {
    if (err) {
      res.status(err.statusCode);
      res.send("Unable to query. See console for output.");
      throw new Error("Unable to query. Error:", JSON.stringify(err, null, 2));
    } else {
      // Change this to an object where key is the name of movie/actor/genre and
      // the value is an array of movies recommended based on that
      // movie/actor/genre
      // ie {Matt Damon: [{Insert movie data here},{Insert movie data here}]}
      // let recommendedMovieData = [];
      let recommendedMovieData = {};
      let tmpRatings;
      switch (recType) {
        case "movie":
          tmpRatings = vgFunction(data, recType);
          quickSort(tmpRatings, data.Items, 0, tmpRatings.length - 1);
          break;
        case "actor":
          tmpRatings = vgFunction(data, recType);
          quickSort(tmpRatings, data.Items, 0, tmpRatings.length - 1);
          break;
        case "genre":
          tmpRatings = vgFunction(data, recType);
          quickSort(tmpRatings, data.Items, 0, tmpRatings.length - 1);
          break;
      }

      // Only recommend for the first NUM_OBJ
      data.Items = data.Items.slice(0, NUM_OBJ);

      // Get recommendations for the designated number of movies above minimum
      // ranking
      let count = data.Items.length;
      async
        .each(data.Items, async function (item_data, callback) {
          // Set the name of the movie we are recommending for
          let categoryName = item_data[recType + "_name"];
          let apiEndpoint = apiQuery.replace("$APIKEY", apiKey);

          switch (recType) {
            case "movie":
              apiEndpoint = apiEndpoint.replace("$ID", item_data.tmdb_id);
              break;
            case "actor":
              apiEndpoint = apiEndpoint.replace("$ID", item_data.actor_id);
              break;
            case "genre":
              apiEndpoint = apiEndpoint.replace("$ID", item_data.genre_id);
              break;
          }

          // Fill the recommendedMovies array with movies that are not in
          // the user's mymovies list
          let recommendedMoviesArray = [];
          let currPage = 1;

          while (recommendedMoviesArray.length < NUM_REC) {
            try {
              // api end point will change on case by case basis

              await fetchAndCheck(apiEndpoint + currPage)
                .then((json) => {
                  let results; // Used to hold the returned movie results
                  switch (recType) {
                    case "movie":
                    case "genre":
                      results = json.results;
                      break;
                    case "actor":
                      results = json.cast;
                      break;
                  }
                  results.forEach((movie) => {
                    // Check if the movie has already been recommended
                    let inRecommended = false;
                    recommendedMoviesArray.map((element) => {
                      if (element.id === movie.id) {
                        inRecommended = true;
                      }
                    });

                    // If the movie is not in the user's movie list and the list is not full, then add it
                    if (
                      !tmdbIdArray.includes(movie.id) &&
                      !blacklistTmdbIdArray.includes(movie.id) &&
                      !inRecommended &&
                      recommendedMoviesArray.length < NUM_REC
                    ) {
                      recommendedMoviesArray.push(movie);
                    }
                  });
                  currPage++;
                })
                .catch((error) => {
                  throw new Error(error);
                });
            } catch (err) {
              console.log(
                "An error occurred. Could not fetch " +
                  recType +
                  " recommendations",
                err
              );
              break;
            }

            if (currPage > MAX_PAGE_SEARCH_LIMIT) {
              break;
            }
          }

          await async
            .each(recommendedMoviesArray, function (item_data, callback) {
              let apiMovieDetailEndpoint = MOVIE_DETAILS_API.replace(
                "$TMDB_ID",
                item_data.id
              ).replace("$APIKEY", apiKey);
              fetchAndCheck(apiMovieDetailEndpoint)
                .then((json) => {
                  // If the category name does not exist yet, make a new
                  // array for it
                  if (!(categoryName in recommendedMovieData)) {
                    recommendedMovieData[categoryName] = [];
                  }

                  recommendedMovieData[categoryName].push(json);

                  callback();
                })
                .catch((err) => {
                  console.error(err);
                });
            })
            .then(() => {
              count--;
              if (count === 0) {
                Promise.resolve();
              }
            })
            .catch((err) => {
              console.error(err);
            });
        })
        .then(() => {
          let counter = 0;

          Object.keys(recommendedMovieData).forEach((key) => {
            counter += recommendedMovieData[key].length;
          });
          console.log(
            "Recommmended " + counter + " movies for " + recType + " category"
          );
          res.send(recommendedMovieData);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  });
}

function vgFunction(data, recType) {
  let randomNormal = require("random-normal");
  let tmpRatings = [];
  if (recType == "movie") {
    for (let i = 0; i < data.Items.length; i++) {
      // Do the calculation for the amount of times that actor has been ranked
      //Make sure our number is below 5
      let num = randomNormal({ mean: data.Items[i].rating, dev: 0.75 });
      if (num >= 5) {
        i--;
        continue;
      }
      // If first one, add it to the tmpList
      tmpRatings.push(num);
    }
    return tmpRatings;
  }

  // Now for actor/genre
  // Make a for loop that does the calculation
  for (let i = 0; i < data.Items.length; i++) {
    // Do the calculation for the amount of times that actor has been ranked
    for (let j = 0; j < data.Items[i].movie_count; j++) {
      //Make sure our number is below 5 and above 0
      let num = randomNormal({ mean: data.Items[i].rating, dev: 0.75 });
      if (num >= 5 || num <= 0) {
        j--;
        continue;
      }
      // If first one, add it to the tmpList
      if (j == 0) {
        tmpRatings.push(num);
      } else {
        tmpRatings[i] += num;
      }
    }
    //Divide by count at the end for the average!
    if (data.Items[i].movie_count != 0) {
      tmpRatings[i] = tmpRatings[i] / data.Items[i].movie_count;
    }
  }
  return tmpRatings;
}

function getUserMovieList(email) {
  var movieListParams = {
    TableName: movieTableName,
    KeyConditionExpression: "#user = :user",
    ExpressionAttributeNames: {
      "#user": "username",
    },
    ExpressionAttributeValues: {
      ":user": email,
    },
  };

  return new Promise((resolve, reject) => {
    db.query(movieListParams, async function (err, allMovieListData) {
      if (err) {
        console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        // res.status(err.statusCode);
        // res.send("Unable to query. See console for output.");
      } else {
        resolve(
          allMovieListData.Items.map((key) => {
            return key.tmdb_id;
          })
        );
      }
    });
  });
}

function getUserBlackList(email) {
  var blackListParams = {
    TableName: blacklistTableName,
    KeyConditionExpression: "#user = :user",
    ExpressionAttributeNames: {
      "#user": "username",
    },
    ExpressionAttributeValues: {
      ":user": email,
    },
  };

  return new Promise((resolve, reject) => {
    db.query(blackListParams, async function (err, allMovieListData) {
      if (err) {
        console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        // res.status(err.statusCode);
        // res.send("Unable to query. See console for output.");
      } else {
        resolve(
          allMovieListData.Items.map((key) => {
            return key.tmdb_id;
          })
        );
      }
    });
  });
}

//VG STUFF
//https://www.guru99.com/quicksort-in-javascript.html, edited to fit my needs

function swap(items, leftIndex, rightIndex) {
  var temp = items[leftIndex];
  items[leftIndex] = items[rightIndex];
  items[rightIndex] = temp;
}
function partition(items, secondaryItems, left, right) {
  var pivot = items[Math.floor((right + left) / 2)], //middle element
    i = left, //left pointer
    j = right; //right pointer
  while (i <= j) {
    while (items[i] > pivot) {
      i++;
    }
    while (items[j] < pivot) {
      j--;
    }
    if (i <= j) {
      swap(items, i, j); //sawpping two elements
      swap(secondaryItems, i, j);
      i++;
      j--;
    }
  }
  return i;
}

function quickSort(items, secondaryItems, left, right) {
  var index;
  if (items.length > 1) {
    index = partition(items, secondaryItems, left, right); //index returned from partition
    if (left < index - 1) {
      //more elements on the left side of the pivot
      quickSort(items, secondaryItems, left, index - 1);
    }
    if (index < right) {
      //more elements on the right side of the pivot
      quickSort(items, secondaryItems, index, right);
    }
  }
  return secondaryItems;
}
// End of VG stuff

// Creates the necessary parameters and gets the recommendations for the movies
function movieRecommendation(req, res, next) {
  var queryMovie = getSearchAndFilterParam(
    movieTableName,
    "username",
    "rating",
    req.params.email,
    MINIMUM_MOVIE_RATING
  );
  let params = {
    query: queryMovie,
    recType: "movie",
    NUM_OBJ: NUM_MOVIES_TO_RECOMMEND_FOR,
    NUM_REC: NUM_RECOMMENDATION_PER_MOVIE,
    apiQuery:
      "https://api.themoviedb.org/3/movie/$ID/recommendations?api_key=$APIKEY&language=en-US&page=",
  };

  getUserMovieList(req.params.email).then((tmdbIdArray) => {
    params.tmdbIdArray = tmdbIdArray;
    getUserBlackList(req.params.email).then((tmdbIdArray) => {
      params.blacklistTmdbIdArray = tmdbIdArray;
      getRecommendation(req, res, next, params);
    });
  });
}

// Creates the necessary parameters and gets the recommendations for the actors
function actorRecommendation(req, res, next) {
  var queryActor = getSearchAndFilterParam(
    actorTableName,
    "username",
    "rating",
    req.params.email,
    MINIMUM_ACTOR_RATING
  );
  let params = {
    query: queryActor,
    recType: "actor",
    NUM_OBJ: NUM_ACTORS_TO_RECOMMEND_FOR,
    NUM_REC: NUM_RECOMMENDATION_PER_ACTOR,
    apiQuery:
      "https://api.themoviedb.org/3/person/$ID/movie_credits?api_key=$APIKEY&language=en-US&page=",
  };
  getUserMovieList(req.params.email).then((tmdbIdArray) => {
    params.tmdbIdArray = tmdbIdArray;
    getUserBlackList(req.params.email).then((tmdbIdArray) => {
      params.blacklistTmdbIdArray = tmdbIdArray;
      getRecommendation(req, res, next, params);
    });
  });
}

// Creates the necessary parameters and gets the recommendations for the genre
function genreRecommendation(req, res, next) {
  var queryGenre = getSearchAndFilterParam(
    genreTableName,
    "username",
    "rating",
    req.params.email,
    MINIMUM_GENRE_RATING
  );
  let params = {
    query: queryGenre,
    recType: "genre",
    NUM_OBJ: NUM_GENRE_TO_RECOMMEND_FOR,
    NUM_REC: NUM_RECOMMENDATION_PER_GENRE,
    apiQuery:
      "https://api.themoviedb.org/3/discover/movie?api_key=$APIKEY&with_genres=$ID&language=en-US&page=",
  };
  getUserMovieList(req.params.email).then((tmdbIdArray) => {
    params.tmdbIdArray = tmdbIdArray;
    getUserBlackList(req.params.email).then((tmdbIdArray) => {
      params.blacklistTmdbIdArray = tmdbIdArray;
      getRecommendation(req, res, next, params);
    });
  });
}

module.exports = router;
