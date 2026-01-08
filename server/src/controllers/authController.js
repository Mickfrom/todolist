const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateToken } = require('../utils/jwt');

// Register new user
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({
        error: 'Username and password are required'
      });
    }

    // Check if user already exists by username
    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      return res.status(409).json({ 
        error: 'Username already exists' 
      });
    }

    // Check if email already exists (only if email is provided)
    if (email) {
      const existingEmail = await User.findByEmail(email);
      if (existingEmail) {
        return res.status(409).json({
          error: 'Email already exists'
        });
      }
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await User.create({
      username,
      email,
      passwordHash
    });

    // Generate JWT token
    const token = generateToken(user);

    res.status(201).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        ...(user.email && { email: user.email })
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      error: 'Registration failed',
      details: error.message 
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({
        error: 'Username and password are required'
      });
    }

    // Find user by username
    const user = await User.findByUsername(username);
    if (!user) {
      return res.status(401).json({
        error: 'Invalid username or password'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Invalid username or password'
      });
    }

    // Generate JWT token
    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        ...(user.email && { email: user.email })
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: 'Login failed',
      details: error.message 
    });
  }
};

// Get current user
const getCurrentUser = async (req, res) => {
  try {
    // req.userId is set by auth middleware
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ 
        error: 'User not found' 
      });
    }

    res.json({
      user: {
        id: user.id,
        username: user.username,
        ...(user.email && { email: user.email })
      }
    });

  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ 
      error: 'Failed to get user',
      details: error.message 
    });
  }
};

module.exports = {
  register,
  login,
  getCurrentUser
};
