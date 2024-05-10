// Define a schema for users
const userSchema = new mongoose.Schema(
  {
    name: {
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
    photo: {
      type: String,
    },
    // Add other fields as needed
  },
  { collection: "Users" }
);

const User = mongoose.model("Users", userSchema);

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
      hour_e:{
        type: String,
      },
      local: {
        require: true,
        type: String,
        description: String,
      },
      operator:{
        require:true,
        type: Array,
      },
      material:{
        require: true,
        type: Array,
      },
      quantdd:{
        require: true,
        type: Number,
      },
      obs:{
        type: String,
      }
    },
    { collection: "Event" }
  );
  
  const Event = mongoose.model("Event", eventSchema);

  
  module.exports = {
    User,
    Event,
  }