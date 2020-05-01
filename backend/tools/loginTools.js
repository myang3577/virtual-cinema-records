// const { searchParam } = require("./databaseTemplates");

var AWS = require("aws-sdk");
AWS.config.loadFromPath("./config.json");
AWS.config.apiVersion = {
  dynamodb: "latest",
};

const db = new AWS.DynamoDB.DocumentClient();

// Define useful error message strings
const invalidEmail =
  "The entered username was not a valid email address. Please try again with a valid email address";
const loginSuccess = "Welcome to VCR!";
const createAcctSuccess = "Account successfully created!";
const changePasswordSuccess = "Password successfully changed!";
const resetPasswordSuccess =
  "An email with your password has been sent. Please also check your spam folder";
const acctExist = "Account could not be created. Username already exists.";
const loginDbError = "Login could not be performed. Database error.";
const createAcctDbError = "Account could not be created. Database error.";
const changePassDbError = "Password could not be changed. Database error.";
const resetPassDbError = "Password could not be reset. Database error.";
const passwordMismatch = "Entered passwords do not match";
const wrongPassword =
  "The username and password entered are incorrect. Please try again";
const userNotExist =
  "There is no user with the provided username. Please register for an account";
const failSend = "Email failed to send. Please try again.";

// Helper function to check if the provided username is a correct email address
function checkValidEmail(username) {
  const EMAIL_FORMAT = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  return !EMAIL_FORMAT.test(String(username).toLowerCase());
}

// Helper function to check if username and password match
function checkPassword(username, password) {
  return new Promise((resolve, reject) => {
    let searchParam = {
      TableName: "Users",
      Key: {
        username: "",
      },
    };
    searchParam.Key.username = username;
    db.get(searchParam, function (err, data) {
      if (err) {
        resolve({ isCorrectPassword: false, requestFeedback: loginDbError });
      } else {
        if (Object.keys(data).length == 0) {
          resolve({ isCorrectPassword: false, requestFeedback: userNotExist });
        } else {
          if (data.Item.password.localeCompare(password) == 0) {
            resolve({ isCorrectPassword: true, requestFeedback: loginSuccess });
          } else {
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

// Helper function used to check if an existing user exists with the provided username
function checkIfAcctExists(username) {
  // Below is a promise because we want to check if an account exists before we
  // attempt to  put something in it. Account checking is asynchronous so we
  // need to wrap it in a promise.
  // resolve and reject are callback functions. They are not parameters.
  // They are called after the promise has been completed. Think of them as
  // return except for promises.
  return new Promise((resolve, reject) => {
    let searchParam = {
      TableName: "Users",
      Key: {
        username: "",
      },
    };
    searchParam.Key.username = username;
    db.get(searchParam, function (err, data) {
      if (err) {
        console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        resolve(true);
      } else {
        if (Object.keys(data).length == 0) {
          resolve(false);
        } else {
          resolve(true);
        }
      }
    });
  });
}

function createForgotPassEmail(username, password) {
  return (
    "<h2>Hi " +
    username.substring(0, username.indexOf("@")) +
    ",</h2>" +
    "<p>You recently requested to reset your VCR account password." +
    " You can find your VCR account password underneath this message. " +
    "To change your password, login to VCR and proceed to the password reset " +
    "under the user settings. " +
    "If you did not request a password reset, please ignore this message.</p>" +
    "<p>Your password for VCR is: <b>" +
    password +
    "</b></p>" +
    "<p>" +
    "<br/>" +
    "<br/>" +
    "Thanks, " +
    "<br/>" +
    "The Virtual Cinema Records Team" +
    "</p>"
  );
}

// Export for login.js to use
module.exports = {
  checkValidEmail: checkValidEmail,
  checkPassword: checkPassword,
  checkIfAcctExists: checkIfAcctExists,
  createForgotPassEmail: createForgotPassEmail,
  invalidEmail: invalidEmail,
  createAcctSuccess: createAcctSuccess,
  changePasswordSuccess: changePasswordSuccess,
  acctExist: acctExist,
  createAcctDbError: createAcctDbError,
  changePassDbError: changePassDbError,
  resetPassDbError: resetPassDbError,
  passwordMismatch: passwordMismatch,
  resetPasswordSuccess: resetPasswordSuccess,
  userNotExist: userNotExist,
  failSend: failSend,
};
