import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import memeRoutes from './routes/memes.js';
import userRoutes from './routes/users.js';
import feedRoutes from './routes/feed.js';
import tagRoutes from './routes/tags.js';
import { errorHandler } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiter.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5500',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use('/api/', apiLimiter);

// Serve uploaded images
app.use('/api/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/memes', memeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/feed', feedRoutes);
app.use('/api/tags', tagRoutes);

// Search endpoint (as specified in plan: GET /api/search?q=query)
import { searchMemes } from './controllers/feedController.js';
import { optionalAuth } from './middleware/optionalAuth.js';
app.get('/api/search', optionalAuth, searchMemes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Meme Platform API is running' });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});


