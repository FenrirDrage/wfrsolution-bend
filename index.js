const express = require("express");
const mongoose = require("mongoose");
const admin = require("firebase-admin");
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

// Initialize Firebase Admin SDK
const serviceAccount = require("./config/push-not-key.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

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
mongoose.connect(mongodb, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Use the routes
app.use(express.json());
app.use("/", auth, routes);

// Add a route for sending notifications
app.post("/send-notification", async (req, res) => {
  const { userId, message } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user || !user.pushToken) {
      return res.status(404).send("User not found or push token missing");
    }

    const payload = {
      notification: {
        title: "New Notification",
        body: message,
      },
    };

    await admin.messaging().sendToDevice(user.pushToken, payload);

    res.status(200).send("Notification sent");
  } catch (error) {
    res.status(500).send("Error sending notification");
  }
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
