/**
 * InstantDB Configuration
 * Centralized configuration for InstantDB client
 */

export const INSTANT_CONFIG = {
  appId: import.meta.env.VITE_INSTANT_APP_ID || '77790f0d-33cf-4de1-afdf-846dad908dea',
  
  // Optional: Add more configuration as needed
  options: {
    // Add any InstantDB-specific options here
  }
};

// Export environment-aware config
export const isDevelopment = import.meta.env.DEV;
export const isProduction = import.meta.env.PROD;

// API endpoints (if needed for any external services)
export const API_CONFIG = {
  // Add any external API configurations here
};

