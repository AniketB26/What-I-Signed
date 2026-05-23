import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import logger from '../utils/logger.js';

/**
 * Protect middleware — requires a valid Bearer token.
 * Extracts user from JWT and attaches to req.user.
 */
export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.query.token) {
      // Support token via query param for SSE endpoints (EventSource can't set headers)
      token = req.query.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        data: null,
        message: 'Not authorized — no token provided',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-passwordHash');

    if (!user) {
      return res.status(401).json({
        success: false,
        data: null,
        message: 'Not authorized — user not found',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    logger.warn(`Auth failed: ${error.message}`);
    return res.status(401).json({
      success: false,
      data: null,
      message: 'Not authorized — invalid token',
    });
  }
};

/**
 * Optional auth middleware — attaches user if token present, but doesn't fail without one.
 */
export const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-passwordHash');

    if (user) {
      req.user = user;
    }

    next();
  } catch (error) {
    // Token invalid but that's okay for optional auth
    next();
  }
};
