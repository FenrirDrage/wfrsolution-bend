const express = require("express");
const router = express.Router();
const { User } = require("../models/users"); // Import your models
const EventController = require("../Controller/controlerEvent"); // Import controller events
const UserController = require("../Controller/controlerUser"); // Import controller users
const ClientController = require("../Controller/controlerClients"); // Import controller clients
const ImageController = require("../Controller/controlerImage");
const { validationResult, body } = require("express-validator");
const { sendNotification } = require("../Controller/controlerpush");
const { request } = require("http");

//route to login
router.post("/login", function (req, res) {
  UserController.login(req, res);
});

//route to register
router.post(
  "/register",
  [
    body("name").notEmpty().escape(),
    body("username").notEmpty().escape(),
    body("email").notEmpty().escape(),
    body("password").notEmpty().escape(),
  ],
  function (req, res) {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      UserController.register(req, res);
    } else {
      res.status(404).json({ errors: errors.array() });
    }
  }
);

// Route to add a new user
router.post("/users", async (req, res) => {
  const { name, username, email, photo } = req.body;
  const user = new User({ name, username, email, photo });

  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Route for send-not
router.post("/send-notification", sendNotification);

// Routes for users
router.get("/users/authenticated", UserController.getUserAuthenticated);
router.get("/users", UserController.getAllUsers);
router.get("/users", UserController.getUserById);
router.post("/users", UserController.createUser);
router.put("/users", UserController.updateUser);
router.delete("/users", UserController.deleteUser);
// Rota para pesquisar eventos nos quais o usuário está inscrito
//router.get("/users/:id/events", UserController.getEventsForUser);

// Routes for events
router.get("/events", EventController.getAllEvents);
router.get("/events/:name", EventController.getEventByName);
router.get("/events/id/:id", EventController.getEventById); // Adjusted path
router.post("/events", EventController.createEvent);
router.put("/events/:id", EventController.updateEvent);
router.delete("/events/id/:id", EventController.deleteEvent); // Adjusted path
router.delete("/events/name/:name", EventController.deleteEventByName); // Adjusted path

// Rotas CRUD para clientes
router.post("/clients", ClientController.createClient);
router.get("/clients", ClientController.getClients);
router.get("/clients/:id", ClientController.getClientById);
router.put("/clients/:id", ClientController.updateClient);
router.delete("/clients/:id", ClientController.deleteClient);

// Rota CRUD para Imagens
// Rota para upload de uma única imagem
router.post("/uploadSingle", ImageController.uploadSingleImage);
// Rota para upload de múltiplas imagens
router.post("/uploadMultiple", ImageController.uploadImages);
router.get("/images", ImageController.getAllImages);
router.get("/image/:id", ImageController.readImage);
router.delete("/image/:id", ImageController.deleteImage);

module.exports = router;
