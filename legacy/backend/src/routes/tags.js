import express from 'express';
import {
  searchByTag
} from '../controllers/tagController.js';

const router = express.Router();

router.get('/:tagName/memes', searchByTag);

export default router;

