//mongodb+srv://smoreiralves:sY85QIaLrTBBG3gl@wfrsolutions.npvdceq.mongodb.net/

const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes/routes"); // Import routes
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
  let exceptions = ["/login", "/register"];
  if (exceptions.indexOf(req.url) >= 0) {
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
  "mongodb+srv://smoreiralves:sY85QIaLrTBBG3gl@wfrsolutions.npvdceq.mongodb.net/WFRsolution?retryWrites=true&w=majority"
);

// Use the routes
app.use(express.json());
app.use("/", auth, routes);

app.listen(5500, () => {
  console.log("Server started on port 5500");
});
