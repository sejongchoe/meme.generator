/**
 * Authentication Modal Component
 * Handles user login and signup with magic code authentication
 */

import { useState } from 'react';
import { db } from '../../lib/instant';
import { AUTH_MODES } from '../../shared/config/constants';

const AuthModal = ({ mode: initialMode, onClose }) => {
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sentCode, setSentCode] = useState(false);

  const handleSendCode = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      // InstantDB sends magic code automatically when you call this
      await db.auth.sendMagicCode({ email: email.trim() });
      setSentCode(true);
      setError('');
    } catch (err) {
      console.error('Send code error:', err);
      setError(err.body?.message || err.message || 'Failed to send code. Please try again.');
      setSentCode(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError('');

    if (!code.trim()) {
      setError('Please enter the code from your email');
      return;
    }

    setIsSubmitting(true);

    try {
      await db.auth.signInWithMagicCode({ email: email.trim(), code: code.trim() });
      onClose();
    } catch (err) {
      console.error('Verify code error:', err);
      setError(err.body?.message || err.message || 'Invalid code. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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
            className={`auth-tab ${mode === AUTH_MODES.LOGIN ? 'active' : ''}`}
            onClick={() => setMode(AUTH_MODES.LOGIN)}
          >
            Login
          </button>
          <button
            className={`auth-tab ${mode === AUTH_MODES.SIGNUP ? 'active' : ''}`}
            onClick={() => setMode(AUTH_MODES.SIGNUP)}
          >
            Sign Up
          </button>
        </div>

        <div className="auth-form-container">
          {sentCode ? (
            <form onSubmit={handleVerifyCode}>
              <div className="auth-success" style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Check your email!</h3>
                <p style={{ color: 'var(--text-light)' }}>We sent a magic code to <strong>{email}</strong></p>
              </div>

              <div className="form-group">
                <label htmlFor="code">Enter Code</label>
                <input
                  type="text"
                  id="code"
                  name="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  required
                  disabled={isSubmitting}
                  autoFocus
                  maxLength={6}
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
                disabled={isSubmitting || !code.trim()}
              >
                <span>{isSubmitting ? 'Verifying...' : 'Verify Code'}</span>
              </button>

              <button 
                type="button"
                className="auth-submit-btn" 
                onClick={() => {
                  setSentCode(false);
                  setCode('');
                  setError('');
                }}
                style={{ marginTop: '0.5rem', background: 'var(--primary-color)', border: '1px solid var(--border-color)' }}
              >
                Use different email
              </button>
            </form>
          ) : (
            <form onSubmit={handleSendCode}>
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
                  autoFocus
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
                disabled={isSubmitting || !email.trim()}
              >
                <span>
                  {isSubmitting ? 'Sending...' : 'Send Magic Code'}
                </span>
              </button>

              <p className="auth-hint" style={{ marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                We'll send you a magic code to sign in.
                <br />
                No password needed!
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;

