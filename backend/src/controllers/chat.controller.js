import Conversation from '../models/conversation.model.js'
import Message from '../models/message.model.js'

export const createConversation = async (req, res) => {
    
    try {
    const senderId = req.user.id;
    const { userId } = req.body;

    // basic validation:
    if (!userId) {
        return res.status(400).json({
          success: false,
          message: "receiverId is required",
        });
    }

    // check if receiver exists:
    if (senderId === userId) {
        return res.status(400).json({
          success: false,
          message: "You cannot message yourself",
        });
    }

    // Check if conversation already exists
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, userId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, userId],
      });
    }

    res.status(200).json({
      success: true,
      conversation,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: err.message });
  }
};


export const sendMessage = async (req, res) => {
  const senderId = req.user.id;
  const { conversationId, text } = req.body;

  if (!text || !conversationId) {
    return res.status(400).json({
      success: false,
      message: "conversationId and text are required",
    });
  }

  try {
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    // Authorization check
    if (!conversation.participants.includes(senderId)) {
      return res.status(403).json({
        success: false,
        message: "Not allowed to send message in this conversation",
      });
    }

    const message = await Message.create({
      conversationId,
      senderId,
      text,
    });

    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: message._id,
    });

    res.status(201).json({
      success: true,
      message,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getMessages = async (req, res) => {
  const { conversationId } = req.params;
  const userId = req.user.id;

  try {
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    if (!conversation.participants.includes(userId)) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }
    
    const messages = await Message.find({ conversationId })
      .populate("senderId", "username profilePic")
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      messages,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

