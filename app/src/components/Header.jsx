/**
 * Header Component
 * Navigation and authentication controls
 */

import { useAuth } from '../lib/instant';
import { VIEW_TYPES } from '../shared/config/constants';

const Header = ({ currentView, onViewChange, onOpenAuth }) => {
  const { isLoading, user, signOut } = useAuth();

  const handleAuthClick = () => {
    if (user) {
      signOut();
    } else {
      onOpenAuth('login');
    }
  };

  const viewTitles = {
    [VIEW_TYPES.CREATE]: {
      title: 'Meme Generator',
      subtitle: 'Create hilarious memes in seconds'
    },
    [VIEW_TYPES.FEED]: {
      title: 'Meme Feed',
      subtitle: 'Discover hilarious memes'
    }
  };

  const currentViewConfig = viewTitles[currentView];

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="app-title">{currentViewConfig.title}</h1>
          <p className="app-subtitle">{currentViewConfig.subtitle}</p>
        </div>
        <nav className="header-nav">
          <button
            className="nav-link"
            onClick={() => onViewChange(VIEW_TYPES.CREATE)}
            style={{ 
              background: 'transparent', 
              border: 'none', 
              cursor: 'pointer',
              fontWeight: currentView === VIEW_TYPES.CREATE ? '700' : '500'
            }}
            aria-current={currentView === VIEW_TYPES.CREATE ? 'page' : undefined}
          >
            Create
          </button>
          <button
            className="nav-link"
            onClick={() => onViewChange(VIEW_TYPES.FEED)}
            style={{ 
              background: 'transparent', 
              border: 'none', 
              cursor: 'pointer',
              fontWeight: currentView === VIEW_TYPES.FEED ? '700' : '500'
            }}
            aria-current={currentView === VIEW_TYPES.FEED ? 'page' : undefined}
          >
            Feed
          </button>
          <button
            className="auth-button"
            onClick={handleAuthClick}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : user ? 'Logout' : 'Login'}
          </button>
          {user && (
            <span className="user-info">
              Logged in as {user.email}
            </span>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;

