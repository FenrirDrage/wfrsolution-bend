const { Event } = require("../models/events");
const { User } = require("../models/users");

(exports.getAllEvents = async (req, res) => {
  console.log(req.loggedInUser);
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}),
  // Get a specific event by ID
  (exports.getEventById = async (req, res) => {
    const eventId = req.params.id;

    try {
      const event = await Event.findById(eventId);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.json(event);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }),
  // Get a specific event by Name
  (exports.getEventByName = async (req, res) => {
    const eventName = req.params.name;

    try {
      const event = await Event.findOne({ name: eventName });
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.json(event);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

// Create a new event
exports.createEvent = async (req, res) => {
  const { name, date, hour_b, hour_e, local, operator, material, image, obs } =
    req.body;

  try {
    // Check if an event with the same name already exists
    const existingEvent = await Event.findOne({ name });

    if (existingEvent) {
      return res
        .status(400)
        .json({ message: "Event with the same name already exists" });
    }

    // If no matching event is found, create a new one
    const event = new Event({
      name,
      date,
      hour_b,
      hour_e,
      local,
      operator,
      material,
      image,
      obs,
    });

    const newEvent = await event.save();

    // Find users associated with this event
    const users = await User.find({ _id: { $in: userIds } });

    // Update users to include this event
    await User.updateMany(
      { _id: { $in: userIds } },
      { $addToSet: { events: newEvent._id } }
    );

    // Prepare notification payload
    const payload = {
      notification: {
        title: "New Event",
        body: `A new event "${name}" has been created.`,
      },
    };

    // Send notifications to users
    users.forEach(async (user) => {
      if (user.pushToken) {
        await admin.messaging().sendToDevice(user.pushToken, payload);
      }
    });

    res.status(201).json(newEvent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update an event by ID
(exports.updateEvent = async (req, res) => {
  const eventId = req.params.id;
  const updates = req.body;

  try {
    const updatedEvent = await Event.findByIdAndUpdate(eventId, updates, {
      new: true,
    });
    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json(updatedEvent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}),
  // Delete an event by ID
  (exports.deleteEvent = async (req, res) => {
    const eventId = req.params.id;

    try {
      const deletedEvent = await Event.findByIdAndDelete(eventId);
      if (!deletedEvent) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.json({ message: "Event deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

// Delete an event by Name
exports.deleteEventByName = async (req, res) => {
  const eventName = req.params.name;

  try {
    const deletedEvent = await Event.findOneAndDelete(eventName);
    if (!deletedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
