import { useState } from 'react';
import { db, id } from '../lib/instant';

function MemeCard({ meme, currentUser }) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLike = async () => {
    if (!currentUser) {
      alert('You need to be logged in to like memes.');
      return;
    }

    try {
      if (meme.userLiked) {
        // Unlike - find and delete the like
        const userLike = meme.likes.find(like => like.userId === currentUser.id);
        if (userLike) {
          await db.transact([
            db.tx.likes[userLike.id].delete()
          ]);
        }
      } else {
        // Like - create new like
        await db.transact([
          db.tx.likes[id()].update({
            userId: currentUser.id,
            memeId: meme.id,
            createdAt: Date.now()
          })
        ]);
      }
    } catch (error) {
      console.error('Failed to update like:', error);
      alert('Failed to update like: ' + error.message);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      alert('You need to be logged in to comment.');
      return;
    }

    if (!commentText.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await db.transact([
        db.tx.comments[id()].update({
          userId: currentUser.id,
          memeId: meme.id,
          content: commentText.trim(),
          createdAt: Date.now()
        })
      ]);
      
      setCommentText('');
    } catch (error) {
      console.error('Failed to add comment:', error);
      alert('Failed to add comment: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 7) {
      return date.toLocaleDateString();
    } else if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  return (
    <div className="meme-card" data-id={meme.id}>
      <div className="meme-header">
        <span className="meme-author">
          {meme.user?.email || 'Unknown User'}
        </span>
        <span className="meme-date">{formatDate(meme.createdAt)}</span>
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
        >
          <span className="like-icon">{meme.userLiked ? '❤️' : '🤍'}</span>
          <span className="like-count">{meme.likesCount}</span>
        </button>
        <button
          className="comment-btn"
          onClick={() => setShowComments(!showComments)}
        >
          <span className="comment-icon">💬</span>
          <span className="comment-count">{meme.commentsCount}</span>
        </button>
      </div>

      {showComments && (
        <div className="meme-comments" style={{ display: 'block' }}>
          <div className="comments-list">
            {meme.sortedComments.length === 0 ? (
              <p className="no-comments">No comments yet. Be the first!</p>
            ) : (
              meme.sortedComments.map((comment) => (
                <div key={comment.id} className="comment-item">
                  <span className="comment-author">
                    {comment.user?.email || 'Unknown User'}
                  </span>
                  <span className="comment-content">{comment.content}</span>
                  <span className="comment-date">{formatDate(comment.createdAt)}</span>
                </div>
              ))
            )}
          </div>

          {currentUser ? (
            <form className="add-comment" onSubmit={handleCommentSubmit}>
              <input
                type="text"
                className="comment-input"
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                disabled={isSubmitting}
              />
              <button
                type="submit"
                className="comment-submit-btn"
                disabled={isSubmitting || !commentText.trim()}
              >
                {isSubmitting ? 'Posting...' : 'Post'}
              </button>
            </form>
          ) : (
            <p className="login-prompt">Login to add a comment</p>
          )}
        </div>
      )}
    </div>
  );
}

export default MemeCard;

