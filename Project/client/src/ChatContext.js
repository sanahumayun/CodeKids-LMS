// client/src/context/ChatContext.js
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const ChatContext = createContext();

export const useChatContext = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [activeUsers, setActiveUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const newSocket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000');
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('activeUsers', (users) => {
      setActiveUsers(users);
    });

    socket.on('privateMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
      
      setConversations((prevConversations) => {
        const existingConversationIndex = prevConversations.findIndex(
          (conv) => conv.userId === message.from || conv.userId === message.to
        );
        
        if (existingConversationIndex >= 0) {
          const updatedConversations = [...prevConversations];
          updatedConversations[existingConversationIndex] = {
            ...updatedConversations[existingConversationIndex],
            lastMessage: message.content,
            timestamp: message.timestamp
          };
          return updatedConversations;
        }
        
        const otherUser = message.from === currentUser?.userId ? message.to : message.from;
        const newConversation = {
          userId: otherUser,
          name: message.senderName,
          lastMessage: message.content,
          timestamp: message.timestamp
        };
        
        return [...prevConversations, newConversation];
      });
    });

    socket.on('userTyping', ({ isTyping: typing, from, senderName }) => {
      setIsTyping((prev) => ({ ...prev, [from]: typing ? senderName : false }));
    });

    return () => {
      socket.off('activeUsers');
      socket.off('privateMessage');
      socket.off('userTyping');
    };
  }, [socket, currentUser]);

  const joinChat = useCallback((user) => {
    if (!socket || !user) return;
    
    setCurrentUser(user);
    socket.emit('join', user);

    axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/chat/conversations/${user.userId}`)
      .then(response => {
        setConversations(response.data.conversations);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching conversations:", error);
        setLoading(false);
      });
  }, [socket]);

  const sendMessage = useCallback((content, to) => {
    if (!socket || !currentUser) return;
    
    const messageData = {
      content,
      to,
      from: currentUser.userId,
      senderName: currentUser.name
    };
    
    socket.emit('privateMessage', messageData);
  }, [socket, currentUser]);

  const sendTypingIndicator = useCallback((isTyping, to) => {
    if (!socket || !currentUser) return;
    
    socket.emit('typing', {
      isTyping,
      to,
      from: currentUser.userId,
      senderName: currentUser.name
    });
  }, [socket, currentUser]);

  const loadMessages = useCallback((recipientId) => {
    if (!currentUser) return;
    
    setLoading(true);
    
    axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/chat/messages/${currentUser.userId}/${recipientId}`)
      .then(response => {
        setMessages(response.data.messages);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching messages:", error);
        setLoading(false);
      });
  }, [currentUser]);

  const selectConversation = useCallback((conversation) => {
    setSelectedConversation(conversation);
    loadMessages(conversation.userId);
  }, [loadMessages]);

  const value = {
    socket,
    activeUsers,
    currentUser,
    selectedConversation,
    conversations,
    messages,
    isTyping,
    loading,
    joinChat,
    sendMessage,
    sendTypingIndicator,
    selectConversation
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};