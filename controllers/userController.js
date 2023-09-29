const fs = require("fs");
const catchAsync = require("../helper/catchAsync");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config("config.env");

// Load data from the JSON file
const userDetail = "userDetail.json";
let data = require(`../${userDetail}`);

// Middleware to write data to the JSON file
function saveData() {
  fs.writeFileSync(userDetail, JSON.stringify(data, null, 2));
}

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
const createSendToken = (user, statusCode, res) => {
  const payload = `${user}--${user.id}`;

  const token = signToken(payload);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.cookie("jwt", token, cookieOptions);
  user.password = undefined; // hide password field from the response of document
  res.status(statusCode).json({
    status: "success",
    token: token,
    user: user,
  });
};

exports.userRegister = catchAsync(async (req, res) => {
  let body = req.body;
  // const hashedPassword = await encryptPassword.hashPassword(body.password);
  // console.log("hashedPassword", hashedPassword);

  const userDetails = {
    firstName: body.firstName,
    lastName: body.lastName,
    DOB: body.DOB,
    password: body.password,
    email: body.email,
  };
  userDetails.id = Math.floor(Math.random() * 100000 + 1);

  data.user.push(userDetails);
  saveData();
  res.status(201).json(userDetails);
});

exports.loginUser = catchAsync(async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const userDetails = await data.user.find(
    (id) => id.email == email && id.password == password
  );

  if (userDetails) {
    createSendToken(userDetails, 200, res);
  } else {
    res.status(400).send("Email and password are incorrect.");
  }
});
