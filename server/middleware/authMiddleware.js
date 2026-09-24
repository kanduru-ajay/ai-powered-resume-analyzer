import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided',
      error: { code: 'UNAUTHORIZED' }
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'resumeai_jwt_secret_key_2026_super_secure');
    
    // Check if user exists in DB or memory
    const user = await User.findById(decoded.id).select('-password');
    if (user) {
      req.user = user;
    } else {
      // In-memory or decoded fallback
      req.user = {
        _id: decoded.id,
        id: decoded.id,
        name: decoded.name || 'User',
        email: decoded.email || 'user@example.com',
        role: decoded.role || 'candidate'
      };
    }
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, token failed verification',
      error: { details: error.message }
    });
  }
};

export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user?.role}' is not authorized to access this resource`,
        error: { code: 'FORBIDDEN' }
      });
    }
    next();
  };
};
