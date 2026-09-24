import mongoose from 'mongoose';

const chatConversationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: { type: String, default: 'New Conversation' },
  currentResume: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume', default: null },
  currentJd: { type: mongoose.Schema.Types.ObjectId, ref: 'JobDescription', default: null },
  currentAnalysis: { type: mongoose.Schema.Types.ObjectId, ref: 'Analysis', default: null },
  telegramChatId: { type: String, default: null }
}, { timestamps: true });

const ChatConversation = mongoose.models.ChatConversation || mongoose.model('ChatConversation', chatConversationSchema);
export default ChatConversation;
