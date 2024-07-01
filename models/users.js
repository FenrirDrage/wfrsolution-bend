const mongoose = require("mongoose");
const { type } = require("os");

// Define a schema for users
const userSchema = new mongoose.Schema(
  {
    name: {
      require: true,
      type: String,
    },
    username: {
      require: true,
      type: String,
    },
    email: {
      type: String,
      require: true,
      validate: {
        validator: (value) => {
          const re =
            /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
          return value.match(re);
        },
        message: "Please enter a valid email address.",
      },
    },
    password: {
      type: String,
      require: true,
      validate: {
        validator: (value) => {
          return value.length > 7;
        },
        message: "Please enter a longer password. At least 8 char.",
      },
    },
    usertype: {
      require: true,
      type: String,
      default: "user",
    },
    image: {
      type: String,
    },
    pushToken: {
      type: String,
    },
    events: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
      },
    ], // Field to store subscribed events
    // Add other fields as needed
  },
  { collection: "Users" }
);

const User = mongoose.model("Users", userSchema);

module.exports = { User };
