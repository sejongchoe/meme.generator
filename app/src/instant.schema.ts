// InstantDB Schema Definition
import { i } from '@instantdb/core';

const schema = i.graph(
  {
    users: i.entity({
      username: i.string(),
      email: i.string(),
      createdAt: i.number(),
      dailyPostCount: i.number(),
      lastPostDate: i.string(),
    }),
    memes: i.entity({
      title: i.string(),
      imageUrl: i.string(),
      textElements: i.json(),
      createdAt: i.number(),
      userId: i.string(),
      likesCount: i.number(),
      commentsCount: i.number(),
    }),
    likes: i.entity({
      userId: i.string(),
      memeId: i.string(),
      createdAt: i.number(),
    }),
    comments: i.entity({
      userId: i.string(),
      memeId: i.string(),
      content: i.string(),
      createdAt: i.number(),
    }),
    tags: i.entity({
      name: i.string(),
    }),
    memeTags: i.entity({
      memeId: i.string(),
      tagId: i.string(),
    }),
  },
  {
    memeUser: {
      forward: { on: 'memes', has: 'one', label: 'user' },
      reverse: { on: 'users', has: 'many', label: 'memes' },
    },
    memeLikes: {
      forward: { on: 'memes', has: 'many', label: 'likes' },
      reverse: { on: 'likes', has: 'one', label: 'meme' },
    },
    memeComments: {
      forward: { on: 'memes', has: 'many', label: 'comments' },
      reverse: { on: 'comments', has: 'one', label: 'meme' },
    },
    likeUser: {
      forward: { on: 'likes', has: 'one', label: 'user' },
      reverse: { on: 'users', has: 'many', label: 'likes' },
    },
    commentUser: {
      forward: { on: 'comments', has: 'one', label: 'user' },
      reverse: { on: 'users', has: 'many', label: 'comments' },
    },
    memeTagsMeme: {
      forward: { on: 'memeTags', has: 'one', label: 'meme' },
      reverse: { on: 'memes', has: 'many', label: 'memeTags' },
    },
    memeTagsTag: {
      forward: { on: 'memeTags', has: 'one', label: 'tag' },
      reverse: { on: 'tags', has: 'many', label: 'memeTags' },
    },
  }
);

export default schema;

