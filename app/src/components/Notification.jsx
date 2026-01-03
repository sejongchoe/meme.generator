/**
 * Notification Component
 * Beautiful popup notifications for user feedback
 */

import { useEffect } from 'react';

const Notification = ({ message, type = 'success', onClose, duration = 4000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'info':
        return 'ℹ';
      default:
        return '✓';
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'var(--orange-color)',
          border: 'var(--orange-light)',
          icon: '#fff'
        };
      case 'error':
        return {
          bg: '#ff4444',
          border: '#ff6666',
          icon: '#fff'
        };
      case 'info':
        return {
          bg: 'var(--primary-color)',
          border: 'var(--border-hover)',
          icon: 'var(--orange-color)'
        };
      default:
        return {
          bg: 'var(--orange-color)',
          border: 'var(--orange-light)',
          icon: '#fff'
        };
    }
  };

  const colors = getColors();

  return (
    <div
      style={{
        position: 'fixed',
        top: '2rem',
        right: '2rem',
        zIndex: 9999,
        background: colors.bg,
        color: '#fff',
        padding: '1rem 1.5rem',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4), 0 0 0 1px ' + colors.border,
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        minWidth: '320px',
        maxWidth: '500px',
        animation: 'slideInRight 0.3s ease-out',
        cursor: 'pointer'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
          fontWeight: 'bold',
          color: colors.icon,
          flexShrink: 0
        }}
      >
        {getIcon()}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, fontSize: '0.9375rem', lineHeight: 1.4 }}>
          {message}
        </div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#fff',
          fontSize: '20px',
          cursor: 'pointer',
          padding: '0.25rem',
          opacity: 0.7,
          transition: 'opacity 0.2s',
          lineHeight: 1
        }}
        onMouseEnter={(e) => e.target.style.opacity = '1'}
        onMouseLeave={(e) => e.target.style.opacity = '0.7'}
      >
        ×
      </button>
      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default Notification;

