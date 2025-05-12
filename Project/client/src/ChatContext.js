
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const ChatContext = createContext();

export const useChatContext = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [activeUsers, setActiveUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState({});
  const [loading, setLoading] = useState(true);

  const [chatRooms, setChatRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/me`);
        setCurrentUser({
          userId: res.data._id,
          name: res.data.name,
          role: res.data.role
        });
      } catch (err) {
        console.error("Error fetching current user", err);
      }
    };
  
    fetchUser();
  }, []);

  const fetchUserChatRooms = useCallback(async (userId) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/chat/user-chatrooms/${userId}`);
      if (response.data.success) {
        setChatRooms(response.data.chatRooms);
      }
    } catch (error) {
      console.error("Error fetching chat rooms:", error);
    }
  }, []);

  // ✅ THEN call it in useEffect below
  useEffect(() => {
    if (!currentUser?.userId) return;
    fetchUserChatRooms(currentUser.userId, 'student');
    console.log('Fetching chatrooms for', currentUser.userId); // ✅
  }, [currentUser, fetchUserChatRooms]);


  useEffect(() => {
    const newSocket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000');
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket || !currentUser) return;

    socket.emit('join', currentUser);

    axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/chat/conversations/${currentUser.userId}`)
      .then(response => {
        setConversations(response.data.conversations);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching conversations:", error);
        setLoading(false);
      });
  }, [socket, currentUser]);

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
          name: message.senderName || 'Unknown User',
          lastMessage: message.content,
          timestamp: message.timestamp
        };

        return [...prevConversations, newConversation];
      });
    });

    socket.on('userTyping', ({ isTyping: typing, from, senderName }) => {
      setIsTyping((prev) => ({ ...prev, [from]: typing ? senderName : false }));
    });

    socket.on('roomMessage', (message) => {
      if (message.roomId === currentRoom) {
        setMessages(prev => [...prev, message]);
      }
    });

    socket.on('roomUsers', (users) => {
      // Optional: handle room user updates here
    });

    return () => {
      socket.off('activeUsers');
      socket.off('privateMessage');
      socket.off('userTyping');
      socket.off('roomMessage');
      socket.off('roomUsers');
    };
  }, [socket, currentUser, currentRoom]);

  const sendMessage = useCallback((content, to) => {
    if (!socket || !currentUser) return;

    const messageData = {
      content,
      to,
      from: currentUser.userId,
      senderName: currentUser.name,
      timestamp: new Date().toISOString()
    };

    socket.emit('privateMessage', messageData);
    setMessages(prev => [...prev, messageData]);
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

    axios.get(`${process.env.REACT_APP_BASE_API_URL}/chat/messages/${currentUser.userId}/${recipientId}`)
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

  const createRoom = useCallback(async (roomData) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/chat/rooms`, roomData);
      setChatRooms(prev => [...prev, response.data]);
      return response.data;
    } catch (error) {
      console.error("Error creating room:", error);
      throw error;
    }
  }, []);

  const joinRoom = useCallback((roomId) => {
    if (!socket) return;
    socket.emit('joinRoom', roomId);
    setCurrentRoom(roomId);
  }, [socket]);

  const leaveRoom = useCallback((roomId) => {
    if (!socket) return;
    socket.emit('leaveRoom', roomId);
    setCurrentRoom(null);
  }, [socket]);

  // const fetchUserChatRooms = useCallback(async (userId, userType) => {
  //   try {
  //     const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/chat/rooms/${userId}?type=${userType}`);
  //     setChatRooms(response.data);
  //   } catch (error) {
  //     console.error("Error fetching chat rooms:", error);
  //   }
  // }, []);

  const value = {
    socket,
    activeUsers,
    currentUser,
    selectedConversation,
    conversations,
    messages,
    isTyping,
    loading,
    sendMessage,
    sendTypingIndicator,
    selectConversation,
    chatRooms,
    currentRoom,
    createRoom,
    joinRoom,
    leaveRoom,
    fetchUserChatRooms
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};