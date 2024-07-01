const mongoose = require("mongoose");
const { type } = require("os");

// Define a schema for events
const eventSchema = new mongoose.Schema(
  {
    name: {
      require: true,
      type: String,
      unique: true,
    },
    date: {
      require: true,
      type: String,
    },
    hour_b: {
      require: true,
      type: String,
    },
    hour_e: {
      type: String,
    },
    local: {
      require: true,
      type: String,
      description: String,
    },
    operator: {
      require: true,
      type: Array,
    },
    material: {
      require: true,
      type: Array,
    },
    image: {
      type: String,
    },
    obs: {
      type: String,
    },
  },
  { collection: "Event" }
);

const Event = mongoose.model("Event", eventSchema);

module.exports = { Event };
