import { useAuth } from '../lib/instant';

function Header({ currentView, onViewChange, onOpenAuth }) {
  const { isLoading, user, signOut } = useAuth();

  const handleAuthClick = () => {
    if (user) {
      signOut();
    } else {
      onOpenAuth('login');
    }
  };

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="app-title">
            {currentView === 'create' ? 'Meme Generator' : 'Meme Feed'}
          </h1>
          <p className="app-subtitle">
            {currentView === 'create' 
              ? 'Create hilarious memes in seconds' 
              : 'Discover hilarious memes'}
          </p>
        </div>
        <nav className="header-nav">
          <button
            className="nav-link"
            onClick={() => onViewChange('create')}
            style={{ 
              background: 'transparent', 
              border: 'none', 
              cursor: 'pointer',
              fontWeight: currentView === 'create' ? '700' : '500'
            }}
          >
            Create
          </button>
          <button
            className="nav-link"
            onClick={() => onViewChange('feed')}
            style={{ 
              background: 'transparent', 
              border: 'none', 
              cursor: 'pointer',
              fontWeight: currentView === 'feed' ? '700' : '500'
            }}
          >
            Feed
          </button>
          <button
            id="authButton"
            className="auth-button"
            onClick={handleAuthClick}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : user ? 'Logout' : 'Login'}
          </button>
          {user && (
            <span id="userInfo" className="user-info">
              Logged in as {user.email}
            </span>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;

