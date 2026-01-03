import { prisma } from '../utils/prisma.js';

export const getUserProfile = async (req, res, next) => {
  try {
    const { username } = req.params;
    
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        createdAt: true,
        _count: {
          select: {
            memes: true
          }
        }
      }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ user });
  } catch (error) {
    next(error);
  }
};

export const getUserMemes = async (req, res, next) => {
  try {
    const { username } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const user = await prisma.user.findUnique({
      where: { username },
      select: { id: true }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const [memes, total] = await Promise.all([
      prisma.meme.findMany({
        where: { userId: user.id },
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
        where: { userId: user.id }
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


