import { prisma, stringifyTextElements, parseTextElements } from '../utils/prisma.js';
import { sanitizeInput } from '../utils/helpers.js';
import { body, validationResult } from 'express-validator';
import path from 'path';

export const createMeme = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }
    
    const { title, textElements } = req.body;
    const imageUrl = `/api/uploads/${req.file.filename}`;
    
    // Parse textElements if it's a string
    let parsedTextElements;
    try {
      parsedTextElements = typeof textElements === 'string' 
        ? JSON.parse(textElements) 
        : textElements;
    } catch (e) {
      return res.status(400).json({ error: 'Invalid textElements format' });
    }
    
    const meme = await prisma.meme.create({
      data: {
        userId: req.user.id,
        imageUrl,
        title: sanitizeInput(title),
        textElements: stringifyTextElements(parsedTextElements)
      },
      include: {
        user: {
          select: {
            id: true,
            username: true
          }
        }
      }
    });
    
    res.status(201).json({
      message: 'Meme created successfully',
      meme
    });
  } catch (error) {
    next(error);
  }
};

export const getMeme = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const meme = await prisma.meme.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: {
          select: {
            id: true,
            username: true
          }
        },
        tags: {
          include: {
            tag: true
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      }
    });
    
    if (!meme) {
      return res.status(404).json({ error: 'Meme not found' });
    }
    
    // Check if current user has liked this meme
    let userLiked = false;
    if (req.user) {
      const like = await prisma.like.findUnique({
        where: {
          userId_memeId: {
            userId: req.user.id,
            memeId: meme.id
          }
        }
      });
      userLiked = !!like;
    }
    
    // Parse textElements for response
    const memeResponse = {
      ...meme,
      textElements: parseTextElements(meme.textElements),
      userLiked
    };
    
    res.json(memeResponse);
  } catch (error) {
    next(error);
  }
};

export const deleteMeme = async (req, res, next) => {
  try {
    const { id } = req.params;
    const memeId = parseInt(id);
    
    const meme = await prisma.meme.findUnique({
      where: { id: memeId }
    });
    
    if (!meme) {
      return res.status(404).json({ error: 'Meme not found' });
    }
    
    if (meme.userId !== req.user.id) {
      return res.status(403).json({ error: 'You can only delete your own memes' });
    }
    
    await prisma.meme.delete({
      where: { id: memeId }
    });
    
    res.json({ message: 'Meme deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const likeMeme = async (req, res, next) => {
  try {
    const { id } = req.params;
    const memeId = parseInt(id);
    
    // Check if meme exists
    const meme = await prisma.meme.findUnique({
      where: { id: memeId }
    });
    
    if (!meme) {
      return res.status(404).json({ error: 'Meme not found' });
    }
    
    // Check if already liked
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_memeId: {
          userId: req.user.id,
          memeId: memeId
        }
      }
    });
    
    if (existingLike) {
      return res.status(400).json({ error: 'Meme already liked' });
    }
    
    // Create like and update count
    await prisma.$transaction([
      prisma.like.create({
        data: {
          userId: req.user.id,
          memeId: memeId
        }
      }),
      prisma.meme.update({
        where: { id: memeId },
        data: {
          likesCount: { increment: 1 }
        }
      })
    ]);
    
    res.json({ message: 'Meme liked successfully' });
  } catch (error) {
    next(error);
  }
};

export const unlikeMeme = async (req, res, next) => {
  try {
    const { id } = req.params;
    const memeId = parseInt(id);
    
    // Check if like exists
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_memeId: {
          userId: req.user.id,
          memeId: memeId
        }
      }
    });
    
    if (!existingLike) {
      return res.status(400).json({ error: 'Meme not liked' });
    }
    
    // Delete like and update count
    await prisma.$transaction([
      prisma.like.delete({
        where: {
          userId_memeId: {
            userId: req.user.id,
            memeId: memeId
          }
        }
      }),
      prisma.meme.update({
        where: { id: memeId },
        data: {
          likesCount: { decrement: 1 }
        }
      })
    ]);
    
    res.json({ message: 'Meme unliked successfully' });
  } catch (error) {
    next(error);
  }
};

export const addComment = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { id } = req.params;
    const { content } = req.body;
    const memeId = parseInt(id);
    
    // Check if meme exists
    const meme = await prisma.meme.findUnique({
      where: { id: memeId }
    });
    
    if (!meme) {
      return res.status(404).json({ error: 'Meme not found' });
    }
    
    // Create comment and update count
    const comment = await prisma.$transaction(async (tx) => {
      const newComment = await tx.comment.create({
        data: {
          userId: req.user.id,
          memeId: memeId,
          content: sanitizeInput(content)
        },
        include: {
          user: {
            select: {
              id: true,
              username: true
            }
          }
        }
      });
      
      await tx.meme.update({
        where: { id: memeId },
        data: {
          commentsCount: { increment: 1 }
        }
      });
      
      return newComment;
    });
    
    res.status(201).json({
      message: 'Comment added successfully',
      comment
    });
  } catch (error) {
    next(error);
  }
};

export const getComments = async (req, res, next) => {
  try {
    const { id } = req.params;
    const memeId = parseInt(id);
    
    const comments = await prisma.comment.findMany({
      where: { memeId: memeId },
      include: {
        user: {
          select: {
            id: true,
            username: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    res.json({ comments });
  } catch (error) {
    next(error);
  }
};

export const createMemeValidation = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('textElements')
    .notEmpty()
    .withMessage('Text elements are required')
];

export const addCommentValidation = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Comment must be between 1 and 500 characters')
];

