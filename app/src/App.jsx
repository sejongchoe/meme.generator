import { useState } from 'react';
import { useAuth } from './lib/instant';
import Header from './components/Header';
import MemeGenerator from './components/MemeGenerator';
import MemeFeed from './components/MemeFeed';
import AuthModal from './components/AuthModal';

function App() {
  const [currentView, setCurrentView] = useState('create'); // 'create' or 'feed'
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'

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
        {currentView === 'create' ? <MemeGenerator /> : <MemeFeed />}
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

