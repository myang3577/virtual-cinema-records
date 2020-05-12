var AWS = require("aws-sdk");
const fetch = require("node-fetch");

AWS.config.loadFromPath("./config.json");
AWS.config.apiVersion = {
  dynamodb: "latest",
};

const db = new AWS.DynamoDB.DocumentClient();

// Helper function used to check if a user and movie already exist and if it
// does it gets the rating
function checkIfKeyAndSortExists(
  tableName,
  primaryKey,
  sortKey,
  primaryVal,
  sortVal
) {
  return new Promise((resolve, reject) => {
    let searchParam = getSearchParam(
      tableName,
      primaryKey,
      sortKey,
      primaryVal,
      sortVal
    );

    db.query(searchParam, function (err, data) {
      if (err) {
        console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        return;
      } else {
        // console.log(data.Items);
        if (data.Items.length === 0) {
          resolve({ isExist: false, currRating: 0 });
        } else if (
          isNaN(data.Items[0].rating) ||
          data.Items[0].rating === undefined
        ) {
          resolve({ isExist: true, currRating: 0 });
        } else {
          resolve({ isExist: true, currRating: data.Items[0].rating });
        }
      }
    });
  });
}

// Helper function to fetch the given api end point and check the response is ok
function fetchAndCheck(apiEndPoint) {
  return fetch(apiEndPoint)
    .then((apiResponse) => {
      let status = apiResponse.status;
      if (status < 200 || status >= 300) {
        throw new Error("Error getting data from TMDB");
      }
      return apiResponse.json();
    })
    .then((json) => {
      if (typeof json === "undefined") {
        throw new Error("Returned json object is undefined");
      }
      return json;
    })
    .catch((err) => {
      console.log(err);
    });
}

// Generates the dynamodb format for searching given a primary and sort key
function getSearchParam(tableName, primaryKey, sortKey, primaryVal, sortVal) {
  return {
    TableName: tableName,
    KeyConditionExpression: "#user = :user and #sort = :sort",
    ExpressionAttributeNames: {
      "#user": primaryKey,
      "#sort": sortKey,
    },
    ExpressionAttributeValues: {
      ":user": primaryVal,
      ":sort": sortVal,
    },
  };
}

// Generates the dynamodb format for searching given a primary key and a filter
function getSearchAndFilterParam(
  tableName,
  primaryKey,
  filterKey,
  primaryVal,
  filterVal
) {
  return {
    TableName: tableName,
    KeyConditionExpression: "#user = :user",
    ExpressionAttributeNames: {
      "#user": primaryKey,
      "#rating": filterKey,
    },
    ExpressionAttributeValues: {
      ":user": primaryVal,
      ":rating": filterVal,
    },
    FilterExpression: "#rating > :rating",
  };
}

function getPutParam(
  tableName,
  email,
  categoryID,
  categoryIDVal,
  categoryName,
  categoryNameVal,
  rating,
  movie_count = 1
) {
  return {
    TableName: tableName,
    Item: {
      username: email,
      [categoryID]: categoryIDVal,
      rating: rating,
      movie_count: movie_count,
      [categoryName]: categoryNameVal,
    },
  };
}

function getDeleteParam(tableName, email, categoryID, categoryIDVal) {
  return {
    TableName: tableName,
    Key: {
      username: email,
      [categoryID]: categoryIDVal,
    },
    ConditionExpression: "attribute_exists(" + [categoryID] + ")",
  };
}

// Helper function to sort an array by rating
function sortByRating(left, right) {
  if (left.rating >= right.rating) {
    return -1;
  }
  return 1;
}

// Helper function to sort an array by rating and movie count
function sortByRatingAndCount(left, right) {
  if (left.rating > right.rating) {
    return -1;
  } else if (left.rating < right.rating) {
    return 1;
  } else {
    if (left.movie_count > right.movie_count) {
      return -1;
    } else {
      return 1;
    }
  }
}

function updateMovieCategories(params) {
  let apiEndPoint = params.apiEndPoint;
  let newRating = params.newRating;
  let currRating = params.currRating;
  let email = params.email;
  let tableName = params.tableName;
  let isExist = params.isExist; // boolean indicating if a movie exists already
  let type = params.type; // "actor" or "genre"
  let isDelete = params.isDelete; // boolean indicating if we are deleting a movie
  let DECAY_THRESHOLD = params.DECAY_THRESHOLD; // Constants defined in movie_list.js
  let DECAY_RATE = params.DECAY_RATE; // Constants defined in movie_list.js
  let THRESHOLD = params.THRESHOLD; // Constants defined in movie_list.js
  // let
  // console.log("type is: " + type);
  // let

  let movieRating = newRating - currRating;
  // console.log(params);
  // console.log(movieRating);
  fetchAndCheck(apiEndPoint)
    .then((json) => {
      let dataArray;

      switch (type) {
        case "actor":
          dataArray = json.cast;
          break;
        case "genre":
          dataArray = json.genres;
          THRESHOLD = dataArray.length;
          break;
      }

      // Loop through the top THRESHOLD actors/genres. async not required
      // because db query by default will be async
      for (let i = 0; i < THRESHOLD; i++) {
        let categoryUpdateRating = movieRating;

        // If i is greater than the threshold apply no decay
        if (i >= DECAY_THRESHOLD) {
          categoryUpdateRating =
            movieRating * Math.pow(DECAY_RATE, i - DECAY_THRESHOLD + 1);
        }
        // console.log(categoryUpdateRating);
        // Get category query parameters
        let searchCategory = getSearchParam(
          tableName,
          "username",
          type + "_id",
          email,
          dataArray[i].id
        );
        // console.log("categoryUpdateRating is: " + categoryUpdateRating);
        // Query category table for current rating and movie count
        db.query(searchCategory, function (err, data) {
          if (err) {
            throw new Error(
              "Unable to query " + type + " table. Error:",
              JSON.stringify(err, null, 2)
            );
          } else {
            // If not delete, then add the category item
            if (!isDelete) {
              // Default is a new movie and new category item
              let putCategory = getPutParam(
                tableName,
                email,
                type + "_id",
                dataArray[i].id,
                type + "_name",
                dataArray[i].name,
                categoryUpdateRating
              );

              // Case where the category item exists, update the rating and movie
              // count
              if (data.Items.length !== 0) {
                // If the movie already exists and has a rating, keep the movie count
                if (isExist && currRating !== 0) {
                  putCategory.Item.movie_count = data.Items[0].movie_count;
                }
                // Else add 1 to the movie_count
                else {
                  putCategory.Item.movie_count = data.Items[0].movie_count + 1;
                }

                // Update the average rating
                putCategory.Item.rating =
                  (categoryUpdateRating +
                    data.Items[0].rating * data.Items[0].movie_count) /
                  putCategory.Item.movie_count;
              }
              // console.log(putCategory);
              // Update the actors ranking
              db.put(putCategory, function (err, data) {
                if (err) {
                  throw new Error(
                    "Unable to put " +
                      type +
                      " into table on add movie. Error:",
                    JSON.stringify(err, null, 2)
                  );
                } else {
                  console.log(
                    type + " rating successfully updated on movie add"
                  );
                }
              });
            }

            // If delete, check the delete and either delete or update the table
            else {
              if (data.Items.length === 0) {
                throw new Error(
                  "Empty data.Items object of " +
                    type +
                    " query." +
                    " This means a movie was added successfully but one of the " +
                    type +
                    " were not. "
                );
              }

              // If deleting sets the movie_count for this category item to 0, remove
              // the entry instead and skip update
              if (data.Items[0].movie_count === 1) {
                let deleteCategory = getDeleteParam(
                  tableName,
                  email,
                  type + "_id",
                  dataArray[i].id
                );
                // console.log(deleteCategory);

                db.delete(deleteCategory, function (err, data) {
                  if (err) {
                    throw new Error(
                      "Unable to delete " + type + " item. Error:",
                      JSON.stringify(err, null, 2)
                    );
                  } else {
                    console.log("Deleted " + type + " item successfully.");
                  }
                });
              }

              // Otherwise update the category
              else {
                // console.log(
                //   "category updaterating is: " + categoryUpdateRating
                // );
                let newRating =
                  (data.Items[0].rating * data.Items[0].movie_count +
                    categoryUpdateRating) /
                  (data.Items[0].movie_count - 1);
                let putCategory = getPutParam(
                  tableName,
                  email,
                  type + "_id",
                  dataArray[i].id,
                  type + "_name",
                  dataArray[i].name,
                  newRating,
                  data.Items[0].movie_count - 1
                );
                // console.log(putCategory);

                db.put(putCategory, function (err, data) {
                  if (err) {
                    throw new Error(
                      "Unable to put " +
                        type +
                        " into table on delete movie. Error:",
                      JSON.stringify(err, null, 2)
                    );
                  } else {
                    console.log(
                      type + " rating successfully updated on movie delete"
                    );
                  }
                });
              }
            }
          }
        });
      }
    })
    .catch((err) => {
      console.error(err);
    });
}

module.exports = {
  checkIfKeyAndSortExists: checkIfKeyAndSortExists,
  fetchAndCheck: fetchAndCheck,
  getSearchParam: getSearchParam,
  getSearchAndFilterParam: getSearchAndFilterParam,
  sortByRating: sortByRating,
  sortByRatingAndCount: sortByRatingAndCount,
  updateMovieCategories: updateMovieCategories,
};
