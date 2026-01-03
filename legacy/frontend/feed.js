// Feed Page Script

import { feedAPI, memeAPI, authAPI } from './api.js';
import { initAuth, updateAuthUI, openAuthModal } from './auth.js';

let currentPage = 1;
let currentSort = 'newest';
let currentQuery = '';
const limit = 20;

const feedContainer = document.getElementById('feedContainer');
const loading = document.getElementById('loading');
const pagination = document.getElementById('pagination');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const sortSelect = document.getElementById('sortSelect');

// Initialize
initAuth();
loadFeed();

// Event listeners
searchBtn.addEventListener('click', handleSearch);
searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    handleSearch();
  }
});
sortSelect.addEventListener('change', (e) => {
  currentSort = e.target.value;
  currentPage = 1;
  if (currentQuery) {
    performSearch();
  } else {
    loadFeed();
  }
});

async function loadFeed() {
  loading.style.display = 'block';
  feedContainer.innerHTML = '';
  
  try {
    const data = await feedAPI.getFeed(currentPage, limit, currentSort);
    renderMemes(data.memes);
    renderPagination(data.pagination);
  } catch (error) {
    feedContainer.innerHTML = `<div class="error">Failed to load feed: ${error.message}</div>`;
  } finally {
    loading.style.display = 'none';
  }
}

async function performSearch() {
  if (!currentQuery.trim()) {
    loadFeed();
    return;
  }
  
  loading.style.display = 'block';
  feedContainer.innerHTML = '';
  
  try {
    const data = await feedAPI.search(currentQuery, currentPage, limit);
    renderMemes(data.memes);
    renderPagination(data.pagination);
  } catch (error) {
    feedContainer.innerHTML = `<div class="error">Search failed: ${error.message}</div>`;
  } finally {
    loading.style.display = 'none';
  }
}

function handleSearch() {
  currentQuery = searchInput.value.trim();
  currentPage = 1;
  if (currentQuery) {
    performSearch();
  } else {
    loadFeed();
  }
}

function renderMemes(memes) {
  if (memes.length === 0) {
    feedContainer.innerHTML = '<div class="no-memes">No memes found. Be the first to post one!</div>';
    return;
  }
  
  feedContainer.innerHTML = memes.map(meme => `
    <div class="meme-card" data-id="${meme.id}">
      <div class="meme-header">
                    <a href="profile.html?username=${meme.user.username}" class="meme-author">@${meme.user.username}</a>
                    <span class="meme-date">${formatDate(meme.createdAt)}</span>
      </div>
      <h3 class="meme-title">${escapeHtml(meme.title)}</h3>
      <div class="meme-image-container">
        <img src="${meme.imageUrl.startsWith('http') ? meme.imageUrl : 'http://localhost:3000' + meme.imageUrl}" alt="${escapeHtml(meme.title)}" class="meme-image" loading="lazy">
      </div>
      <div class="meme-actions">
        <button class="like-btn ${meme.userLiked ? 'liked' : ''}" data-meme-id="${meme.id}">
          <span class="like-icon">${meme.userLiked ? '❤️' : '🤍'}</span>
          <span class="like-count">${meme._count?.likes || meme.likesCount || 0}</span>
        </button>
        <button class="comment-btn" data-meme-id="${meme.id}">
          <span class="comment-icon">💬</span>
          <span class="comment-count">${meme._count?.comments || meme.commentsCount || 0}</span>
        </button>
      </div>
      <div class="meme-comments" id="comments-${meme.id}" style="display: none;"></div>
    </div>
  `).join('');
  
  // Add event listeners
  document.querySelectorAll('.like-btn').forEach(btn => {
    btn.addEventListener('click', handleLike);
  });
  
  document.querySelectorAll('.comment-btn').forEach(btn => {
    btn.addEventListener('click', handleCommentClick);
  });
}

async function handleLike(e) {
  if (!authAPI.isAuthenticated()) {
    if (confirm('You need to be logged in to like memes. Would you like to login now?')) {
      openAuthModal('login');
    }
    return;
  }
  
  const memeId = parseInt(e.currentTarget.dataset.memeId);
  const isLiked = e.currentTarget.classList.contains('liked');
  
  try {
    if (isLiked) {
      await memeAPI.unlike(memeId);
      e.currentTarget.classList.remove('liked');
      const countEl = e.currentTarget.querySelector('.like-count');
      countEl.textContent = parseInt(countEl.textContent) - 1;
      e.currentTarget.querySelector('.like-icon').textContent = '🤍';
    } else {
      await memeAPI.like(memeId);
      e.currentTarget.classList.add('liked');
      const countEl = e.currentTarget.querySelector('.like-count');
      countEl.textContent = parseInt(countEl.textContent) + 1;
      e.currentTarget.querySelector('.like-icon').textContent = '❤️';
    }
  } catch (error) {
    alert('Failed to update like: ' + error.message);
  }
}

async function handleCommentClick(e) {
  const memeId = parseInt(e.currentTarget.dataset.memeId);
  const commentsDiv = document.getElementById(`comments-${memeId}`);
  
  if (commentsDiv.style.display === 'none') {
    // Load and show comments
    try {
      const data = await memeAPI.getComments(memeId);
      renderComments(commentsDiv, memeId, data.comments);
      commentsDiv.style.display = 'block';
    } catch (error) {
      alert('Failed to load comments: ' + error.message);
    }
  } else {
    commentsDiv.style.display = 'none';
  }
}

function renderComments(container, memeId, comments) {
  const user = authAPI.getCurrentUser();
  
  container.innerHTML = `
    <div class="comments-list">
      ${comments.length === 0 ? '<p class="no-comments">No comments yet. Be the first!</p>' : ''}
      ${comments.map(comment => `
        <div class="comment-item">
          <span class="comment-author">@${comment.user.username}</span>
          <span class="comment-content">${escapeHtml(comment.content)}</span>
          <span class="comment-date">${formatDate(comment.createdAt)}</span>
        </div>
      `).join('')}
    </div>
    ${user ? `
      <div class="add-comment">
        <input type="text" class="comment-input" id="comment-input-${memeId}" placeholder="Add a comment...">
        <button class="comment-submit-btn" onclick="submitComment(${memeId})">Post</button>
      </div>
    ` : '<p class="login-prompt">Login to add a comment</p>'}
  `;
}

window.submitComment = async function(memeId) {
  if (!authAPI.isAuthenticated()) {
    openAuthModal('login');
    return;
  }
  
  const input = document.getElementById(`comment-input-${memeId}`);
  const content = input.value.trim();
  
  if (!content) {
    return;
  }
  
  try {
    await memeAPI.addComment(memeId, content);
    input.value = '';
    
    // Reload comments
    const data = await memeAPI.getComments(memeId);
    const commentsDiv = document.getElementById(`comments-${memeId}`);
    renderComments(commentsDiv, memeId, data.comments);
  } catch (error) {
    alert('Failed to add comment: ' + error.message);
  }
};

function renderPagination(paginationData) {
  if (paginationData.pages <= 1) {
    pagination.innerHTML = '';
    return;
  }
  
  let html = '<div class="pagination-controls">';
  
  if (paginationData.page > 1) {
    html += `<button class="page-btn" onclick="goToPage(${paginationData.page - 1})">Previous</button>`;
  }
  
  html += `<span class="page-info">Page ${paginationData.page} of ${paginationData.pages}</span>`;
  
  if (paginationData.page < paginationData.pages) {
    html += `<button class="page-btn" onclick="goToPage(${paginationData.page + 1})">Next</button>`;
  }
  
  html += '</div>';
  pagination.innerHTML = html;
}

window.goToPage = function(page) {
  currentPage = page;
  if (currentQuery) {
    performSearch();
  } else {
    loadFeed();
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 7) {
    return date.toLocaleDateString();
  } else if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else {
    return 'Just now';
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

