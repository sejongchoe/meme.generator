import { useState } from 'react';
import { useAuth } from '../lib/instant';

function AuthModal({ mode: initialMode, onClose }) {
  const [mode, setMode] = useState(initialMode); // 'login' or 'signup'
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { signInWithMagicCode } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (!email.trim()) {
      setError('Email is required');
      setIsSubmitting(false);
      return;
    }

    try {
      // InstantDB uses magic codes for authentication
      // Send a magic code to the email
      await signInWithMagicCode({ email: email.trim() });
      
      // Show success message
      alert('Check your email for a magic code to sign in!');
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="auth-modal" style={{ display: 'flex' }} onClick={handleOverlayClick}>
      <div className="auth-modal-content">
        <span className="auth-modal-close" onClick={onClose}>&times;</span>
        
        <div className="auth-tabs">
          <button
            className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => setMode('login')}
          >
            Login
          </button>
          <button
            className={`auth-tab ${mode === 'signup' ? 'active' : ''}`}
            onClick={() => setMode('signup')}
          >
            Sign Up
          </button>
        </div>

        <div className="auth-form-container">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                disabled={isSubmitting}
              />
            </div>

            {error && (
              <div className="auth-error" style={{ display: 'block' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={isSubmitting}
            >
              <span id="authSubmitText">
                {isSubmitting ? 'Sending...' : mode === 'signup' ? 'Sign Up' : 'Login'}
              </span>
            </button>

            <p style={{ 
              marginTop: '1rem', 
              fontSize: '0.875rem', 
              color: 'var(--text-muted)',
              textAlign: 'center'
            }}>
              We'll send you a magic code to sign in.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AuthModal;

