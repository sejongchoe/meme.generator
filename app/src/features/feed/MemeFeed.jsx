/**
 * Meme Feed Component
 * Displays real-time feed of memes with search and sort
 */

import { useState, useMemo } from 'react';
import { useQuery, useAuth } from '../../lib/instant';
import { SORT_OPTIONS } from '../../shared/config/constants';
import MemeCard from './components/MemeCard';
import FeedControls from './components/FeedControls';

const MemeFeed = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState(SORT_OPTIONS.NEWEST);
  
  // Real-time query for all memes
  const { isLoading, error, data } = useQuery({
    memes: {
      user: {},
      likes: {
        user: {}
      },
      comments: {
        user: {}
      }
    }
  });

  // Process and filter memes
  const memes = useMemo(() => {
    if (!data?.memes) return [];

    let processedMemes = data.memes.map(meme => {
      const likes = meme.likes || [];
      const comments = meme.comments || [];
      const userLike = likes.find(like => like.userId === user?.id);
      
      return {
        ...meme,
        likesCount: likes.length,
        commentsCount: comments.length,
        userLiked: !!userLike,
        userLikeId: userLike?.id || null,
        sortedComments: comments.sort((a, b) => a.createdAt - b.createdAt)
      };
    });

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      processedMemes = processedMemes.filter(meme =>
        meme.title.toLowerCase().includes(query) ||
        meme.user?.email?.toLowerCase().includes(query)
      );
    }

    // Apply sort
    switch (sortBy) {
      case SORT_OPTIONS.POPULAR:
        processedMemes.sort((a, b) => b.likesCount - a.likesCount);
        break;
      case SORT_OPTIONS.MOST_COMMENTED:
        processedMemes.sort((a, b) => b.commentsCount - a.commentsCount);
        break;
      case SORT_OPTIONS.NEWEST:
      default:
        processedMemes.sort((a, b) => b.createdAt - a.createdAt);
        break;
    }

    return processedMemes;
  }, [data, searchQuery, sortBy, user]);

  // Debug logging
  console.log('Feed data:', { isLoading, error, memesCount: data?.memes?.length, memes: data?.memes });

  if (isLoading) {
    return (
      <div className="loading">
        Loading memes...
      </div>
    );
  }

  if (error) {
    console.error('Feed error:', error);
    return (
      <div className="error">
        Failed to load feed: {error.message}
      </div>
    );
  }

  return (
    <>
      <FeedControls
        searchQuery={searchQuery}
        sortBy={sortBy}
        onSearchChange={setSearchQuery}
        onSortChange={setSortBy}
      />

      <div className="feed-container">
        {memes.length === 0 ? (
          <div className="no-memes">
            {searchQuery ? 'No memes found matching your search.' : 'No memes yet. Be the first to post one!'}
          </div>
        ) : (
          memes.map((meme) => (
            <MemeCard key={meme.id} meme={meme} currentUser={user} />
          ))
        )}
      </div>
      
      {/* Debug info */}
      {data?.memes && (
        <div style={{ 
          position: 'fixed', 
          bottom: '1rem', 
          left: '1rem', 
          background: 'var(--card-bg)', 
          padding: '0.5rem 1rem',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          border: '1px solid var(--border-color)'
        }}>
          Total memes in database: {data.memes.length}
        </div>
      )}
    </>
  );
};

export default MemeFeed;

