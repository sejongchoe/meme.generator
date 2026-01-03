/**
 * Application Constants
 * Centralized constant values used throughout the app
 */

// Meme templates - Using reliable sources
export const MEME_TEMPLATES = [
  { 
    id: 'drake',
    name: 'Drake', 
    url: 'https://i.imgflip.com/30b1gx.jpg',
    category: 'reaction'
  },
  { 
    id: 'distracted-boyfriend',
    name: 'Distracted Boyfriend', 
    url: 'https://i.imgflip.com/1ur9b0.jpg',
    category: 'relationship'
  },
  { 
    id: 'two-buttons',
    name: 'Two Buttons', 
    url: 'https://i.imgflip.com/1g8my4.jpg',
    category: 'choice'
  },
  { 
    id: 'change-my-mind',
    name: 'Change My Mind', 
    url: 'https://i.imgflip.com/24y43o.jpg',
    category: 'opinion'
  },
  {
    id: 'one-does-not-simply',
    name: 'One Does Not Simply',
    url: 'https://i.imgflip.com/1bij.jpg',
    category: 'wisdom'
  },
  {
    id: 'success-kid',
    name: 'Success Kid',
    url: 'https://i.imgflip.com/1bhk.jpg',
    category: 'success'
  },
  {
    id: 'disaster-girl',
    name: 'Disaster Girl',
    url: 'https://i.imgflip.com/23ls.jpg',
    category: 'chaos'
  },
  {
    id: 'batman-slap',
    name: 'Batman Slapping Robin',
    url: 'https://i.imgflip.com/9vct.jpg',
    category: 'reaction'
  },
  {
    id: 'woman-yelling-cat',
    name: 'Woman Yelling at Cat',
    url: 'https://i.imgflip.com/345v97.jpg',
    category: 'argument'
  },
  {
    id: 'this-is-fine',
    name: 'This Is Fine',
    url: 'https://i.imgflip.com/wxica.jpg',
    category: 'situation'
  }
];

// Canvas settings
export const CANVAS_SETTINGS = {
  defaultFontSize: 40,
  minFontSize: 20,
  maxFontSize: 100,
  defaultTextColor: '#ffffff',
  defaultStrokeColor: '#000000',
  padding: 20,
  fontFamily: 'Impact, Arial Black, sans-serif'
};

// Sort options for feed
export const SORT_OPTIONS = {
  NEWEST: 'newest',
  POPULAR: 'popular',
  MOST_COMMENTED: 'most_commented'
};

// View types
export const VIEW_TYPES = {
  CREATE: 'create',
  FEED: 'feed'
};

// Auth modes
export const AUTH_MODES = {
  LOGIN: 'login',
  SIGNUP: 'signup'
};

// Image constraints
export const IMAGE_CONSTRAINTS = {
  maxSizeMB: 10,
  acceptedFormats: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
};

// Pagination
export const PAGINATION = {
  defaultPageSize: 20,
  maxPageSize: 50
};

