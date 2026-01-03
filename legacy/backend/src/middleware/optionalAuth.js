import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma.js';

export const optionalAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return next(); // Continue without user
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, username: true, email: true }
    });
    
    if (user) {
      req.user = user;
    }
    
    next();
  } catch (error) {
    // If token is invalid, just continue without user
    next();
  }
};


