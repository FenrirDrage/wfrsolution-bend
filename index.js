const express = require("express");
const mongoose = require("mongoose");
const routes = require("./Routes/routes"); // Import routes
const utilities = require("./utilities/utilities"); // Import utilities
const cors = require("cors");
const app = express();
require("dotenv").config();

const mongodb = process.env.MONGO_URI;
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: "*",
  })
);

//auth
const auth = function (req, res, next) {
  const exceptions = ["/login", "/register"];

  if (exceptions.includes(req.url)) {
    next();
  } else {
    utilities.validateToken(req.headers.authorization, (result, username) => {
      if (result) {
        req.loggedInUser = username;
        next();
      } else {
        res.status(401).send("Invalid Token");
      }
    });
  }
};

// MongoDB connection
mongoose.connect(mongodb);

// Use the routes
app.use(express.json());
app.use("/", auth, routes);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
