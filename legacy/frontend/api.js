// API Client for Meme Platform

const API_BASE_URL = 'http://localhost:3000/api';

// Get auth token from localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

// Set auth token in localStorage
const setToken = (token) => {
  localStorage.setItem('token', token);
};

// Remove auth token
const removeToken = () => {
  localStorage.removeItem('token');
};

// Get current user from localStorage
const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

// Set current user in localStorage
const setCurrentUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

// Remove current user
const removeCurrentUser = () => {
  localStorage.removeItem('user');
};

// Make API request
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Request failed');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Authentication API
export const authAPI = {
  register: async (username, email, password) => {
    const data = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password })
    });
    if (data.token) {
      setToken(data.token);
      setCurrentUser(data.user);
    }
    return data;
  },

  login: async (username, password) => {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
    if (data.token) {
      setToken(data.token);
      setCurrentUser(data.user);
    }
    return data;
  },

  logout: () => {
    removeToken();
    removeCurrentUser();
  },

  getMe: async () => {
    return await apiRequest('/auth/me');
  },

  isAuthenticated: () => {
    return !!getToken();
  },

  getCurrentUser: getCurrentUser
};

// Meme API
export const memeAPI = {
  create: async (imageBlob, title, textElements) => {
    const formData = new FormData();
    formData.append('image', imageBlob, 'meme.png');
    formData.append('title', title);
    formData.append('textElements', JSON.stringify(textElements));

    const token = getToken();
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/memes`, {
      method: 'POST',
      headers,
      body: formData
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to create meme');
    }
    return data;
  },

  getById: async (id) => {
    return await apiRequest(`/memes/${id}`);
  },

  delete: async (id) => {
    return await apiRequest(`/memes/${id}`, {
      method: 'DELETE'
    });
  },

  like: async (id) => {
    return await apiRequest(`/memes/${id}/like`, {
      method: 'POST'
    });
  },

  unlike: async (id) => {
    return await apiRequest(`/memes/${id}/like`, {
      method: 'DELETE'
    });
  },

  addComment: async (id, content) => {
    return await apiRequest(`/memes/${id}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content })
    });
  },

  getComments: async (id) => {
    return await apiRequest(`/memes/${id}/comments`);
  }
};

// Feed API
export const feedAPI = {
  getFeed: async (page = 1, limit = 20, sort = 'newest') => {
    return await apiRequest(`/feed?page=${page}&limit=${limit}&sort=${sort}`);
  },

  search: async (query, page = 1, limit = 20) => {
    return await apiRequest(`/feed/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
  }
};

// User API
export const userAPI = {
  getProfile: async (username) => {
    return await apiRequest(`/users/${username}`);
  },

  getUserMemes: async (username, page = 1, limit = 20) => {
    return await apiRequest(`/users/${username}/memes?page=${page}&limit=${limit}`);
  }
};


