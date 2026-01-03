// Authentication UI and Logic

import { authAPI } from './api.js';

let authModal = null;
let currentAuthMode = 'login'; // 'login' or 'register'

export function initAuth() {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      createAuthModal();
      updateAuthUI();
      checkAuthStatus();
    });
  } else {
    createAuthModal();
    updateAuthUI();
    checkAuthStatus();
  }
}

function checkAuthStatus() {
  // Check if user is already logged in
  if (authAPI.isAuthenticated()) {
    authAPI.getMe().catch(() => {
      // Token invalid, logout
      authAPI.logout();
      updateAuthUI();
    });
  }
}

function createAuthModal() {
  authModal = document.createElement('div');
  authModal.id = 'authModal';
  authModal.className = 'auth-modal';
  authModal.innerHTML = `
    <div class="auth-modal-content">
      <span class="auth-modal-close">&times;</span>
      <div class="auth-tabs">
        <button class="auth-tab active" data-mode="login">Login</button>
        <button class="auth-tab" data-mode="register">Sign Up</button>
      </div>
      <div class="auth-form-container">
        <form id="authForm">
          <div id="registerFields" style="display: none;">
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" name="email" required>
            </div>
          </div>
          <div class="form-group">
            <label for="username">Username</label>
            <input type="text" id="username" name="username" required>
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" required>
          </div>
          <div id="authError" class="auth-error" style="display: none;"></div>
          <button type="submit" class="auth-submit-btn">
            <span id="authSubmitText">Login</span>
          </button>
        </form>
      </div>
    </div>
  `;
  document.body.appendChild(authModal);

  // Tab switching
  document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const mode = tab.dataset.mode;
      switchAuthMode(mode);
    });
  });

  // Form submission
  document.getElementById('authForm').addEventListener('submit', handleAuthSubmit);

  // Close modal
  document.querySelector('.auth-modal-close').addEventListener('click', closeAuthModal);
  authModal.addEventListener('click', (e) => {
    if (e.target === authModal) {
      closeAuthModal();
    }
  });
}

function switchAuthMode(mode) {
  currentAuthMode = mode;
  document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.mode === mode);
  });
  document.getElementById('registerFields').style.display = mode === 'register' ? 'block' : 'none';
  document.getElementById('authSubmitText').textContent = mode === 'register' ? 'Sign Up' : 'Login';
  document.getElementById('authError').style.display = 'none';
}

function closeAuthModal() {
  authModal.style.display = 'none';
  document.getElementById('authForm').reset();
  document.getElementById('authError').style.display = 'none';
}

export function openAuthModal(mode = 'login') {
  switchAuthMode(mode);
  authModal.style.display = 'flex';
}

async function handleAuthSubmit(e) {
  e.preventDefault();
  const errorDiv = document.getElementById('authError');
  errorDiv.style.display = 'none';

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  const email = document.getElementById('email').value.trim();

  try {
    if (currentAuthMode === 'register') {
      if (!email) {
        throw new Error('Email is required');
      }
      await authAPI.register(username, email, password);
    } else {
      await authAPI.login(username, password);
    }
    
    closeAuthModal();
    updateAuthUI();
    
    // Show success message
    showNotification(currentAuthMode === 'register' ? 'Account created successfully!' : 'Logged in successfully!');
  } catch (error) {
    errorDiv.textContent = error.message || 'An error occurred';
    errorDiv.style.display = 'block';
  }
}

export function logout() {
  authAPI.logout();
  updateAuthUI();
  showNotification('Logged out successfully');
  if (window.location.pathname.includes('feed.html')) {
    window.location.href = 'index.html';
  }
}

function updateAuthUI() {
  const user = authAPI.getCurrentUser();
  const authButton = document.getElementById('authButton');
  const userInfo = document.getElementById('userInfo');

  if (user && authButton) {
    authButton.textContent = 'Logout';
    authButton.onclick = logout;
    if (userInfo) {
      userInfo.textContent = `Logged in as ${user.username}`;
      userInfo.style.display = 'block';
    }
  } else if (authButton) {
    authButton.textContent = 'Login';
    authButton.onclick = () => openAuthModal('login');
    if (userInfo) {
      userInfo.style.display = 'none';
    }
  }
}

function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Export updateAuthUI for use in other files
export { updateAuthUI };

