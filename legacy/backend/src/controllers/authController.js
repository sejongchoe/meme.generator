import bcrypt from 'bcryptjs';
import { prisma } from '../utils/prisma.js';
import { generateToken, validateEmail, sanitizeInput } from '../utils/helpers.js';
import { body, validationResult } from 'express-validator';

export const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { username, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username: sanitizeInput(username) },
          { email: sanitizeInput(email.toLowerCase()) }
        ]
      }
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        error: existingUser.username === username 
          ? 'Username already taken' 
          : 'Email already registered' 
      });
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Create user
    const user = await prisma.user.create({
      data: {
        username: sanitizeInput(username),
        email: sanitizeInput(email.toLowerCase()),
        passwordHash
      },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true
      }
    });
    
    // Generate token
    const token = generateToken(user.id);
    
    res.status(201).json({
      message: 'User created successfully',
      token,
      user
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { username, password } = req.body;
    
    // Find user by username or email
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: sanitizeInput(username) },
          { email: sanitizeInput(username.toLowerCase()) }
        ]
      }
    });
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate token
    const token = generateToken(user.id);
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res) => {
  res.json({
    user: req.user
  });
};

// Validation rules
export const registerValidation = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('Username must be between 3 and 20 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
];

export const loginValidation = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username or email is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];


