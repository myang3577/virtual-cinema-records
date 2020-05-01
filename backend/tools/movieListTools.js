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
        if (data.Items.length === 0) {
          resolve({ isExist: false, currRating: 0 });
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
        throw new Error("Error getting actor data from TMDB");
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

module.exports = {
  checkIfKeyAndSortExists: checkIfKeyAndSortExists,
  fetchAndCheck: fetchAndCheck,
  getSearchParam: getSearchParam,
  getSearchAndFilterParam: getSearchAndFilterParam,
  sortByRating: sortByRating,
  sortByRatingAndCount: sortByRatingAndCount,
};
