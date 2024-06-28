const mongoose = require("mongoose");
const { type } = require("os");

//Define a schema for image
const imageSchema = new mongoose.Schema({
  filename: {
    type: String,
    require: true,
  },
  contentType: {
    type: String,
    require: true,
  },
  imageBuffer: {
    type: Buffer,
    require: true,
  },
});

const Image = mongoose.model("Image", imageSchema);

module.exports = { Image };
