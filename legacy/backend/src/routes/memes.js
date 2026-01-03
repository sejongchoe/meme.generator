import express from 'express';
import {
  createMeme,
  getMeme,
  deleteMeme,
  likeMeme,
  unlikeMeme,
  addComment,
  getComments,
  createMemeValidation,
  addCommentValidation
} from '../controllers/memeController.js';
import {
  addTagsToMeme,
  getMemeTags,
  removeTagFromMeme,
  addTagsValidation
} from '../controllers/tagController.js';
import { authenticate } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { createMemeLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/', createMemeLimiter, authenticate, upload.single('image'), createMemeValidation, createMeme);
router.get('/:id', getMeme);
router.delete('/:id', authenticate, deleteMeme);
router.post('/:id/like', authenticate, likeMeme);
router.delete('/:id/like', authenticate, unlikeMeme);
router.post('/:id/comments', authenticate, addCommentValidation, addComment);
router.get('/:id/comments', getComments);
router.post('/:id/tags', authenticate, addTagsValidation, addTagsToMeme);
router.get('/:id/tags', getMemeTags);
router.delete('/:id/tags/:tagId', authenticate, removeTagFromMeme);

export default router;


