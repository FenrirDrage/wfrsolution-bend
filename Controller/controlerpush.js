const admin = require("firebase-admin");
const User = require("../models/users");

exports.sendNotification = async (req, res) => {
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
};
