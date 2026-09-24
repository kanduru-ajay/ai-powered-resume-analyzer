import React, { createContext, useState, useContext } from 'react';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeAnalysis, setActiveAnalysis] = useState(null);
  const [activeResume, setActiveResume] = useState(null);
  const [activeJd, setActiveJd] = useState(null);

  const toggleChat = () => setIsChatOpen(prev => !prev);
  const openChat = () => setIsChatOpen(true);
  const closeChat = () => setIsChatOpen(false);

  return (
    <ChatContext.Provider value={{
      isChatOpen,
      toggleChat,
      openChat,
      closeChat,
      activeAnalysis,
      setActiveAnalysis,
      activeResume,
      setActiveResume,
      activeJd,
      setActiveJd
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
