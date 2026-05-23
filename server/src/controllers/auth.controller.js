import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';
import logger from '../utils/logger.js';

const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';
const SALT_ROUNDS = 12;

/**
 * Generate access and refresh tokens for a user.
 * @param {string} userId
 * @returns {{ accessToken: string, refreshToken: string }}
 */
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
  return { accessToken, refreshToken };
};

/**
 * Set the refresh token as an httpOnly cookie.
 * @param {import('express').Response} res
 * @param {string} refreshToken
 */
const setRefreshCookie = (res, refreshToken) => {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  });
};

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({
      success: false,
      data: null,
      message: 'An account with this email already exists',
    });
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  // Create user
  const user = await User.create({ name, email, passwordHash });

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user._id);
  setRefreshCookie(res, refreshToken);

  logger.info('User registered', { userId: user._id, email });

  res.status(201).json({
    success: true,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan,
      },
      accessToken,
    },
    message: 'Registration successful',
  });
});

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user with password hash
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({
      success: false,
      data: null,
      message: 'Invalid email or password',
    });
  }

  // Verify password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      data: null,
      message: 'Invalid email or password',
    });
  }

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user._id);
  setRefreshCookie(res, refreshToken);

  logger.info('User logged in', { userId: user._id, email });

  res.json({
    success: true,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan,
      },
      accessToken,
    },
    message: 'Login successful',
  });
});

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (clear refresh cookie)
 * @access  Public
 */
export const logout = asyncHandler(async (req, res) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
  });

  res.json({
    success: true,
    data: null,
    message: 'Logged out successfully',
  });
});

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token using refresh token cookie
 * @access  Public
 */
export const refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      data: null,
      message: 'No refresh token provided',
    });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.userId).select('-passwordHash');

    if (!user) {
      return res.status(401).json({
        success: false,
        data: null,
        message: 'User not found',
      });
    }

    // Generate new access token only
    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRY,
    });

    res.json({
      success: true,
      data: {
        accessToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          plan: user.plan,
        },
      },
      message: 'Token refreshed',
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      data: null,
      message: 'Invalid or expired refresh token',
    });
  }
});
