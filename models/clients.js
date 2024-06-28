const mongoose = require("mongoose");
const { type } = require("os");

//Define a schema for clients
const clientsSchema = new mongoose.Schema(
  {
    name: {
      require: true,
      type: String,
    },
    cAdress: {
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
    telf: {
      type: String,
      require: true,
    },
    nif: {
      require: true,
      type: String,
    },
    // Add other fields as needed
  },
  { collection: "Clients" }
);

const Clients = mongoose.model("Clients", clientsSchema);

module.exports = { Clients };
