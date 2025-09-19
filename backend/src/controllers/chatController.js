import Chat from "../models/Chat.js";

// Get all chats between two users
export const getChats = async (req, res) => {
  try {
    const { userId } = req.params; // receiverId
    const chats = await Chat.find({
      $or: [
        { sender: req.user._id, receiver: userId },
        { sender: userId, receiver: req.user._id }
      ]
    }).populate("sender receiver", "name role");
    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: "Error fetching chats", error });
  }
};

// Send a new message
export const sendMessage = async (req, res) => {
  try {
    const { receiver, message } = req.body;
    const chat = new Chat({
      sender: req.user._id,
      receiver,
      message
    });
    await chat.save();

    // emit event for real-time
    req.io.to(receiver.toString()).emit("newMessage", chat);

    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ message: "Error sending message", error });
  }
};
