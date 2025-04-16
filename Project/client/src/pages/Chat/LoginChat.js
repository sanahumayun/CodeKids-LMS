// // client/src/components/LoginChat.js
// import React, { useState } from 'react';
// import { useChatContext } from '../context/ChatContext';
// import './LoginChat.css';

// const LoginChat = () => {
//   const { joinChat } = useChatContext();
//   const [name, setName] = useState('');
//   const [userType, setUserType] = useState('student');
//   const [userId, setUserId] = useState('');
//   const [error, setError] = useState('');

//   const handleSubmit = (e) => {
//     e.preventDefault();
    
//     if (!name.trim() || !userId.trim()) {
//       setError('Please fill in all fields');
//       return;
//     }
    
//     joinChat({
//       userId,
//       userType,
//       name
//     });
//   };

//   return (
//     <div className="login-container">
//       <div className="login-card">
//         <h2>LMS Chat System</h2>
//         <p>Please enter your details to start chatting</p>
        
//         {error && <div className="error-message">{error}</div>}
        
//         <form onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label htmlFor="name">Full Name</label>
//             <input
//               type="text"
//               id="name"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               placeholder="Enter your name"
//             />
//           </div>
          
//           <div className="form-group">
//             <label htmlFor="userId">User ID</label>
//             <input
//               type="text"
//               id="userId"
//               value={userId}
//               onChange={(e) => setUserId(e.target.value)}
//               placeholder="Enter your user ID"
//             />
//           </div>
          
//           <div className="form-group">
//             <label>User Type</label>
//             <div className="radio-group">
//               <label>
//                 <input
//                   type="radio"
//                   name="userType"
//                   value="student"
//                   checked={userType === 'student'}
//                   onChange={() => setUserType('student')}
//                 />
//                 Student
//               </label>
//               <label>
//                 <input
//                   type="radio"
//                   name="userType"
//                   value="tutor"
//                   checked={userType === 'tutor'}
//                   onChange={() => setUserType('tutor')}
//                 />
//                 Tutor
//               </label>
//             </div>
//           </div>
          
//           <button type="submit" className="join-button">
//             Join Chat
//           </button>
//         </form>
        
//         <div className="sample-logins">
//           <p>Sample Logins:</p>
//           <ul>
//             <li>Student: user1/student1</li>
//             <li>Tutor: prof/tutor1</li>
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginChat;

// client/src/components/LoginChat.js
import React, { useState } from 'react';
import { useChatContext } from '../../ChatContext';
import './LoginChat.css';

const LoginChat = () => {
  const { joinChat } = useChatContext();
  const [name, setName] = useState('');
  const [userType, setUserType] = useState('student');
  const [userId, setUserId] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!name.trim() || !userId.trim()) {
      setError('Please fill in all fields');
      return;
    }
    
    joinChat({
      userId,
      userType,
      name
    });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>LMS Chat System</h2>
        <p>Please enter your details to start chatting</p>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="userId">User ID</label>
            <input
              type="text"
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter your user ID"
            />
          </div>
          
          <div className="form-group">
            <label>User Type</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="userType"
                  value="student"
                  checked={userType === 'student'}
                  onChange={() => setUserType('student')}
                />
                Student
              </label>
              <label>
                <input
                  type="radio"
                  name="userType"
                  value="tutor"
                  checked={userType === 'tutor'}
                  onChange={() => setUserType('tutor')}
                />
                Tutor
              </label>
            </div>
          </div>
          
          <button type="submit" className="join-button">
            Join Chat
          </button>
        </form>
        
      </div>
    </div>
  );
};

export default LoginChat;