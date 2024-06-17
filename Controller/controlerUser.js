const { update } = require("moongose/models/user_model.js");
const { User } = require("../models/models.js"); // Import your User model
const { events } = require("../models/models.js");
const utilities = require("../utilities/utilities.js");
const bcrypt = require("bcrypt");
const { validateToken } = require("../utilities/utilities.js");

//user login
exports.login = (req, res) => {
  const { username, password } = req.body;

  User.findOne({ username: username })
      .then(user => {
          if (!user) {
              return res.status(401).json({ message: "Not Authorized" });
          }

          bcrypt.compare(password, user.password)
              .then(result => {
                  if (result) {
                      utilities.generateToken({ user: username }, (token) => {
                          res.status(200).json({ token });
                      });
                  } else {
                      res.status(401).json({ message: "lol nope" });
                  }
              })
              .catch(err => {
                  console.error("Error comparing passwords:", err);
                  res.status(500).json({ message: "Internal Server Error" });
              });
      })
      .catch(err => {
          console.error("Error finding user:", err);
          res.status(500).json({ message: "Internal Server Error" });
      });
};

//user register
exports.register = async (req, res) => {
  try {
      const { name, username, email, password } = req.body;

      // Check if the user already exists
      const existingUser = await User.findOne({ email: email });
      if (existingUser) {
          return res.status(406).json({ message: "Duplicated User" });
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create a new user
      const userToCreate = new User({
          name,
          username,
          email,
          password: hashedPassword,
      });

      // Save the user to the database
      await userToCreate.save();
      res.status(200).json({ message: "Registered User", hashedPassword: hashedPassword });
  } catch (err) {
      console.error("Error registering user:", err);
      res.status(500).json({ message: "Internal Server Error" });
  }
};

// Route to get authenticated user information
exports.getUserAuthenticated = async (req, res) => {
    const token = req.headers.authorization;

    validateToken(token, async (isValid, userUsername) => {
        if (!isValid) {
            return res.status(401).json({ message: "Invalid token" });
        }

        try {
            const user = await User.findOne({ username: userUsername });

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            res.json(user);
        } catch (err) {
            console.error("Error retrieving user:", err);
            res.status(500).json({ message: "Internal Server Error" });
        }
    });
};


// Get all users
(exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}),
  // Get a specific user by ID
  (exports.getUserById = async (req, res) => {
    const userId = req.params.id;

    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }),
  // Create a new user
  (exports.createUser = async (req, res) => {
    const { name, username, email, photo } = req.body;
    const user = new User({
      name,
      username,
      email,
      password,
      usertype,
      photo,
    });

    try {
      const newUser = await user.save();
      res.status(201).json(newUser);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }),
  // Update a user by ID
  (exports.updateUser = async (req, res) => {
    const updates = req.body;

    try {
      const old_info = await User.findOne({
        username: req.loggedInUser,
      });

      const updatedUser = await User.findOneAndUpdate(
        { username: req.loggedInUser },
        {
          name: updates.name ? updates.name : old_info.name,
          photo: updates.photo ? updates.photo : old_info.photo,
          password: updates.password ? updates.password : old_info.password,
        }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      } else {
        res.status(200).send("User updated successfully");
      }
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

// Delete a user by ID
exports.deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
