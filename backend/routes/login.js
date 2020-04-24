var express = require("express");
var router = express.Router();
var AWS = require("aws-sdk");
const nodemailer = require("nodemailer");
const {
  checkValidEmail,
  checkPassword,
  checkIfAcctExists,
  createForgotPassEmail,
  invalidEmail,
  createAcctSuccess,
  changePasswordSuccess,
  acctExist,
  createAcctdbError,
  changePassDbError,
  resetPassDbError,
  passwordMismatch,
  resetPasswordSuccess,
  userNotExist,
  failSend,
} = require("../tools/loginTools");

const { searchParam, addAttribute } = require("../tools/databaseTemplates");
AWS.config.loadFromPath("./config.json");
AWS.config.apiVersion = {
  dynamodb: "latest",
};

const db = new AWS.DynamoDB();

// Routes
router.post("/checkLogin", checkLogin);
router.post("/createAccount", createAccount);
router.post("/changePassword", changePassword);
router.post("/resetPassword", resetPassword);

// Checks login credentials are correct
function checkLogin(req, res, next) {
  const username = req.body.username;
  const password = req.body.password;

  // Check if username is a valid email address
  if (checkValidEmail(username)) {
    res.json({ isLoggedIn: req.match, requestFeedback: invalidEmail });
    return;
  }

  checkPassword(username, password).then((queryRes) => {
    res.json({
      isLoggedIn: queryRes.isCorrectPassword,
      requestFeedback: queryRes.requestFeedback,
    });
  });
}

function createAccount(req, res, next) {
  const username = req.body.username;
  const password = req.body.password;
  const repeatPassword = req.body.repeatPassword;

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

  addAttribute.Item.username.S = username;
  addAttribute.Item.password.S = password;
  checkIfAcctExists(username).then((acctStatus) => {
    if (acctStatus) {
      res.json({ requestFeedback: acctExist });
      return;
    }

    db.putItem(addAttribute, function (err, data) {
      if (err) {
        console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        res.json({ requestFeedback: createAcctdbError });
      } else {
        res.json({ requestFeedback: createAcctSuccess });
      }
    });
  });
}

// Used to change the password for the given username with the new password
function changePassword(req, res, next) {
  const username = req.body.username;
  const currPassword = req.body.currPassword; // The current password of the user
  const newPassword = req.body.newPassword; // The new password the user wants to set

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
      addAttribute.Item.username.S = username;
      addAttribute.Item.password.S = newPassword;
      db.putItem(addAttribute, function (err, data) {
        if (err) {
          console.error(
            "Unable to query. Error:",
            JSON.stringify(err, null, 2)
          );
          res.json({ isPassChange: false, requestFeedback: changePassDbError });
        } else {
          res.json({
            isPassChange: true,
            requestFeedback: changePasswordSuccess,
          });
        }
      });
    }
  });
}

function resetPassword(req, res, next) {
  const username = req.body.username;

  // Check if username is a valid email address
  if (checkValidEmail(username)) {
    res.json({ isPassChange: false, requestFeedback: invalidEmail });
    return;
  }

  // Get the password from the database and mail it to the user
  searchParam.Key.username.S = username;
  db.getItem(searchParam, function (err, data) {
    if (err) {
      console.log(resetPassDbError);
      res.json({ requestFeedback: resetPassDbError });
    } else {
      if (Object.keys(data).length == 0) {
        res.json({ requestFeedback: userNotExist });
      } else {
        // create reusable transporter object
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "vcracctreset@gmail.com",
            pass: "VCR1@3movie",
          },
        });

        const messageBody = createForgotPassEmail(
          username,
          data.Item.password.S
        );

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
            res.json({ requestFeedback: resetPasswordSuccess });
          })
          .catch((err) => {
            res.json({ requestFeedback: failSend });
          });
      }
    }
  });
}

module.exports = router;
