import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { memoryStore } from '../config/memoryStore.js';

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id || user.id, email: user.email, name: user.name, role: user.role },
    process.env.JWT_SECRET || 'resumeai_jwt_secret_key_2026_super_secure',
    { expiresIn: '30d' }
  );
};

// @desc Register user
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password.'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const targetRole = role === 'recruiter' ? 'recruiter' : 'candidate';

    let newUser;

    if (memoryStore.isMongoDBConnected) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'User already exists with this email.' });
      }
      newUser = await User.create({ name, email, password: hashedPassword, role: targetRole });
    } else {
      const existingUser = await memoryStore.findUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'User already exists with this email.' });
      }
      newUser = await memoryStore.createUser({ name, email, password: hashedPassword, role: targetRole });
    }

    const token = generateToken(newUser);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        token,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          createdAt: newUser.createdAt
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc Login user
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    let user;
    if (memoryStore.isMongoDBConnected) {
      user = await User.findOne({ email });
    } else {
      user = await memoryStore.findUserByEmail(email);
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get current user profile
export const getMe = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      data: { user: req.user }
    });
  } catch (error) {
    next(error);
  }
};
