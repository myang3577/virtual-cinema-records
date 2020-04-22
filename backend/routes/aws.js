var express = require("express");
var router = express.Router();

var AWS = require("aws-sdk");
const nodemailer = require("nodemailer");
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

// Used to create or update account data
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
router.post("/createAccount", createAccount);
router.get("/changePassword", changePassword);
router.get("/resetPassword", resetPassword);

// Functions to service routes
function tableList(req, res, next) {
  db.listTables(function (err, data) {
    console.log(data.TableNames);
  });
  res.send("AWS - See the console plz");
}

// Helper function to check if the provided username is a correct email address
function checkValidEmail(username) {
  const EMAIL_FORMAT = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  return !EMAIL_FORMAT.test(String(username).toLowerCase());
}

// Checks login credentials are correct
function checkLogin(req, res, next) {
  let username = decodeURIComponent(req.query.username).trim();
  let password = decodeURIComponent(req.query.password).trim();
  // req.match = false;
  const invalidEmail =
    "The entered username was not a valid email address. Please try again with a valid email address";
  // const userNotExist =
  //   "There is no user with the provided username. Please register for an account";
  // const dbError = "Login failed. Database error.";
  // const wrongPassword =
  //   "The username and password entered are incorrect. Please try again";
  // let feedback;
  // Check if username is a valid email address
  if (checkValidEmail(username)) {
    res.json({ isLoggedIn: req.match, requestFeedback: invalidEmail });
    return;
  }
  console.log(loginData);
  // loginData.Key.username.S = username;
  console.log("username is: " + username);
  console.log("loginData.Key.username.S is: " + loginData.Key.username.S);
  console.log(loginData);

  // checkIfAcctExists(username).then((acctStatus) => {
  //   console.log(acctStatus);
  //   if (acctStatus) {
  //     res.json({ requestFeedback: acctExist });
  //     return;
  //   }

  //   db.putItem(createAccountData, function (err, data) {
  //     if (err) {
  //       console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
  //       res.json({ requestFeedback: dbError });
  //     } else {
  //       res.json({ requestFeedback: success });
  //     }
  //   });
  // });

  checkPassword(username, password).then((queryRes) => {
    res.json({
      isLoggedIn: queryRes.isCorrectPassword,
      requestFeedback: queryRes.requestFeedback,
    });
  });

  // db.getItem(loginData, function (err, data) {
  //   if (err) {
  //     console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
  //     res.json({ isLoggedIn: req.match, requestFeedback: dbError });
  //   } else {
  //     console.log("Query succeeded for getItem.");
  //     console.log(data);
  //     if (Object.keys(data).length == 0) {
  //       console.log("No data found!");
  //       feedback = userNotExist;
  //     } else {
  //       console.log(data.Item.username.S + " is cool");
  //       if (data.Item.password.S.localeCompare(password) == 0) {
  //         req.match = true;
  //       } else {
  //         feedback = wrongPassword;
  //       }
  //     }

  //     res.json({ isLoggedIn: req.match, requestFeedback: feedback });

  //     // Example of a forEach loop
  //     // data.Items.forEach(function(item) {
  //     //   if ( item.password.localeCompare(password) == 0){
  //     //     // res.send(true);
  //     //     req.match = "true";
  //     //   }
  //     //   // if ( item.password == password){
  //     //   //   // res.send(true);
  //     //   //   match = true;
  //     //   // }
  //     //   // else{
  //     //   //   res.send(false);
  //     //   // }
  //     //   // console.log(" -", item.year + ": " + item.title);
  //     //   // res.send(match);
  //     //   console.log("print first");
  //     //   console.log(" - query password is:", item.password);
  //     //   console.log(" - parameter password is:",password);
  //     //   console.log(" - match is:", req.match);
  //     //   // next();
  //     // });
  //   }
  // });
}

// Helper function to check if username and password match
function checkPassword(username, password) {
  const dbError = "Login failed. Database error.";
  const userNotExist =
    "There is no user with the provided username. Please register for an account";
  const success = "Welcome to VCR!";
  const wrongPassword =
    "The username and password entered are incorrect. Please try again";
  console.log("Call me!");

  return new Promise((resolve, reject) => {
    loginData.Key.username.S = username;
    console.log("called checkPassword");
    db.getItem(loginData, function (err, data) {
      if (err) {
        resolve({ isCorrectPassword: false, requestFeedback: dbError });
        // res.json({ isLoggedIn: req.match, requestFeedback: dbError });
      } else {
        if (Object.keys(data).length == 0) {
          // feedback = userNotExist;

          // resolve(false, userNotExist);
          resolve({ isCorrectPassword: false, requestFeedback: userNotExist });
        } else {
          if (data.Item.password.S.localeCompare(password) == 0) {
            // resolve(true, success);
            resolve({ isCorrectPassword: true, requestFeedback: success });
          } else {
            // resolve(false, wrongPassword);
            resolve({
              isCorrectPassword: false,
              requestFeedback: wrongPassword,
            });
          }
        }
      }
    });
  });
}

// Creates an account with the given username and password
function createAccount(req, res, next) {
  const username = req.body.username;
  const password = req.body.password;
  const repeatPassword = req.body.repeatPassword;
  // const username = decodeURIComponent(req.query.username).trim();
  // const password = decodeURIComponent(req.query.password).trim();
  // const repeatPassword = decodeURIComponent(req.query.repeatPassword).trim();

  const invalidEmail =
    "The entered username was not a valid email address. Please try again with a valid email address";
  const success = "Account successfully created!";
  const acctExist = "Account could not be created. Username already exists.";
  const dbError = "Account could not be created. Database error.";
  const passwordMismatch = "Entered passwords do not match";
  // Check if username is a valid email address
  if (checkValidEmail(username)) {
    res.json({ requestFeedback: invalidEmail });
    return;
  }

  // Check if both passwords entered match
  if (password !== repeatPassword) {
    res.json({ requestFeedback: passwordMismatch });
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
}

// Helper function used to determine if an account with the given username exists
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
          resolve(false);
        } else {
          console.log("found " + data.Item.username.S);
          resolve(true);
        }
      }
    });
  });
}

// Used to change the password for the given username with the new password
function changePassword(req, res, next) {
  const username = decodeURIComponent(req.query.username).trim();
  const currPassword = decodeURIComponent(req.query.password).trim(); // The current password of the user
  const newPassword = decodeURIComponent(req.query.newPassword).trim(); // The new password the user wants to set

  const invalidEmail =
    "The entered username was not a valid email address. Please try again with a valid email address";
  const success = "Password successfully changed!";
  const dbError = "Account could not be created. Database error.";
  // const userNotExist =
  //   "There is no user with the provided username. Please register for an account";
  // const wrongPassword =
  //   "The username and password entered are incorrect. Please try again";

  // Check if username is a valid email address
  if (checkValidEmail(username)) {
    res.json({ isPassChange: false, requestFeedback: invalidEmail });
    return;
  }

  checkPassword(username, currPassword).then((queryRes) => {
    // If incorrect password send feedback response and alert user that password
    // is incorrect
    if (!queryRes.isCorrectPassword) {
      res.json({
        isPassChange: false,
        requestFeedback: queryRes.requestFeedback,
      });
    }

    // Else, put the new password into the database
    else {
      createAccountData.Item.username.S = username;
      createAccountData.Item.password.S = newPassword;
      db.putItem(createAccountData, function (err, data) {
        if (err) {
          console.error(
            "Unable to query. Error:",
            JSON.stringify(err, null, 2)
          );
          res.json({ isPassChange: false, requestFeedback: dbError });
        } else {
          res.json({ isPassChange: true, requestFeedback: success });
        }
      });
    }
  });
}

function resetPassword(req, res, next) {
  const username = decodeURIComponent(req.query.username).trim();
  const invalidEmail =
    "The entered username was not a valid email address. Please try again with a valid email address";
  const success =
    "An email with your password has been sent. Please also check your spam folder";
  const dbError = "Account could not be created. Database error.";
  const userNotExist =
    "There is no user with the provided username. Please register for an account";
  const failSend = "Email failed to send. Please try again.";
  // Check if username is a valid email address
  if (checkValidEmail(username)) {
    res.json({ isPassChange: false, requestFeedback: invalidEmail });
    return;
  }

  // Get the password from the database and mail it to the user
  loginData.Key.username.S = username;
  db.getItem(loginData, function (err, data) {
    if (err) {
      console.log(dbError);
      res.json({ requestFeedback: dbError });
    } else {
      if (Object.keys(data).length == 0) {
        // feedback = userNotExist;
        // console.log("No data found!");
        // resolve(false, userNotExist);
        // resolve({ isCorrectPassword: false, requestFeedback: userNotExist });
        // console.log(userNotExist);

        res.json({ requestFeedback: userNotExist });
      } else {
        // create reusable transporter object
        const transporter = nodemailer.createTransport({
          service: "gmail",
          // host: "smtp.ethereal.email",
          // port: 587,
          auth: {
            user: "vcracctreset@gmail.com",
            pass: "VCR1@3movie",
          },
        });

        // const tmp =

        const messageBody =
          "<h2>Hi " +
          username.substring(0, username.indexOf("@")) +
          ",</h2>" +
          "<p>You recently requested to reset your VCR account password." +
          " You can find your VCR account password underneath this message. " +
          "To change your password, login to VCR and proceed to the password reset " +
          "under the user settings. " +
          "If you did not request a password reset, please ignore this message.</p>" +
          "<p>Your password for VCR is: <b>" +
          data.Item.password.S +
          "</b></p>" +
          "<p>" +
          "<br/>" +
          "<br/>" +
          "Thanks, " +
          "<br/>" +
          "The Virtual Cinema Records Team" +
          "</p>";

        // Define mail options
        const mailOptions = {
          from: '"vcr-password-reset" <vcracctreset@gmail.com>', // sender address
          to: username, // list of receivers
          subject: "VCR Password Reset", // Subject line
          html: messageBody, // plain text body
        };

        // send mail with defined transport object
        transporter
          .sendMail(mailOptions)
          .then(() => {
            console.log(success);
            res.json({ requestFeedback: success });
          })
          .catch((err) => {
            console.log(err);
            res.json({ requestFeedback: failSend });
          });
      }
    }
  });
}

module.exports = router;
