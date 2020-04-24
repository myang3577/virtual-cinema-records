// Below are some database templates that can be used to search a table,
// put something in a table, and create a new table.

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
      username: { S: "" },
    },
  },

  // Template of how to use a username sort key and a password attribute to either
  // set or update the password field
  addAttribute: {
    TableName: "Users",
    Item: {
      username: { S: "" },
      password: { S: "" },
    },
  },
};
