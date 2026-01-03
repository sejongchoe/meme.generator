import express from 'express';
import {
  getFeed,
  searchMemes
} from '../controllers/feedController.js';
import { optionalAuth } from '../middleware/optionalAuth.js';

const router = express.Router();

// Optional auth for feed - allows checking if user liked memes
router.get('/', optionalAuth, getFeed);
router.get('/search', optionalAuth, searchMemes);

export default router;

