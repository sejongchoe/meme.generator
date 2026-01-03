# Meme Platform

A modern, serverless meme sharing platform built with React and InstantDB.

**Status**: ✅ Successfully migrated to InstantDB!

## Features

- Create memes with canvas-based editor
- Upload custom images or use templates
- Add draggable text with customizable fonts and colors
- Share memes with the community
- Like and comment on memes
- Real-time updates across all users
- Simple email authentication (no passwords!)

## Quick Start

```bash
cd frontend-new
npm install
npm run dev
```

Open `http://localhost:5500` and start creating memes!

## Documentation

- **[Migration Guide](MIGRATION_COMPLETE.md)** - What changed in the migration
- **[Setup Guide](frontend-new/SETUP.md)** - Detailed setup instructions
- **[Deployment Guide](frontend-new/DEPLOY.md)** - How to deploy to production
- **[App README](frontend-new/README.md)** - Technical details

## Architecture

This app uses **InstantDB** - a serverless, real-time database that eliminates the need for a traditional backend.

### Tech Stack

- **Frontend**: React 18 + Vite
- **Database**: InstantDB (real-time, serverless)
- **Auth**: InstantDB Auth (magic code email)
- **Storage**: InstantDB Storage (cloud-hosted)
- **Styling**: Custom CSS

### No Backend Required!

Traditional setup:
```
Frontend → Express API → PostgreSQL Database → File System
```

With InstantDB:
```
Frontend → InstantDB ✨
```

All database operations, authentication, and file storage happen directly from the browser - securely and in real-time.

## Project Structure

```
experiment/
├── frontend-new/          # New InstantDB-powered app ⭐
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── lib/          # InstantDB setup
│   │   └── ...
│   ├── package.json
│   └── README.md
│
├── frontend/             # Old vanilla JS frontend
├── backend/              # Old Express + PostgreSQL backend
└── MIGRATION_COMPLETE.md # Migration documentation
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm

That's it! No PostgreSQL, no backend server needed.

### Installation

1. Clone the repository
2. Navigate to the new app:
   ```bash
   cd frontend-new
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the dev server:
   ```bash
   npm run dev
   ```

### Usage

1. **Sign Up/Login**: Click "Login" and enter your email to receive a magic code
2. **Create Memes**: 
   - Upload an image or select a template
   - Add text elements
   - Drag text to position
   - Customize font and colors
   - Post to feed or download
3. **Browse Feed**: View all memes, search, sort, like, and comment
4. **Real-time Magic**: Open the app in two browsers and watch updates happen instantly!

## Features in Detail

### Meme Generator

- **Canvas-based editor** for precise meme creation
- **Multiple text elements** with drag-and-drop positioning
- **Customizable styling** (font size, color, stroke)
- **Template library** with popular meme formats
- **Custom image upload** support
- **Download** memes locally
- **Upload to feed** with one click

### Social Feed

- **Real-time updates** - see new memes instantly
- **Search** by title or author
- **Sort** by newest, most liked, or most commented
- **Like system** with instant feedback
- **Comments** with real-time sync
- **Responsive grid** layout

### Authentication

- **Passwordless** magic code authentication
- **Email-based** sign up and login
- **Secure** session management
- **No password reset** needed (because no passwords!)

## Deployment

Ready to deploy? See the [Deployment Guide](frontend-new/DEPLOY.md).

Quick deploy to Vercel:
```bash
cd frontend-new
npx vercel
```

Or Netlify:
```bash
cd frontend-new
npx netlify deploy --prod
```

## Migration from Old Stack

This project was migrated from:
- Express + PostgreSQL + Prisma backend
- Vanilla JavaScript frontend
- JWT authentication
- Local file storage

To:
- **Zero backend code**
- React + InstantDB
- Magic code authentication
- Cloud file storage

Benefits:
- ✅ No server to maintain
- ✅ Real-time by default
- ✅ Simpler codebase
- ✅ Faster development
- ✅ Better scalability
- ✅ Lower costs

See [MIGRATION_COMPLETE.md](MIGRATION_COMPLETE.md) for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for learning or as a starting point for your own meme platform!

## Support

- 📚 [InstantDB Documentation](https://www.instantdb.com/docs)
- 💬 [InstantDB Discord](https://discord.gg/instantdb)
- 🐛 File issues in this repository

## Acknowledgments

- Built with [InstantDB](https://www.instantdb.com/)
- Meme templates from [Imgflip](https://imgflip.com/)
- UI inspired by modern design principles

---

**Ready to create some memes?** 

```bash
cd frontend-new && npm install && npm run dev
```

Let's go! 🚀
