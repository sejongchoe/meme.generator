import { prisma } from '../utils/prisma.js';
import { sanitizeInput } from '../utils/helpers.js';
import { body, validationResult } from 'express-validator';

export const addTagsToMeme = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { id } = req.params;
    const { tags } = req.body;
    const memeId = parseInt(id);
    
    // Check if meme exists and belongs to user
    const meme = await prisma.meme.findUnique({
      where: { id: memeId }
    });
    
    if (!meme) {
      return res.status(404).json({ error: 'Meme not found' });
    }
    
    if (meme.userId !== req.user.id) {
      return res.status(403).json({ error: 'You can only tag your own memes' });
    }
    
    // Ensure tags is an array
    const tagNames = Array.isArray(tags) ? tags : [tags];
    
    // Create or find tags and associate with meme
    const result = await prisma.$transaction(async (tx) => {
      // Remove existing tags for this meme
      await tx.memeTag.deleteMany({
        where: { memeId: memeId }
      });
      
      // Create or find tags and create associations
      const tagResults = [];
      for (const tagName of tagNames) {
        const sanitizedTag = sanitizeInput(tagName).toLowerCase().trim();
        if (!sanitizedTag) continue;
        
        // Find or create tag
        const tag = await tx.tag.upsert({
          where: { name: sanitizedTag },
          update: {},
          create: { name: sanitizedTag }
        });
        
        // Create meme-tag association
        await tx.memeTag.upsert({
          where: {
            memeId_tagId: {
              memeId: memeId,
              tagId: tag.id
            }
          },
          update: {},
          create: {
            memeId: memeId,
            tagId: tag.id
          }
        });
        
        tagResults.push(tag);
      }
      
      return tagResults;
    });
    
    res.json({
      message: 'Tags added successfully',
      tags: result
    });
  } catch (error) {
    next(error);
  }
};

export const getMemeTags = async (req, res, next) => {
  try {
    const { id } = req.params;
    const memeId = parseInt(id);
    
    const memeTags = await prisma.memeTag.findMany({
      where: { memeId: memeId },
      include: {
        tag: true
      }
    });
    
    const tags = memeTags.map(mt => mt.tag);
    
    res.json({ tags });
  } catch (error) {
    next(error);
  }
};

export const removeTagFromMeme = async (req, res, next) => {
  try {
    const { id, tagId } = req.params;
    const memeId = parseInt(id);
    const tagIdInt = parseInt(tagId);
    
    // Check if meme exists and belongs to user
    const meme = await prisma.meme.findUnique({
      where: { id: memeId }
    });
    
    if (!meme) {
      return res.status(404).json({ error: 'Meme not found' });
    }
    
    if (meme.userId !== req.user.id) {
      return res.status(403).json({ error: 'You can only remove tags from your own memes' });
    }
    
    await prisma.memeTag.deleteMany({
      where: {
        memeId: memeId,
        tagId: tagIdInt
      }
    });
    
    res.json({ message: 'Tag removed successfully' });
  } catch (error) {
    next(error);
  }
};

export const searchByTag = async (req, res, next) => {
  try {
    const { tagName } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const tag = await prisma.tag.findUnique({
      where: { name: tagName.toLowerCase() }
    });
    
    if (!tag) {
      return res.json({
        memes: [],
        pagination: {
          page,
          limit,
          total: 0,
          pages: 0
        }
      });
    }
    
    const [memes, total] = await Promise.all([
      prisma.meme.findMany({
        where: {
          tags: {
            some: {
              tagId: tag.id
            }
          }
        },
        include: {
          user: {
            select: {
              id: true,
              username: true
            }
          },
          _count: {
            select: {
              likes: true,
              comments: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.meme.count({
        where: {
          tags: {
            some: {
              tagId: tag.id
            }
          }
        }
      })
    ]);
    
    res.json({
      memes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

export const addTagsValidation = [
  body('tags')
    .isArray({ min: 1 })
    .withMessage('Tags must be an array with at least one tag')
    .custom((tags) => {
      if (!Array.isArray(tags)) return false;
      return tags.every(tag => typeof tag === 'string' && tag.trim().length > 0 && tag.trim().length <= 50);
    })
    .withMessage('Each tag must be a string between 1 and 50 characters')
];

