import express from 'express';
import {
  getUserProfile,
  getUserMemes
} from '../controllers/userController.js';

const router = express.Router();

router.get('/:username', getUserProfile);
router.get('/:username/memes', getUserMemes);

export default router;


