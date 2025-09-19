import Notification from "../models/Notification.js";
import nodemailer from "nodemailer";

// Create new notification
export const createNotification = async (req, res) => {
  try {
    const { userId, type, message, sendEmail = false } = req.body;

    const notification = new Notification({
      user: userId,
      type,
      message,
    });
    await notification.save();

    // Emit real-time event
    req.io.to(userId.toString()).emit("newNotification", notification);

    // Optionally send email
    if (sendEmail) {
      await sendEmailNotification(userId, message);
    }

    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: "Error creating notification", error });
  }
};

// Get all notifications for logged-in user
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notifications", error });
  }
};

// Mark notification as read
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndUpdate(
      id,
      { read: true },
      { new: true }
    );
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: "Error updating notification", error });
  }
};

// Email helper
const sendEmailNotification = async (userId, message) => {
  // Replace with actual user lookup
  const userEmail = "test@example.com"; 

  const transporter = nodemailer.createTransport({
    service: "gmail", // Or SMTP provider
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: "New Notification",
    text: message,
  });
};
