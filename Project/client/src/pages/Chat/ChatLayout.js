

// import React, { useState, useEffect } from 'react';
// import { useChatContext } from '../../../src/ChatContext';
// import ChatSidebar from './ChatSidebar';
// import ChatWindow from './ChatWindow';
// import LoginChat from './LoginChat';
// import './ChatLayout.css';

// const ChatLayout = () => {
//   const { currentUser } = useChatContext();
//   const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
//   const [showSidebar, setShowSidebar] = useState(true);

//   useEffect(() => {
//     const handleResize = () => {
//       const mobile = window.innerWidth < 768;
//       setIsMobileView(mobile);
//       if (!mobile) {
//         setShowSidebar(true);
//       }
//     };

//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   if (!currentUser) {
//     return <LoginChat />;
//   }

//   return (
//     <div className="chat-layout">
//       {(!isMobileView || showSidebar) && (
//         <div className="chat-sidebar-container">
//           <ChatSidebar 
//             onConversationSelect={() => isMobileView && setShowSidebar(false)} 
//           />
//         </div>
//       )}
      
//       <div className="chat-window-container">
//         <ChatWindow 
//           onBackClick={() => setShowSidebar(true)}
//           showBackButton={isMobileView && !showSidebar}
//         />
//       </div>
//     </div>
//   );
// };

// export default ChatLayout;
// client/src/components/ChatLayout.js
import React, { useState, useEffect } from 'react';
import { useChatContext } from '../../../src/ChatContext';
import ChatSidebar from './ChatSidebar';
import ChatWindow from './ChatWindow';
import './ChatLayout.css';

const ChatLayout = () => {
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobileView(mobile);
      if (!mobile) {
        setShowSidebar(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="chat-layout">
      {(!isMobileView || showSidebar) && (
        <div className="chat-sidebar-container">
          <ChatSidebar 
            onConversationSelect={() => isMobileView && setShowSidebar(false)} 
          />
        </div>
      )}
      
      <div className="chat-window-container">
        <ChatWindow 
          onBackClick={() => setShowSidebar(true)}
          showBackButton={isMobileView && !showSidebar}
        />
      </div>
    </div>
  );
};

export default ChatLayout;