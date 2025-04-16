// // server/controllers/chatController.js
// // Note: This is a simple mock implementation since you mentioned you don't need 
// // to connect to the database. In a real application, these would fetch from your database.

// // Mock data for demo purposes
// const mockConversations = {
//     'tutor1': [
//       { userId: 'student1', name: 'John Student', lastMessage: 'Hi, I have a question', timestamp: '2025-04-08T14:30:00Z' },
//       { userId: 'student2', name: 'Jane Student', lastMessage: 'Thank you for the help', timestamp: '2025-04-08T16:45:00Z' }
//     ],
//     'student1': [
//       { userId: 'tutor1', name: 'Professor Smith', lastMessage: 'Hi, I have a question', timestamp: '2025-04-08T14:30:00Z' }
//     ],
//     'student2': [
//       { userId: 'tutor1', name: 'Professor Smith', lastMessage: 'Thank you for the help', timestamp: '2025-04-08T16:45:00Z' }
//     ]
//   };
  
//   const mockMessages = {
//     'tutor1_student1': [
//       { from: 'student1', to: 'tutor1', content: 'Hi, I have a question about the assignment', timestamp: '2025-04-08T14:30:00Z' },
//       { from: 'tutor1', to: 'student1', content: 'Sure, what would you like to know?', timestamp: '2025-04-08T14:32:00Z' }
//     ],
//     'tutor1_student2': [
//       { from: 'student2', to: 'tutor1', content: 'Can you help me with problem #3?', timestamp: '2025-04-08T16:40:00Z' },
//       { from: 'tutor1', to: 'student2', content: 'Of course! You need to apply the formula we discussed', timestamp: '2025-04-08T16:42:00Z' },
//       { from: 'student2', to: 'tutor1', content: 'Thank you for the help', timestamp: '2025-04-08T16:45:00Z' }
//     ]
//   };
  
//   // Get recent messages for a conversation
//   exports.getMessages = (req, res) => {
//     const { userId, recipientId } = req.params;
    
//     // In a real app, we'd query the database here
//     // For the mock, we'll use our hardcoded data
//     const conversationId = [userId, recipientId].sort().join('_');
//     const messages = mockMessages[conversationId] || [];
    
//     res.json({
//       success: true,
//       messages
//     });
//   };
  
//   // Get all conversations for a user
//   exports.getConversations = (req, res) => {
//     const { userId } = req.params;
    
//     // In a real app, we'd query the database here
//     // For the mock, we'll use our hardcoded data
//     const conversations = mockConversations[userId] || [];
    
//     res.json({
//       success: true,
//       conversations
//     });
//   };

// server/controllers/chatController.js
// Note: This is a simple mock implementation since you don't need 
// to connect to the database. In a real application, these would fetch from your database.

// Mock data for demo purposes
const mockConversations = {
    'tutor1': [
      { userId: 'student1', name: 'John Student', lastMessage: 'Hi, I have a question', timestamp: '2025-04-08T14:30:00Z' },
      { userId: 'student2', name: 'Jane Student', lastMessage: 'Thank you for the help', timestamp: '2025-04-08T16:45:00Z' }
    ],
    'student1': [
      { userId: 'tutor1', name: 'Professor Smith', lastMessage: 'Hi, I have a question', timestamp: '2025-04-08T14:30:00Z' }
    ],
    'student2': [
      { userId: 'tutor1', name: 'Professor Smith', lastMessage: 'Thank you for the help', timestamp: '2025-04-08T16:45:00Z' }
    ]
  };
  
  const mockMessages = {
    'student1_tutor1': [
      { from: 'student1', to: 'tutor1', content: 'Hi, I have a question about the assignment', timestamp: '2025-04-08T14:30:00Z' },
      { from: 'tutor1', to: 'student1', content: 'Sure, what would you like to know?', timestamp: '2025-04-08T14:32:00Z' }
    ],
    'student2_tutor1': [
      { from: 'student2', to: 'tutor1', content: 'Can you help me with problem #3?', timestamp: '2025-04-08T16:40:00Z' },
      { from: 'tutor1', to: 'student2', content: 'Of course! You need to apply the formula we discussed', timestamp: '2025-04-08T16:42:00Z' },
      { from: 'student2', to: 'tutor1', content: 'Thank you for the help', timestamp: '2025-04-08T16:45:00Z' }
    ]
  };
  
  // Get recent messages for a conversation
  exports.getMessages = (req, res) => {
    const { userId, recipientId } = req.params;
    
    // In a real app, we'd query the database here
    // For the mock, we'll use our hardcoded data
    const conversationId = [userId, recipientId].sort().join('_');
    const messages = mockMessages[conversationId] || [];
    
    res.json({
      success: true,
      messages
    });
  };
  
  // Get all conversations for a user
  exports.getConversations = (req, res) => {
    const { userId } = req.params;
    
    // In a real app, we'd query the database here
    // For the mock, we'll use our hardcoded data
    const conversations = mockConversations[userId] || [];
    
    res.json({
      success: true,
      conversations
    });
  };