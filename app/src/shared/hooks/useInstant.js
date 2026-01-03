/**
 * Custom InstantDB Hooks
 * Advanced hooks for common InstantDB operations
 */

import { useCallback } from 'react';
import { db, id } from '../../lib/instant';
import { getTodayString } from '../utils/postLimits';

/**
 * Hook for creating a meme with daily limit tracking
 */
export const useCreateMeme = () => {
  const createMeme = useCallback(async (memeData, currentUser) => {
    const { title, imageUrl, textElements, userId } = memeData;
    const today = getTodayString();
    
    // Determine if this is a new day
    const isNewDay = !currentUser || currentUser.lastPostDate !== today;
    const newCount = isNewDay ? 1 : (currentUser?.dailyPostCount || 0) + 1;
    
    // Create meme ID
    const memeId = id();
    
    // Check if user record exists, if not create it
    const transactions = [
      // Create the meme
      db.tx.memes[memeId].update({
        title,
        imageUrl,
        textElements,
        createdAt: Date.now(),
        userId,
        likesCount: 0,
        commentsCount: 0
      })
    ];
    
    // Only update user record if currentUser exists and has an id
    if (currentUser && userId) {
      // Check if user record exists, create or update
      transactions.push(
        db.tx.users[userId].update({
          email: currentUser.email || '',
          username: currentUser.email?.split('@')[0] || 'user',
          dailyPostCount: newCount,
          lastPostDate: today,
          createdAt: currentUser.createdAt || Date.now()
        })
      );
    }
    
    await db.transact(transactions);
    
    return memeId;
  }, []);

  return { createMeme };
};

/**
 * Hook for liking/unliking a meme
 */
export const useToggleLike = () => {
  const toggleLike = useCallback(async (memeId, userId, isLiked, existingLikeId) => {
    if (isLiked && existingLikeId) {
      // Unlike
      await db.transact([
        db.tx.likes[existingLikeId].delete()
      ]);
    } else {
      // Like
      await db.transact([
        db.tx.likes[id()].update({
          userId,
          memeId,
          createdAt: Date.now()
        })
      ]);
    }
  }, []);

  return { toggleLike };
};

/**
 * Hook for adding a comment
 */
export const useAddComment = () => {
  const addComment = useCallback(async (memeId, userId, content) => {
    await db.transact([
      db.tx.comments[id()].update({
        userId,
        memeId,
        content: content.trim(),
        createdAt: Date.now()
      })
    ]);
  }, []);

  return { addComment };
};

/**
 * Hook for uploading images to InstantDB Storage
 */
export const useUploadImage = () => {
  const uploadImage = useCallback(async (blob, userId) => {
    const fileName = `meme-${Date.now()}-${userId}.png`;
    const { url } = await db.storage.upload(fileName, blob);
    return url;
  }, []);

  return { uploadImage };
};

