import ChatConversation from '../models/ChatConversation.js';
import ChatMessage from '../models/ChatMessage.js';
import { processChatMessage } from '../services/chatbot/chatService.js';
import { memoryStore } from '../config/memoryStore.js';

// @desc Send chat message to AI assistant
export const sendMessage = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const { conversationId, messageText, quickAction, resumeId, jdId, analysisId } = req.body;

    let conversation;
    if (conversationId) {
      if (memoryStore.isMongoDBConnected) {
        conversation = await ChatConversation.findById(conversationId);
      } else {
        conversation = await memoryStore.getConversationById(conversationId);
      }
    }

    if (!conversation) {
      const convData = {
        user: userId,
        title: messageText ? messageText.substring(0, 30) : (quickAction || 'ResumeAI Chat'),
        currentResume: resumeId || null,
        currentJd: jdId || null,
        currentAnalysis: analysisId || null
      };

      if (memoryStore.isMongoDBConnected) {
        conversation = await ChatConversation.create(convData);
      } else {
        conversation = await memoryStore.createConversation(convData);
      }
    }

    // Save user message
    const userMsgData = {
      conversation: conversation._id,
      sender: 'user',
      text: messageText || quickAction || '',
      quickAction: quickAction || null
    };

    let userMsg;
    if (memoryStore.isMongoDBConnected) {
      userMsg = await ChatMessage.create(userMsgData);
    } else {
      userMsg = await memoryStore.createChatMessage(userMsgData);
    }

    // Get previous chat history
    let historyMessages = [];
    if (memoryStore.isMongoDBConnected) {
      historyMessages = await ChatMessage.find({ conversation: conversation._id }).sort({ createdAt: 1 }).limit(20);
    } else {
      historyMessages = await memoryStore.getMessagesByConversation(conversation._id);
    }

    // Process AI message via platform-independent chatService
    const aiResponseText = await processChatMessage({
      conversationId: conversation._id,
      userId,
      messageText: messageText || '',
      history: historyMessages,
      quickAction
    });

    // Save assistant message
    const assistantMsgData = {
      conversation: conversation._id,
      sender: 'assistant',
      text: aiResponseText,
      quickAction: quickAction || null
    };

    let assistantMsg;
    if (memoryStore.isMongoDBConnected) {
      assistantMsg = await ChatMessage.create(assistantMsgData);
    } else {
      assistantMsg = await memoryStore.createChatMessage(assistantMsgData);
    }

    return res.status(200).json({
      success: true,
      data: {
        conversationId: conversation._id,
        userMessage: userMsg,
        assistantMessage: assistantMsg
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc Start new conversation
export const startNewConversation = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const { resumeId, jdId, analysisId } = req.body;

    const convData = {
      user: userId,
      title: 'New Conversation',
      currentResume: resumeId || null,
      currentJd: jdId || null,
      currentAnalysis: analysisId || null
    };

    let conversation;
    if (memoryStore.isMongoDBConnected) {
      conversation = await ChatConversation.create(convData);
    } else {
      conversation = await memoryStore.createConversation(convData);
    }

    return res.status(201).json({ success: true, data: { conversation } });
  } catch (error) {
    next(error);
  }
};

// @desc Get chat history
export const getChatHistory = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const { conversationId } = req.query;

    let conversation;
    let messages = [];

    if (memoryStore.isMongoDBConnected) {
      if (conversationId) {
        conversation = await ChatConversation.findById(conversationId);
      } else {
        conversation = await ChatConversation.findOne({ user: userId }).sort({ updatedAt: -1 });
      }
      if (conversation) {
        messages = await ChatMessage.find({ conversation: conversation._id }).sort({ createdAt: 1 });
      }
    } else {
      if (conversationId) {
        conversation = await memoryStore.getConversationById(conversationId);
      } else {
        conversation = await memoryStore.getLatestConversation(userId);
      }
      if (conversation) {
        messages = await memoryStore.getMessagesByConversation(conversation._id);
      }
    }

    return res.status(200).json({
      success: true,
      data: { conversation: conversation || null, messages }
    });
  } catch (error) {
    next(error);
  }
};

// @desc Clear chat history
export const clearChatHistory = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    if (memoryStore.isMongoDBConnected) {
      const conversations = await ChatConversation.find({ user: userId });
      const convIds = conversations.map(c => c._id);
      await ChatMessage.deleteMany({ conversation: { $in: convIds } });
      await ChatConversation.deleteMany({ user: userId });
    } else {
      await memoryStore.clearUserChatHistory(userId);
    }

    return res.status(200).json({ success: true, message: 'Chat history cleared successfully.' });
  } catch (error) {
    next(error);
  }
};
