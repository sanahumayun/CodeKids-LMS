// // client/src/components/ChatWindow.js
// import React, { useState, useEffect, useRef } from 'react';
// import { useChatContext } from '../context/ChatContext';
// import './ChatWindow.css';

// const ChatWindow = ({ onBackClick, showBackButton }) => {
//   const { 
//     currentUser, 
//     selectedConversation, 
//     messages, 
//     sendMessage, 
//     sendTypingIndicator,
//     isTyping 
//   } = useChatContext();
  
//   const [message, setMessage] = useState('');
//   const [typingTimeout, setTypingTimeout] = useState(null);
//   const messagesEndRef = useRef(null);

//   // Scroll to bottom of messages on new message
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   // Handle sending message
//   const handleSendMessage = (e) => {
//     e.preventDefault();
    
//     if (!message.trim() || !selectedConversation) return;
    
//     sendMessage(message, selectedConversation.userId);
//     setMessage('');
    
//     // Clear typing indicator
//     sendTypingIndicator(false, selectedConversation.userId);
//   };

//   // Handle typing indicator
//   const handleTyping = (e) => {
//     setMessage(e.target.value);
    
//     if (!selectedConversation) return;
    
//     // Clear existing timeout
//     if (typingTimeout) {
//       clearTimeout(typingTimeout);
//     }
    
//     // Send typing indicator
//     sendTypingIndicator(true, selectedConversation.userId);
    
//     // Set timeout to clear typing indicator after 2 seconds of no typing
//     const timeout = setTimeout(() => {
//       sendTypingIndicator(false, selectedConversation.userId);
//     }, 2000);
    
//     setTypingTimeout(timeout);
//   };

//   // Format timestamp
//   const formatTime = (timestamp) => {
//     const date = new Date(timestamp);
//     return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//   };

//   if (!selectedConversation) {
//     return (
//       <div className="empty-chat-window">
//         <div className="empty-state">
//           <p>Select a conversation to start chatting</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="chat-window">
//       <div className="chat-header">
//         {showBackButton && (
//           <button className="back-button" onClick={onBackClick}>
//             &larr;
//           </button>
//         )}
//         <div className="recipient-info">
//           <h3>{selectedConversation.name}</h3>
//         </div>
//       </div>
      
//       <div className="messages-container">
//         {messages.length === 0 ? (
//           <div className="no-messages">
//             <p>No messages yet. Say hello!</p>
//           </div>
//         ) : (
//           messages.map((msg, index) => {
//             const isOwnMessage = msg.from === currentUser.userId;
            
//             return (
//               <div 
//                 key={index} 
//                 className={`message ${isOwnMessage ? 'own-message' : 'other-message'}`}
//               >
//                 <div className="message-content">
//                   {msg.content}
//                 </div>
//                 <div className="message-meta">
//                   {formatTime(msg.timestamp)}
//                 </div>
//               </div>
//             );
//           })
//         )}
        
//         {isTyping[selectedConversation.userId] && (
//           <div className="typing-indicator">
//             <span>{isTyping[selectedConversation.userId]} is typing...</span>
//           </div>
//         )}
        
//         <div ref={messagesEndRef} />
//       </div>
      
//       <form className="message-input-form" onSubmit={handleSendMessage}>
//         <input
//           type="text"
//           value={message}
//           onChange={handleTyping}
//           placeholder="Type a message..."
//           className="message-input"
//         />
//         <button type="submit" className="send-button">
//           Send
//         </button>
//       </form>
//     </div>
//   );
// };


// export default ChatWindow;


// client/src/components/ChatWindow.js
import React, { useState, useEffect, useRef } from 'react';
import { useChatContext } from '../../ChatContext';
import './ChatWindow.css';

const ChatWindow = ({ onBackClick, showBackButton }) => {
  const { 
    currentUser, 
    selectedConversation, 
    messages, 
    sendMessage, 
    sendTypingIndicator,
    isTyping 
  } = useChatContext();
  
  const [message, setMessage] = useState('');
  const [typingTimeout, setTypingTimeout] = useState(null);
  const messagesEndRef = useRef(null);

  // Scroll to bottom of messages on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle sending message
  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!message.trim() || !selectedConversation) return;
    
    sendMessage(message, selectedConversation.userId);
    setMessage('');
    
    // Clear typing indicator
    sendTypingIndicator(false, selectedConversation.userId);
  };

  // Handle typing indicator
  const handleTyping = (e) => {
    setMessage(e.target.value);
    
    if (!selectedConversation) return;
    
    // Clear existing timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    
    // Send typing indicator
    sendTypingIndicator(true, selectedConversation.userId);
    
    // Set timeout to clear typing indicator after 2 seconds of no typing
    const timeout = setTimeout(() => {
      sendTypingIndicator(false, selectedConversation.userId);
    }, 2000);
    
    setTypingTimeout(timeout);
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!selectedConversation) {
    return (
      <div className="empty-chat-window">
        <div className="empty-state">
          <p>Select a conversation to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-window">
      <div className="chat-header">
        {showBackButton && (
          <button className="back-button" onClick={onBackClick}>
            &larr;
          </button>
        )}
        <div className="recipient-info">
          <h3>{selectedConversation.name}</h3>
        </div>
      </div>
      
      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="no-messages">
            <p>No messages yet. Say hello!</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isOwnMessage = msg.from === currentUser.userId;
            
            return (
              <div 
                key={index} 
                className={`message ${isOwnMessage ? 'own-message' : 'other-message'}`}
              >
                <div className="message-content">
                  {msg.content}
                </div>
                <div className="message-meta">
                  {formatTime(msg.timestamp)}
                </div>
              </div>
            );
          })
        )}
        
        {isTyping[selectedConversation.userId] && (
          <div className="typing-indicator">
            <span>{isTyping[selectedConversation.userId]} is typing...</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <form className="message-input-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={message}
          onChange={handleTyping}
          placeholder="Type a message..."
          className="message-input"
        />
        <button type="submit" className="send-button">
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;