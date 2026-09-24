import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../context/ChatContext';
import API from '../services/api';
import { 
  Bot, 
  X, 
  Send, 
  Trash2, 
  RotateCcw, 
  Sparkles, 
  Loader2, 
  BookOpen, 
  Target, 
  CheckCircle2, 
  FileText,
  HelpCircle,
  Zap,
  Minimize2
} from 'lucide-react';

const QUICK_BUTTONS = [
  { label: 'Explain My ATS Score', icon: Target },
  { label: 'Show Missing Skills', icon: Zap },
  { label: 'Improve My Resume', icon: Sparkles },
  { label: 'Recommend Courses', icon: BookOpen },
  { label: 'Explain Job Description', icon: FileText },
  { label: 'Show Skill Match', icon: CheckCircle2 },
  { label: 'Prepare Interview Questions', icon: HelpCircle },
];

const ChatbotWidget = () => {
  const { isChatOpen, toggleChat, closeChat, activeAnalysis } = useChat();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isChatOpen) {
      fetchHistory();
    }
  }, [isChatOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const fetchHistory = async () => {
    try {
      const res = await API.get('/chat/history');
      if (res.data.data.conversation) {
        setConversationId(res.data.data.conversation._id);
        setMessages(res.data.data.messages || []);
      } else {
        // Initial welcome message
        setMessages([
          {
            _id: 'welcome',
            sender: 'assistant',
            text: `👋 **Hello! I am your ResumeAI Assistant.**\n\nI can explain your ATS score, discover missing skills, suggest learning topics, and generate interview questions based on your uploaded resume & Job Description.\n\nClick any quick button below or ask a question!`
          }
        ]);
      }
    } catch (err) {
      console.error('Failed to load chat history:', err.message);
    }
  };

  const handleSendMessage = async (textToSend = input, quickAction = null) => {
    if (!textToSend.trim() && !quickAction) return;

    const userText = textToSend || quickAction;

    // Optimistic user message render
    const userMsg = {
      _id: `user_${Date.now()}`,
      sender: 'user',
      text: userText,
      createdAt: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    if (!quickAction) setInput('');
    setLoading(true);

    try {
      const res = await API.post('/chat/message', {
        conversationId,
        messageText: quickAction ? '' : userText,
        quickAction: quickAction || null,
        analysisId: activeAnalysis?._id || null
      });

      const data = res.data.data;
      setConversationId(data.conversationId);

      setMessages(prev => [...prev, data.assistantMessage]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          _id: `err_${Date.now()}`,
          sender: 'assistant',
          text: `⚠️ Error: ${err.message}. Please check backend connection.`
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (!window.confirm('Clear all conversation history?')) return;
    try {
      await API.delete('/chat/history');
      setConversationId(null);
      setMessages([
        {
          _id: 'welcome_new',
          sender: 'assistant',
          text: `🧹 Conversation cleared. How can I help you today?`
        }
      ]);
    } catch (err) {
      console.error('Failed to clear history:', err.message);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isChatOpen && (
        <button
          onClick={toggleChat}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-semibold rounded-full shadow-2xl shadow-brand-500/40 transform hover:scale-105 transition-all group"
        >
          <Bot className="w-6 h-6 text-white group-hover:rotate-12 transition-transform" />
          <span className="text-sm font-semibold">ResumeAI Assistant</span>
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
          </span>
        </button>
      )}

      {/* Chat Drawer / Modal Container */}
      {isChatOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[440px] h-[580px] max-h-[85vh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          
          {/* Header */}
          <div className="px-4 py-3.5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-brand-600/30 border border-brand-500/40 text-brand-400 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white leading-tight">ResumeAI Assistant</h3>
                <p className="text-[11px] text-slate-400">
                  {activeAnalysis ? `Context: Score ${activeAnalysis.atsScore}/100` : 'Context Aware Recruitment AI'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClearHistory}
                title="Clear History"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={closeChat}
                title="Minimize Chat"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-950/50">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg._id || Math.random()}
                  className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? 'bg-brand-600 text-white rounded-br-none shadow-md shadow-brand-600/20'
                        : 'bg-slate-800/90 text-slate-200 border border-slate-700/60 rounded-bl-none shadow-sm'
                    }`}
                  >
                    <div className="whitespace-pre-wrap font-sans">
                      {msg.text}
                    </div>
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-800/90 border border-slate-700/60 rounded-2xl rounded-bl-none px-4 py-3 text-slate-300 text-xs flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-brand-400 animate-spin" />
                  <span>Assistant is analyzing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Action Pills */}
          <div className="px-3 py-2 bg-slate-900 border-t border-slate-800/80 overflow-x-auto flex gap-1.5 no-scrollbar shrink-0">
            {QUICK_BUTTONS.map((btn) => {
              const Icon = btn.icon;
              return (
                <button
                  key={btn.label}
                  onClick={() => handleSendMessage('', btn.label)}
                  disabled={loading}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-800 hover:bg-brand-900/60 text-slate-300 hover:text-brand-300 border border-slate-700/60 transition-all whitespace-nowrap shrink-0 disabled:opacity-50"
                >
                  <Icon className="w-3 h-3 text-brand-400" />
                  <span>{btn.label}</span>
                </button>
              );
            })}
          </div>

          {/* Message Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask anything about resume, JD or ATS score..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2.5 bg-brand-600 hover:bg-brand-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-xl shadow-md transition-all shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </>
  );
};

export default ChatbotWidget;
