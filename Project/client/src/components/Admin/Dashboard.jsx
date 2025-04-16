import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './Sidebar';
import UserManagement from './UserManagement';
import CourseManagement from './CourseManagement';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    if (!loggedInUser || loggedInUser.role !== 'admin') {
      navigate('/login');
      return;
    }
    setUser(loggedInUser);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <div className="flex items-center">
              <span className="mr-4 text-gray-700">Welcome, {user.name}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-6">
          {activeTab === 'users' && <UserManagement />}
          {activeTab === 'courses' && <CourseManagement />}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
