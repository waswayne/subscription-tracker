import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { JWT_SECRET } from '../config/env.js';

export const authorize = async (req, res, next) => {
  try {
    const authHeader = req.headers?.authorization;
    let token;

    if (authHeader?.startsWith('Bearer')) {
      token = authHeader.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Fetch user (omit password)
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    req.user = user; 
    next();
  } catch (error) {
    console.error(error);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }

    res.status(401).json({ message: 'Invalid token' });
  }
};

export default authorize;
