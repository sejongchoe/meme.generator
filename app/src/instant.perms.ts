// InstantDB Permission Rules
import type { InstantRules } from '@instantdb/react';

const rules = {
  users: {
    allow: {
      view: 'true',
      create: 'false',
      update: 'auth.id == data.id',
      delete: 'false',
    },
  },
  memes: {
    allow: {
      view: 'true',
      create: 'auth.id != null',
      update: 'auth.id == data.userId',
      delete: 'auth.id == data.userId',
    },
  },
  likes: {
    allow: {
      view: 'true',
      create: 'auth.id != null && auth.id == data.userId',
      update: 'false',
      delete: 'auth.id == data.userId',
    },
  },
  comments: {
    allow: {
      view: 'true',
      create: 'auth.id != null && auth.id == data.userId',
      update: 'auth.id == data.userId',
      delete: 'auth.id == data.userId',
    },
  },
  tags: {
    allow: {
      view: 'true',
      create: 'auth.id != null',
      update: 'false',
      delete: 'false',
    },
  },
  memeTags: {
    allow: {
      view: 'true',
      create: 'auth.id != null',
      update: 'false',
      delete: 'true',
    },
  },
} satisfies InstantRules;

export default rules;

