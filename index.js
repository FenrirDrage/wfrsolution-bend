//mongodb+srv://smoreiralves:sY85QIaLrTBBG3gl@wfrsolutions.npvdceq.mongodb.net/

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
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(port, (err) => {
      if (err) {
        if (err.code === "EADDRINUSE") {
          console.error(`Port ${port} is already in use`);
        } else {
          console.error(`Error starting server: ${err.message}`);
        }
        process.exit(1);
      } else {
        console.log(`Server started on port ${port}`);
      }
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

// Use the routes
app.use(express.json());
app.use("/", auth, routes);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
