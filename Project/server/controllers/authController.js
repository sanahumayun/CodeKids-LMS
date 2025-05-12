const User = require('../models/User');
const jwt = require('jsonwebtoken');
const verifyEmailExists = require("../utils/emailValidator");

exports.signup = async (req, res) => {
    const { name, email, password, role } = req.body;
    
    try {
    const isValid = await verifyEmailExists(email);
    if (!isValid) {
      return res.status(400).json({ error: "Please provide a valid, working email address." });
    }

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ error: 'Email already exists' });

    const newUser = new User({ name, email, password, role });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Wrong email' });
    }

    if (user.password !== password) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};


