var express = require("express");
var router = express.Router();

var AWS = require("aws-sdk");
//NOTE ABOUT ENDPOINTS:
// IF YOU WANT TO CHANGE THE ENDPOINT, WHICH IS CURRENTLY NOT SET,
// ADD THE FOLLOWING TO THE BOTTOM OF THE JSON FILE TITLED config.json
// "endpoint" : "http://localhost:8000"
AWS.config.loadFromPath("./config.json");
AWS.config.apiVersion = {
  dynamodb: "latest",
};

const db = new AWS.DynamoDB();
const docClient = new AWS.DynamoDB.DocumentClient();

// var paramsSet1 = {
//   AttributeDefinitions: [
//     {
//       AttributeName: 'CUSTOMER_ID',
//       AttributeType: 'N'
//     },
//     {
//       AttributeName: 'CUSTOMER_NAME',
//       AttributeType: 'S'
//     }
//   ],
//   KeySchema: [
//     {
//       AttributeName: 'CUSTOMER_ID',
//       KeyType: 'HASH'
//     },
//     {
//       AttributeName: 'CUSTOMER_NAME',
//       KeyType: 'RANGE'
//     }
//   ],
//   ProvisionedThroughput: {
//     ReadCapacityUnits: 1,
//     WriteCapacityUnits: 1
//   },
//   TableName: 'CUSTOMER_LIST',
//   StreamSpecification: {
//     StreamEnabled: false
//   }
// };

// var paramsSet2 = {
//   TableName: "Users",
//   KeyConditionExpression: "username = :a",
//   // ExpressionAttributeNames:{
//   //   "#yr": "year"
//   // },
//   ExpressionAttributeValues: {
//     ":a": "Eric",
//   },
// };

// Database templates
const loginData = {
  TableName: "Users",
  Key: {
    username: { S: "" },
  },
};

const createAccountData = {
  TableName: "Users",
  Item: {
    username: { S: "" },
    password: { S: "" },
  },
};

// Routes
router.get("/table-list", tableList);
router.get("/checkLogin", checkLogin);
router.get("/createAccount", createAccount);

// Functions to service routes
function tableList(req, res, next) {
  db.listTables(function (err, data) {
    console.log(data.TableNames);
  });
  res.send("AWS - See the console plz");
}

function checkValidEmail(username) {
  const EMAIL_FORMAT = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  return !EMAIL_FORMAT.test(String(username).toLowerCase());
}

function checkLogin(req, res, next) {
  let username = decodeURIComponent(req.query.username).trim();
  let password = decodeURIComponent(req.query.password).trim();
  req.match = false;
  const invalidEmail =
    "The entered username was not a valid email address. Please try again with a valid email address";
  const userNotExist =
    "There is no user with the provided username. Please register for an account";
  const dbError = "Login failed. Database error.";
  const wrongPassword =
    "The username and password entered are incorrect. Please try again";
  let feedback;
  // Check if username is a valid email address
  if (checkValidEmail(username)) {
    res.json({ isLoggedIn: req.match, requestFeedback: invalidEmail });
    return;
  }
  console.log(loginData);
  loginData.Key.username.S = username;
  console.log("username is: " + username);
  console.log("loginData.Key.username.S is: " + loginData.Key.username.S);
  console.log(loginData);
  db.getItem(loginData, function (err, data) {
    if (err) {
      console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
      res.json({ isLoggedIn: req.match, requestFeedback: dbError });
    } else {
      console.log("Query succeeded for getItem.");
      console.log(data);
      if (Object.keys(data).length == 0) {
        console.log("No data found!");
        feedback = userNotExist;
      } else {
        console.log(data.Item.username.S + " is cool");
        if (data.Item.password.S.localeCompare(password) == 0) {
          req.match = true;
        } else {
          feedback = wrongPassword;
        }
      }

      res.json({ isLoggedIn: req.match, requestFeedback: feedback });

      // Example of a forEach loop
      // data.Items.forEach(function(item) {
      //   if ( item.password.localeCompare(password) == 0){
      //     // res.send(true);
      //     req.match = "true";
      //   }
      //   // if ( item.password == password){
      //   //   // res.send(true);
      //   //   match = true;
      //   // }
      //   // else{
      //   //   res.send(false);
      //   // }
      //   // console.log(" -", item.year + ": " + item.title);
      //   // res.send(match);
      //   console.log("print first");
      //   console.log(" - query password is:", item.password);
      //   console.log(" - parameter password is:",password);
      //   console.log(" - match is:", req.match);
      //   // next();
      // });
    }
  });
}

function checkIfAcctExists(username) {
  // Below is a promise because we want to check if an account exists before we
  // attempt to  put something in it. Account checking is asynchronous so we
  // need to wrap it in a promise.
  // resolve and reject are callback functions. They are not parameters.
  // They are called after the promise has been completed. Think of them as
  // return except for promises.
  return new Promise((resolve, reject) => {
    loginData.Key.username.S = username;
    console.log("tag");
    // console.log(yes);
    console.log(loginData);
    console.log(loginData.Key.username.S);
    db.getItem(loginData, function (err, data) {
      if (err) {
        console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
      } else {
        if (Object.keys(data).length == 0) {
          console.log("No data found!");
          // return false;
          resolve(false);
        } else {
          console.log("found " + data.Item.username.S);
          // return true;
          resolve(true);
        }
      }
    });
    // resolve(false);
  });
}

// function returnPromise() {
//   return new Promise(function (resolve, reject) {
//     resolve("start of new promise");
//   });
// }

function createAccount(req, res, next) {
  const username = decodeURIComponent(req.query.username).trim();
  const password = decodeURIComponent(req.query.password).trim();

  const invalidEmail =
    "The entered username was not a valid email address. Please try again with a valid email address";
  const success = "Account successfully created!";
  const acctExist = "Account could not be created. Username already exists.";
  const dbError = "Account could not be created. Database error.";
  // Check if username is a valid email address
  if (checkValidEmail(username)) {
    res.json({ requestFeedback: invalidEmail });
    return;
  }
  createAccountData.Item.username.S = username;
  createAccountData.Item.password.S = password;
  checkIfAcctExists(username).then((acctStatus) => {
    console.log(acctStatus);
    if (acctStatus) {
      res.json({ requestFeedback: acctExist });
      return;
    }

    db.putItem(createAccountData, function (err, data) {
      if (err) {
        console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        res.json({ requestFeedback: dbError });
      } else {
        res.json({ requestFeedback: success });
      }
    });
  });
  // let doesAcctExist = checkIfAcctExists(username);
  // if (doesAcctExist) {
  //   res.json({ requestFeedback: failAcctExist });
  //   return;
  // }
}

module.exports = router;
