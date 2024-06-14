const { update } = require("moongose/models/user_model.js");
const { User } = require("../models/models.js"); // Import your User model
const { events } = require("../models/models.js");
const utilities = require("../utilities/utilities.js");
const bcrypt = require("bcrypt");
const { validateToken } = require("../utilities/utilities.js");

//user login
exports.login = (req, res) => {
  User.find({ email: req.body.username })
    .then((user) => {
      if (user.length > 0) {
        bcrypt
          .compare(req.body.password, user[0].password)
          .then(function (result) {
            if (result) {
              utilities.generateToken({ user: req.body.username }, (token) => {
                res.status(200).json(token);
              });
            } else {
              res.status(401).send("Not Authorized");
            }
          });
      } else {
        res.status(401).send("Not Authorized");
      }
    })
    .catch((err) => {
      res.status(401).send("Not Authorized");
    });
};

//user register
exports.register = (req, res) => {
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(req.body.password, salt, function (err, hash) {
      const userToCreate = new User({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: hash,
      });

      User.find({
        $or: [{ email: req.body.email }, { username: req.body.username }],
      })
        .then((user) => {
          if (user.length > 0) {
            res.status(406).send("Duplicated User");
          } else {
            userToCreate
              .save()
              .then(() => {
                res.status(200).send("Registered User");
              })
              .catch((err) => {
                res.status(400).send(err);
              });
          }
        })
        .catch((err) => {
          res.status(400).send(err);
        });
    });
  });
};

// Rota para obter informações do user autenticado
exports.getUserAuthenticated = async (req, res) => {
  const token = req.headers.authorization;

  validateToken(token, async (isValid, userEmail) => {
    if (!isValid) {
      return res.status(401).json({ message: "Invalid token" });
    }

    try {
      const user = await User.findOne({ email: userEmail });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user);
    } catch (err) {
      res.status(500).json({ message: err.message });
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
        email: req.loggedInUser,
      });

      const updatedUser = await User.findOneAndUpdate(
        { email: req.loggedInUser },
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
