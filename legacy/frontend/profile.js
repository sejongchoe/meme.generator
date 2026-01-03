// User Profile Page Script

import { userAPI, authAPI } from './api.js';
import { initAuth, updateAuthUI } from './auth.js';

let currentUsername = null;
let currentPage = 1;
const limit = 20;

const profileContainer = document.getElementById('profileContainer');
const userMemesGrid = document.getElementById('userMemesGrid');
const pagination = document.getElementById('pagination');
const usernameDisplay = document.getElementById('usernameDisplay');
const profileSubtitle = document.getElementById('profileSubtitle');

// Initialize
initAuth();

// Get username from URL
const urlParams = new URLSearchParams(window.location.search);
const username = urlParams.get('username');

if (!username) {
    // If no username in URL, try to get current user
    const currentUser = authAPI.getCurrentUser();
    if (currentUser) {
        currentUsername = currentUser.username;
        window.history.replaceState({}, '', `?username=${currentUsername}`);
        loadProfile();
    } else {
        profileContainer.innerHTML = '<div class="error">Please provide a username in the URL or login to view your profile.</div>';
    }
} else {
    currentUsername = username;
    loadProfile();
}

async function loadProfile() {
    try {
        // Load user profile
        const profileData = await userAPI.getProfile(currentUsername);
        renderProfile(profileData.user);
        
        // Load user memes
        loadUserMemes();
    } catch (error) {
        profileContainer.innerHTML = `<div class="error">Failed to load profile: ${error.message}</div>`;
    }
}

function renderProfile(user) {
    usernameDisplay.textContent = user.username;
    profileSubtitle.textContent = `Member since ${formatDate(user.createdAt)}`;
    
    profileContainer.innerHTML = `
        <div class="profile-card">
            <div class="profile-header">
                <h2 class="profile-username">@${user.username}</h2>
                <div class="profile-stats">
                    <div class="stat-item">
                        <span class="stat-value">${user._count?.memes || 0}</span>
                        <span class="stat-label">Memes</span>
                    </div>
                </div>
            </div>
            <div class="profile-info">
                <p class="profile-joined">Joined ${formatDate(user.createdAt)}</p>
            </div>
        </div>
    `;
}

async function loadUserMemes() {
    try {
        const data = await userAPI.getUserMemes(currentUsername, currentPage, limit);
        renderUserMemes(data.memes);
        renderPagination(data.pagination);
    } catch (error) {
        userMemesGrid.innerHTML = `<div class="error">Failed to load memes: ${error.message}</div>`;
    }
}

function renderUserMemes(memes) {
    if (memes.length === 0) {
        userMemesGrid.innerHTML = '<div class="no-memes">No memes yet. <a href="index.html">Create your first meme!</a></div>';
        return;
    }
    
    userMemesGrid.innerHTML = memes.map(meme => `
        <div class="meme-card" data-id="${meme.id}">
            <div class="meme-header">
                <span class="meme-date">${formatDate(meme.createdAt)}</span>
            </div>
            <h3 class="meme-title">${escapeHtml(meme.title)}</h3>
            <div class="meme-image-container">
                <img src="${meme.imageUrl.startsWith('http') ? meme.imageUrl : 'http://localhost:3000' + meme.imageUrl}" alt="${escapeHtml(meme.title)}" class="meme-image" loading="lazy">
            </div>
            <div class="meme-actions">
                <span class="like-count">❤️ ${meme._count?.likes || meme.likesCount || 0}</span>
                <span class="comment-count">💬 ${meme._count?.comments || meme.commentsCount || 0}</span>
            </div>
        </div>
    `).join('');
}

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
    loadUserMemes();
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

