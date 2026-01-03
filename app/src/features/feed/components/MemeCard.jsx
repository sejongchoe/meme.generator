/**
 * Meme Card Component
 * Displays individual meme with like and comment functionality
 */

import { useState } from 'react';
import { useToggleLike, useAddComment } from '../../../shared/hooks/useInstant';
import { formatRelativeTime } from '../../../shared/utils/formatters';
import CommentSection from './CommentSection';

const MemeCard = ({ meme, currentUser }) => {
  const [showComments, setShowComments] = useState(false);
  const { toggleLike } = useToggleLike();

  const handleLike = async () => {
    if (!currentUser) {
      alert('You need to be logged in to like memes.');
      return;
    }

    try {
      await toggleLike(
        meme.id,
        currentUser.id,
        meme.userLiked,
        meme.userLikeId
      );
    } catch (error) {
      console.error('Failed to update like:', error);
      alert('Failed to update like: ' + error.message);
    }
  };

  return (
    <div className="meme-card">
      <div className="meme-header">
        <span className="meme-author">
          {meme.user?.email || 'Unknown User'}
        </span>
        <span className="meme-date">{formatRelativeTime(meme.createdAt)}</span>
      </div>
      
      <h3 className="meme-title">{meme.title}</h3>
      
      <div className="meme-image-container">
        <img
          src={meme.imageUrl}
          alt={meme.title}
          className="meme-image"
          loading="lazy"
        />
      </div>

      <div className="meme-actions">
        <button
          className={`like-btn ${meme.userLiked ? 'liked' : ''}`}
          onClick={handleLike}
          aria-label={meme.userLiked ? 'Unlike meme' : 'Like meme'}
        >
          <span className="like-icon" aria-hidden="true">
            {meme.userLiked ? '❤️' : '🤍'}
          </span>
          <span className="like-count">{meme.likesCount}</span>
        </button>
        <button
          className="comment-btn"
          onClick={() => setShowComments(!showComments)}
          aria-label={`${showComments ? 'Hide' : 'Show'} comments`}
        >
          <span className="comment-icon" aria-hidden="true">💬</span>
          <span className="comment-count">{meme.commentsCount}</span>
        </button>
      </div>

      {showComments && (
        <CommentSection
          memeId={meme.id}
          comments={meme.sortedComments}
          currentUser={currentUser}
        />
      )}
    </div>
  );
};

export default MemeCard;

