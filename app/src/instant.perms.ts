// InstantDB Permission Rules
// Define access control for all entities

import type { InstantRules } from '@instantdb/react';

const rules = {
  users: {
    allow: {
      // Anyone can view users (for showing usernames)
      view: 'true',
      // Users are created automatically via auth
      create: 'false',
      // Users can only update their own profile
      update: 'auth.id == data.id',
      // Users cannot delete themselves (handled by auth)
      delete: 'false',
    },
  },
  memes: {
    allow: {
      // Anyone can view memes
      view: 'true',
      // Only authenticated users can create memes
      create: 'auth.id != null',
      // Only the owner can update their memes
      update: 'auth.id == data.userId',
      // Only the owner can delete their memes
      delete: 'auth.id == data.userId',
    },
  },
  likes: {
    allow: {
      // Anyone can view likes (to show counts)
      view: 'true',
      // Only authenticated users can like
      create: 'auth.id != null && auth.id == data.userId',
      // Likes cannot be updated
      update: 'false',
      // Users can only unlike their own likes
      delete: 'auth.id == data.userId',
    },
  },
  comments: {
    allow: {
      // Anyone can view comments
      view: 'true',
      // Only authenticated users can comment
      create: 'auth.id != null && auth.id == data.userId',
      // Users can edit their own comments
      update: 'auth.id == data.userId',
      // Users can delete their own comments
      delete: 'auth.id == data.userId',
    },
  },
  tags: {
    allow: {
      // Anyone can view tags
      view: 'true',
      // Only authenticated users can create tags
      create: 'auth.id != null',
      // Tags cannot be updated
      update: 'false',
      // Tags cannot be deleted
      delete: 'false',
    },
  },
  memeTags: {
    allow: {
      // Anyone can view meme tags
      view: 'true',
      // Only authenticated users can tag memes
      create: 'auth.id != null',
      // Meme tags cannot be updated
      update: 'false',
      // Only meme owners can remove tags from their memes
      delete: 'true', // Will need to check meme ownership in the client
    },
  },
} satisfies InstantRules;

export default rules;

