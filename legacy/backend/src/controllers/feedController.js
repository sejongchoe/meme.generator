import { prisma } from '../utils/prisma.js';

export const getFeed = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const sort = req.query.sort || 'newest';
    const skip = (page - 1) * limit;
    
    // Determine sort order
    let orderBy;
    switch (sort) {
      case 'popular':
        orderBy = { likesCount: 'desc' };
        break;
      case 'most_commented':
        orderBy = { commentsCount: 'desc' };
        break;
      case 'newest':
      default:
        orderBy = { createdAt: 'desc' };
        break;
    }
    
    const [memes, total] = await Promise.all([
      prisma.meme.findMany({
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
        orderBy,
        skip,
        take: limit
      }),
      prisma.meme.count()
    ]);
    
    // If user is authenticated, check which memes they've liked
    if (req.user) {
      const memeIds = memes.map(m => m.id);
      const userLikes = await prisma.like.findMany({
        where: {
          userId: req.user.id,
          memeId: { in: memeIds }
        },
        select: { memeId: true }
      });
      
      const likedMemeIds = new Set(userLikes.map(l => l.memeId));
      memes.forEach(meme => {
        meme.userLiked = likedMemeIds.has(meme.id);
      });
    }
    
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

export const searchMemes = async (req, res, next) => {
  try {
    const query = req.query.q || '';
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    if (!query.trim()) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    // Search in title (textElements JSON search is complex, so we'll search title for now)
    const [memes, total] = await Promise.all([
      prisma.meme.findMany({
        where: {
          title: { contains: query, mode: 'insensitive' }
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
          title: { contains: query, mode: 'insensitive' }
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

