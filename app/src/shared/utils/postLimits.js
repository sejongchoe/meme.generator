/**
 * Post Limit Utilities
 * Handle daily posting limits for users
 */

const DAILY_POST_LIMIT = 5;

/**
 * Get today's date string (YYYY-MM-DD)
 */
export const getTodayString = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

/**
 * Check if user can post today
 * @param {object} user - User object with dailyPostCount and lastPostDate
 * @returns {object} - { canPost: boolean, remaining: number }
 */
export const checkPostLimit = (user) => {
  if (!user) {
    return { canPost: false, remaining: 0, reason: 'Not logged in' };
  }

  const today = getTodayString();
  const lastPostDate = user.lastPostDate || '';
  const dailyCount = user.dailyPostCount || 0;

  // If it's a new day, user can post
  if (lastPostDate !== today) {
    return { 
      canPost: true, 
      remaining: DAILY_POST_LIMIT,
      isNewDay: true
    };
  }

  // Check if limit reached
  if (dailyCount >= DAILY_POST_LIMIT) {
    return { 
      canPost: false, 
      remaining: 0,
      reason: `Daily limit of ${DAILY_POST_LIMIT} memes reached. Try again tomorrow!`
    };
  }

  return { 
    canPost: true, 
    remaining: DAILY_POST_LIMIT - dailyCount,
    isNewDay: false
  };
};

/**
 * Get user's current post count for today
 */
export const getRemainingPosts = (user) => {
  const { remaining } = checkPostLimit(user);
  return remaining;
};

/**
 * Get daily post limit
 */
export const getDailyLimit = () => DAILY_POST_LIMIT;

