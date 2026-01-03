/**
 * Main Application Component
 * Handles routing between meme creation and feed views
 */

import { useState } from 'react';
import { VIEW_TYPES, AUTH_MODES } from './shared/config/constants';
import Header from './components/Header';
import MemeGenerator from './features/memes/MemeGenerator';
import MemeFeed from './features/feed/MemeFeed';
import AuthModal from './features/auth/AuthModal';

function App() {
  const [currentView, setCurrentView] = useState(VIEW_TYPES.CREATE);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState(AUTH_MODES.LOGIN);

  const handleOpenAuth = (mode) => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  return (
    <div className="app-wrapper">
      <Header
        currentView={currentView}
        onViewChange={setCurrentView}
        onOpenAuth={handleOpenAuth}
      />
      
      <div className="container">
        {currentView === VIEW_TYPES.CREATE ? <MemeGenerator /> : <MemeFeed />}
      </div>

      {showAuthModal && (
        <AuthModal
          mode={authMode}
          onClose={() => setShowAuthModal(false)}
        />
      )}
    </div>
  );
}

export default App;

