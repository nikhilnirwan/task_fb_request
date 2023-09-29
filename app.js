const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
require("dotenv").config("config.env");
const userRoute = require("./routes/userRoute");
const friendsRoute = require("./routes/friendsRoute");
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(userRoute);
app.use(friendsRoute);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
