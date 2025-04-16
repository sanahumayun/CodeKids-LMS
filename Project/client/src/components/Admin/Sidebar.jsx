const Sidebar = ({ activeTab, setActiveTab }) => {
    return (
      <div className="bg-gray-800 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out">
        <div className="text-center">
          <h2 className="text-2xl font-bold">LMS Admin</h2>
          <p className="text-xs mt-1 text-gray-400">Management System</p>
        </div>
        
        <nav>
          <a 
            href="#" 
            className={`block py-2.5 px-4 rounded transition duration-200 ${activeTab === 'users' ? 'bg-green-500 text-white' : 'hover:bg-gray-700'}`}
            onClick={() => setActiveTab('users')}
          >
            User Management
          </a>
          <a 
            href="#" 
            className={`block py-2.5 px-4 rounded transition duration-200 ${activeTab === 'courses' ? 'bg-green-500 text-white' : 'hover:bg-gray-700'}`}
            onClick={() => setActiveTab('courses')}
          >
            Course Management
          </a>
        </nav>
      </div>
    );
  };
  
  export default Sidebar;
  