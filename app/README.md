# Meme Platform - InstantDB Edition

A modern, serverless meme sharing platform built with React and InstantDB. Users can create memes, share them, and interact through likes and comments - all in real-time!

## Features

- **Meme Creation**: Upload images or use templates, add draggable text with customizable fonts and colors
- **Real-time Updates**: See new memes, likes, and comments instantly without refreshing
- **User Authentication**: Simple magic code email authentication powered by InstantDB
- **Social Features**: Like memes and add comments with real-time synchronization
- **Search & Sort**: Find memes by title or author, sort by newest, most liked, or most commented
- **Serverless**: No backend server needed - InstantDB handles everything!

## Tech Stack

- **Frontend**: React 18 + Vite
- **Database**: InstantDB (real-time, serverless)
- **Authentication**: InstantDB Auth (magic code email)
- **File Storage**: InstantDB Storage
- **Styling**: Custom CSS with CSS variables

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
cd frontend-new
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:5500`

That's it! No database setup, no backend configuration needed.

## How It Works

### InstantDB Magic

This app uses InstantDB, which provides:

1. **Real-time Database**: All data syncs instantly across all connected clients
2. **Built-in Authentication**: Magic code email authentication (no passwords to manage!)
3. **File Storage**: Direct file uploads from the browser
4. **Permissions**: Declarative permission rules defined in code

### App Structure

```
frontend-new/
├── src/
│   ├── components/
│   │   ├── Header.jsx          # Navigation and auth button
│   │   ├── AuthModal.jsx       # Login/signup modal
│   │   ├── MemeGenerator.jsx   # Canvas-based meme creator
│   │   ├── MemeFeed.jsx        # Real-time meme feed
│   │   └── MemeCard.jsx        # Individual meme with likes/comments
│   ├── lib/
│   │   └── instant.js          # InstantDB client setup
│   ├── instant.schema.ts       # Database schema
│   ├── instant.perms.ts        # Permission rules
│   ├── App.jsx                 # Main app component
│   ├── main.jsx               # React entry point
│   └── style.css              # Global styles
├── index.html
├── vite.config.js
└── package.json
```

## Key Features Explained

### Real-time Meme Feed

The feed automatically updates when anyone posts a new meme, likes, or comments. This is powered by InstantDB's reactive queries:

```jsx
const { data } = useQuery({
  memes: {
    user: {},
    likes: { user: {} },
    comments: { user: {} }
  }
});
```

### Authentication

Simple magic code authentication - users enter their email and receive a code to sign in. No passwords needed!

```jsx
const { signInWithMagicCode } = useAuth();
await signInWithMagicCode({ email });
```

### File Uploads

Meme images are uploaded directly to InstantDB Storage:

```jsx
const { url } = await db.storage.upload(fileName, blob);
```

### Optimistic Updates

Likes and comments appear instantly thanks to InstantDB's optimistic updates. The UI updates immediately while the database syncs in the background.

## Building for Production

```bash
npm run build
```

The build output will be in the `dist/` directory, ready to deploy to:
- Vercel
- Netlify  
- GitHub Pages
- Any static hosting service

## Environment Variables

No environment variables needed! The InstantDB App ID is configured in `src/lib/instant.js`.

## Comparison with Old Backend

| Feature | Old (Express + PostgreSQL) | New (InstantDB) |
|---------|---------------------------|-----------------|
| Backend Code | ~500+ lines | 0 lines |
| Database Setup | Manual PostgreSQL install | None |
| Authentication | Custom JWT | Built-in magic codes |
| File Storage | Local filesystem + Multer | InstantDB Storage |
| Real-time Updates | Manual polling | Automatic |
| API Routes | 4 route files | 0 routes |
| Deployment | Server + Database | Static hosting only |

## License

MIT

## Credits

Built with [InstantDB](https://www.instantdb.com/) - the modern database for web apps.

