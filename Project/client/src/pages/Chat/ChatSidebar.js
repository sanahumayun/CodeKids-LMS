// // client/src/components/ChatSidebar.js
// import React from 'react';
// import { useChatContext } from '../context/ChatContext';
// import './ChatSidebar.css';

// const ChatSidebar = ({ onConversationSelect }) => {
//   const { 
//     currentUser, 
//     conversations, 
//     activeUsers, 
//     selectedConversation, 
//     selectConversation 
//   } = useChatContext();

//   // Get online status for each conversation
//   const getOnlineStatus = (userId) => {
//     return activeUsers.some(user => user.userId === userId);
//   };

//   // Format timestamp
//   const formatTime = (timestamp) => {
//     const date = new Date(timestamp);
//     return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//   };

//   // Handle conversation selection
//   const handleSelect = (conversation) => {
//     selectConversation(conversation);
//     if (onConversationSelect) {
//       onConversationSelect();
//     }
//   };

//   return (
//     <div className="chat-sidebar">
//       <div className="sidebar-header">
//         <h2>Conversations</h2>
//         <div className="user-info">
//           <span>{currentUser.name}</span>
//           <span className="user-type">{currentUser.userType}</span>
//         </div>
//       </div>
      
//       <div className="conversation-list">
//         {conversations.length === 0 ? (
//           <div className="no-conversations">
//             <p>No conversations yet</p>
//           </div>
//         ) : (
//           conversations.map((conversation) => (
//             <div 
//               key={conversation.userId}
//               className={`conversation-item ${selectedConversation?.userId === conversation.userId ? 'active' : ''}`}
//               onClick={() => handleSelect(conversation)}
//             >
//               <div className="conversation-avatar">
//                 <div className={`status-indicator ${getOnlineStatus(conversation.userId) ? 'online' : 'offline'}`}></div>
//                 <span>{conversation.name.substring(0, 2).toUpperCase()}</span>
//               </div>
//               <div className="conversation-details">
//                 <div className="conversation-name">
//                   {conversation.name}
//                 </div>
//                 <div className="conversation-last-message">
//                   {conversation.lastMessage}
//                 </div>
//               </div>
//               <div className="conversation-time">
//                 {formatTime(conversation.timestamp)}
//               </div>
//             </div>
//           ))
//         )}
//       </div>
      
//       <div className="active-users-section">
//         <h3>Online Users</h3>
//         <div className="active-users-list">
//           {activeUsers
//             .filter(user => user.userId !== currentUser.userId)
//             .map((user) => {
//               // Check if this user is already in conversations
//               const existingConversation = conversations.find(conv => conv.userId === user.userId);
              
//               return (
//                 <div 
//                   key={user.userId}
//                   className="active-user-item"
//                   onClick={() => {
//                     if (existingConversation) {
//                       handleSelect(existingConversation);
//                     } else {
//                       // Create a new conversation if this is a new contact
//                       const newConversation = {
//                         userId: user.userId,
//                         name: user.name,
//                         lastMessage: '',
//                         timestamp: new Date().toISOString()
//                       };
//                       handleSelect(newConversation);
//                     }
//                   }}
//                 >
//                   <div className="user-avatar">
//                     <div className="status-indicator online"></div>
//                     <span>{user.name.substring(0, 2).toUpperCase()}</span>
//                   </div>
//                   <div className="user-details">
//                     <div className="user-name">{user.name}</div>
//                     <div className="user-role">{user.userType}</div>
//                   </div>
//                 </div>
//               );
//             })}
            
//           {activeUsers.filter(user => user.userId !== currentUser.userId).length === 0 && (
//             <div className="no-active-users">
//               <p>No users online</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatSidebar;

// client/src/components/ChatSidebar.js
import React from 'react';
import { useChatContext } from '../../ChatContext';
import './ChatSidebar.css';

const ChatSidebar = ({ onConversationSelect }) => {
  const { 
    currentUser, 
    conversations, 
    activeUsers, 
    selectedConversation, 
    selectConversation 
  } = useChatContext();

  const getOnlineStatus = (userId) => {
    return activeUsers.some(user => user.userId === userId);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };


  const handleSelect = (conversation) => {
    selectConversation(conversation);
    if (onConversationSelect) {
      onConversationSelect();
    }
  };

  return (
    <div className="chat-sidebar">
      <div className="sidebar-header">
        <h2>Conversations</h2>
        <div className="user-info">
          <span>{currentUser.name}</span>
          <span className="user-type">{currentUser.userType}</span>
        </div>
      </div>
      
      <div className="conversation-list">
        {conversations.length === 0 ? (
          <div className="no-conversations">
            <p>No conversations yet</p>
          </div>
        ) : (
          conversations.map((conversation) => (
            <div 
              key={conversation.userId}
              className={`conversation-item ${selectedConversation?.userId === conversation.userId ? 'active' : ''}`}
              onClick={() => handleSelect(conversation)}
            >
              <div className="conversation-avatar">
                <div className={`status-indicator ${getOnlineStatus(conversation.userId) ? 'online' : 'offline'}`}></div>
                <span>{conversation.name.substring(0, 2).toUpperCase()}</span>
              </div>
              <div className="conversation-details">
                <div className="conversation-name">
                  {conversation.name}
                </div>
                <div className="conversation-last-message">
                  {conversation.lastMessage}
                </div>
              </div>
              <div className="conversation-time">
                {formatTime(conversation.timestamp)}
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="active-users-section">
        <h3>Online Users</h3>
        <div className="active-users-list">
          {activeUsers
            .filter(user => user.userId !== currentUser.userId)
            .map((user) => {
              
              const existingConversation = conversations.find(conv => conv.userId === user.userId);
              
              return (
                <div 
                  key={user.userId}
                  className="active-user-item"
                  onClick={() => {
                    if (existingConversation) {
                      handleSelect(existingConversation);
                    } else {
                      const newConversation = {
                        userId: user.userId,
                        name: user.name,
                        lastMessage: '',
                        timestamp: new Date().toISOString()
                      };
                      handleSelect(newConversation);
                    }
                  }}
                >
                  <div className="user-avatar">
                    <div className="status-indicator online"></div>
                    <span>{user.name.substring(0, 2).toUpperCase()}</span>
                  </div>
                  <div className="user-details">
                    <div className="user-name">{user.name}</div>
                    <div className="user-role">{user.userType}</div>
                  </div>
                </div>
              );
            })}
            
          {activeUsers.filter(user => user.userId !== currentUser.userId).length === 0 && (
            <div className="no-active-users">
              <p>No users online</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;