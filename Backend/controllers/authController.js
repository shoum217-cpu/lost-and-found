import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Generate JWT token helper
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'findit_jwt_secret_key_2026', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, whatsappEnabled } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      phone: phone || '',
      whatsappEnabled: Boolean(whatsappEnabled),
    });

    if (user) {
      return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        whatsappEnabled: user.whatsappEnabled,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      return res.status(400).json({ message: 'Invalid user data provided' });
    }
  } catch (error) {
    console.error('Error in registerUser:', error);
    return res.status(500).json({ message: error.message || 'Server error during registration' });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide both email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (user && (await user.matchPassword(password))) {
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        whatsappEnabled: user.whatsappEnabled,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Error in loginUser:', error);
    return res.status(500).json({ message: error.message || 'Server error during login' });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: 'Server error retrieving profile' });
  }
};

// @desc    Update user profile (phone, whatsappEnabled, name)
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = req.body.name || user.name;
    if (req.body.phone !== undefined) user.phone = req.body.phone;
    if (req.body.whatsappEnabled !== undefined) user.whatsappEnabled = req.body.whatsappEnabled;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    return res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      whatsappEnabled: updatedUser.whatsappEnabled,
      role: updatedUser.role,
      token: generateToken(updatedUser._id),
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error updating profile' });
  }
};

// @desc    Authenticate or register user via Google
// @route   POST /api/auth/google
// @access  Public
export const googleAuth = async (req, res) => {
  try {
    const { credential, email, name } = req.body;

    let userEmail = email;
    let userName = name;

    // If a Google JWT credential is provided, decode payload
    if (credential && !userEmail) {
      try {
        const parts = credential.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
          userEmail = payload.email;
          userName = payload.name || payload.given_name || (userEmail ? userEmail.split('@')[0] : 'Google User');
        }
      } catch (decodeErr) {
        console.warn('Failed to parse Google credential token:', decodeErr.message);
      }
    }

    if (!userEmail) {
      return res.status(400).json({ message: 'Valid Google email is required for authentication' });
    }

    userEmail = userEmail.toLowerCase().trim();
    userName = userName || userEmail.split('@')[0];

    // Find existing user or create a new user
    let user = await User.findOne({ email: userEmail });

    if (!user) {
      // Generate a random secure password for accounts created via Google
      const randomPassword = 'G_' + Math.random().toString(36).slice(-8) + Date.now().toString(36);
      user = await User.create({
        name: userName,
        email: userEmail,
        password: randomPassword,
      });
    }

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      whatsappEnabled: Boolean(user.whatsappEnabled),
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Error in googleAuth:', error);
    return res.status(500).json({ message: error.message || 'Server error during Google authentication' });
  }
};

