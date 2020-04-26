// Below are some database templates that can be used to search a table,
// put something in a table, and create a new table.

const EMPTY_STRING = "";

module.exports = {
  // Example on how to create a table with a given name, sort key, and attribute
  createTable: {
    AttributeDefinitions: [
      {
        AttributeName: "CUSTOMER_ID",
        AttributeType: "N",
      },
      {
        AttributeName: "CUSTOMER_NAME",
        AttributeType: "S",
      },
    ],
    KeySchema: [
      {
        AttributeName: "CUSTOMER_ID",
        KeyType: "HASH",
      },
      {
        AttributeName: "CUSTOMER_NAME",
        KeyType: "RANGE",
      },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1,
    },
    TableName: "CUSTOMER_LIST",
    StreamSpecification: {
      StreamEnabled: false,
    },
  },

  // Template of how to use a key parameter to search for a user by username
  searchParam: {
    TableName: "Users",
    Key: {
      username: "",
    },
  },

  // Template of how to use a username sort key and a password attribute to either
  // set or update the password field
  addAttribute: {
    TableName: "Users",
    Item: {
      username: "",
      password: "",
    },
  },

  exampleSetRanking: {
    TableName: "Users",
    Key: {
      username: "epyeh@ucsd.edu",
    },
    UpdateExpression: "SET movieList.#movie.ranking = :r",
    ExpressionAttributeNames: {
      "#movie": "Interstellar",
    },
    ExpressionAttributeValues: {
      ":r": "5",
    },
  },

  exampleCreateNewMovie: {
    TableName: "Users",
    Key: {
      username: "",
    },
    UpdateExpression: "SET movieList.#movie = :movie",
    ExpressionAttributeNames: {
      "#movie": "",
    },
    ExpressionAttributeValues: {
      ":movie": {
        APIkey: "",
        ranking: "",
        genre: "",
      },
    },
  },
};
