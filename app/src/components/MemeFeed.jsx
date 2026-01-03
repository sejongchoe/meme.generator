import { useState, useMemo } from 'react';
import { useQuery, useAuth, db, id } from '../lib/instant';
import MemeCard from './MemeCard';

function MemeFeed() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  
  // Real-time query for all memes with related data
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

  // Process and sort memes
  const memes = useMemo(() => {
    if (!data?.memes) return [];

    let processedMemes = data.memes.map(meme => ({
      ...meme,
      likesCount: meme.likes?.length || 0,
      commentsCount: meme.comments?.length || 0,
      userLiked: meme.likes?.some(like => like.userId === user?.id) || false,
      sortedComments: (meme.comments || []).sort((a, b) => a.createdAt - b.createdAt)
    }));

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      processedMemes = processedMemes.filter(meme =>
        meme.title.toLowerCase().includes(query) ||
        meme.user?.email?.toLowerCase().includes(query)
      );
    }

    // Sort memes
    switch (sortBy) {
      case 'popular':
        processedMemes.sort((a, b) => b.likesCount - a.likesCount);
        break;
      case 'most_commented':
        processedMemes.sort((a, b) => b.commentsCount - a.commentsCount);
        break;
      case 'newest':
      default:
        processedMemes.sort((a, b) => b.createdAt - a.createdAt);
        break;
    }

    return processedMemes;
  }, [data, searchQuery, sortBy, user]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Search is handled by useMemo above
  };

  if (isLoading) {
    return (
      <div className="loading" id="loading">
        Loading memes...
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        Failed to load feed: {error.message}
      </div>
    );
  }

  return (
    <>
      <div className="feed-controls">
        <form className="search-section" onSubmit={handleSearch}>
          <input
            type="text"
            id="searchInput"
            className="search-input"
            placeholder="Search memes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" id="searchBtn" className="search-btn">
            Search
          </button>
        </form>
        <div className="sort-section">
          <label htmlFor="sortSelect">Sort by:</label>
          <select
            id="sortSelect"
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest</option>
            <option value="popular">Most Liked</option>
            <option value="most_commented">Most Commented</option>
          </select>
        </div>
      </div>

      <div id="feedContainer" className="feed-container">
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
    </>
  );
}

export default MemeFeed;

