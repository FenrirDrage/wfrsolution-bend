//mongodb+srv://smoreiralves:sY85QIaLrTBBG3gl@wfrsolutions.npvdceq.mongodb.net/

const express = require("express");
const mongoose = require("mongoose");
const routes = require("./Routes/routes"); // Import routes
const utilities = require("./utilities/utilities"); // Import utilities
const cors = require("cors");
const app = express();

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

// Connect to MongoDB
mongoose.connect(
  "mongodb+srv://operatorsolution:v4fh6C0jrPJNbGAm@WFRSolutions.npvdceq.mongodb.net/"
);

// Use the routes
app.use(express.json());
app.use("/", auth, routes);

app.listen(5500, () => {
  console.log("Server started on port 16082");
});
