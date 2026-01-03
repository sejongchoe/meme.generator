/**
 * Feed Controls Component
 * Search and sort controls for the meme feed
 */

import { SORT_OPTIONS } from '../../../shared/config/constants';

const FeedControls = ({ searchQuery, sortBy, onSearchChange, onSortChange }) => {
  const handleSearch = (e) => {
    e.preventDefault();
    // Search is handled by the parent component
  };

  return (
    <div className="feed-controls">
      <form className="search-section" onSubmit={handleSearch}>
        <input
          type="text"
          className="search-input"
          placeholder="Search memes by title or author..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search memes"
        />
        <button type="submit" className="search-btn">
          Search
        </button>
      </form>
      
      <div className="sort-section">
        <label htmlFor="sortSelect">Sort by:</label>
        <select
          id="sortSelect"
          className="sort-select"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          aria-label="Sort memes"
        >
          <option value={SORT_OPTIONS.NEWEST}>Newest</option>
          <option value={SORT_OPTIONS.POPULAR}>Most Liked</option>
          <option value={SORT_OPTIONS.MOST_COMMENTED}>Most Commented</option>
        </select>
      </div>
    </div>
  );
};

export default FeedControls;

