const User = require('../models/User');

exports.getUsers = async (req, res) => {
    try {
      const { role } = req.query;
      console.log('🔍 Role Query:', role);
  
      const query = role ? { role } : {};
      console.log('🧾 MongoDB Query:', query);
  
      const users = await User.find(query);
      console.log('📦 Fetched Users:', users);
  
      res.status(200).json(users);
    } catch (err) {
      console.error('❌ Error fetching users:', err);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  };

exports.deleteUser = async (req, res) => {
  console.log("DELETE /api/users/:userId hit with ID:", req.params.userId);
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error while deleting user." });
  }
};



  
