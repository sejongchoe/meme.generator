/**
 * Comment Section Component
 * Displays and manages comments for a meme
 */

import { useState } from 'react';
import { useAddComment } from '../../../shared/hooks/useInstant';
import { formatRelativeTime } from '../../../shared/utils/formatters';

const CommentSection = ({ memeId, comments, currentUser }) => {
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addComment } = useAddComment();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      alert('You need to be logged in to comment.');
      return;
    }

    if (!commentText.trim()) return;

    setIsSubmitting(true);

    try {
      await addComment(memeId, currentUser.id, commentText);
      setCommentText('');
    } catch (error) {
      console.error('Failed to add comment:', error);
      alert('Failed to add comment: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="meme-comments" style={{ display: 'block' }}>
      <div className="comments-list">
        {comments.length === 0 ? (
          <p className="no-comments">No comments yet. Be the first!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="comment-item">
              <span className="comment-author">
                {comment.user?.email || 'Unknown User'}
              </span>
              <span className="comment-content">{comment.content}</span>
              <span className="comment-date">{formatRelativeTime(comment.createdAt)}</span>
            </div>
          ))
        )}
      </div>

      {currentUser ? (
        <form className="add-comment" onSubmit={handleSubmit}>
          <input
            type="text"
            className="comment-input"
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            disabled={isSubmitting}
            maxLength={500}
            aria-label="Comment input"
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
  );
};

export default CommentSection;

