# Setup Guide - InstantDB Meme Platform

## Quick Start (3 Steps)

### 1. Install Dependencies

```bash
cd frontend-new
npm install
```

This installs:
- React 18
- InstantDB SDK
- Vite (build tool)
- All other dependencies

### 2. Start Development Server

```bash
npm run dev
```

The app will start on `http://localhost:5500`

### 3. Test the App

1. Open `http://localhost:5500` in your browser
2. Click "Login" and enter your email
3. Check your email for the magic code
4. Enter the code to sign in
5. Create your first meme!

That's it! No database to install, no backend to configure.

## Available Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
frontend-new/
├── src/
│   ├── components/         # React components
│   │   ├── Header.jsx      # Top navigation
│   │   ├── AuthModal.jsx   # Login/signup
│   │   ├── MemeGenerator.jsx   # Create memes
│   │   ├── MemeFeed.jsx    # View all memes
│   │   └── MemeCard.jsx    # Individual meme
│   ├── lib/
│   │   └── instant.js      # InstantDB setup
│   ├── instant.schema.ts   # Database schema
│   ├── instant.perms.ts    # Permission rules
│   ├── App.jsx             # Main app
│   ├── main.jsx           # Entry point
│   └── style.css          # Styles
├── public/                 # Static assets
├── index.html             # HTML template
├── package.json           # Dependencies
├── vite.config.js         # Vite config
└── README.md             # Documentation
```

## How InstantDB Works

### No Backend Needed

Traditional setup:
```
Browser → Express API → Database
```

With InstantDB:
```
Browser → InstantDB (handles everything)
```

### Real-time by Default

When someone posts a meme, everyone sees it instantly. When someone likes or comments, all viewers see the update in real-time. No polling, no manual refresh needed.

### Magic Code Authentication

Instead of passwords:
1. User enters email
2. InstantDB sends a magic code
3. User enters code
4. Signed in!

More secure, easier for users, no password management needed.

### Direct File Uploads

Meme images are uploaded directly from the browser to InstantDB Storage. No need for a backend server to handle file uploads.

## Configuration

### InstantDB App ID

Your App ID is configured in `src/lib/instant.js`:

```javascript
export const db = init({
  appId: '77790f0d-33cf-4de1-afdf-846dad908dea',
});
```

This connects your app to your InstantDB instance.

### Database Schema

The schema is defined in `src/instant.schema.ts`. This tells InstantDB what data structure to use:

- **users**: User accounts
- **memes**: Meme posts
- **likes**: Meme likes
- **comments**: Meme comments
- **tags**: Meme tags
- **memeTags**: Meme-tag relationships

### Permissions

Permissions are defined in `src/instant.perms.ts`:

- Anyone can view memes
- Only logged-in users can create memes
- Only meme owners can edit/delete their memes
- Only logged-in users can like and comment

## Development Tips

### Hot Module Replacement

Vite provides instant updates while developing. Edit any file and see changes immediately without losing state.

### React DevTools

Install React Developer Tools browser extension to inspect components and state.

### InstantDB DevTools

Check the browser console to see:
- InstantDB connection status
- Query results
- Real-time updates
- Any errors

### Debugging

To see what queries are running:

```javascript
const { data, isLoading, error } = useQuery({
  memes: {
    user: {},
    likes: {},
    comments: {}
  }
});

console.log('Memes:', data?.memes);
console.log('Loading:', isLoading);
console.log('Error:', error);
```

## Common Issues

### Port Already in Use

If port 5500 is busy, Vite will automatically use the next available port. Check the terminal output for the actual URL.

Or change the port in `vite.config.js`:

```javascript
export default defineConfig({
  server: {
    port: 3000,  // Use port 3000 instead
  }
});
```

### Magic Code Not Received

- Check spam folder
- Look for emails from `noreply@instantdb.com`
- In development, the magic code may be logged to console
- Try a different email address

### Images Not Uploading

- Make sure you're signed in
- Check browser console for errors
- Verify InstantDB Storage is enabled
- Check file size (may have limits)

### Real-time Updates Not Working

- Refresh the page
- Check browser console for connection errors
- Verify your internet connection
- Check InstantDB status

## Environment Variables

Create `.env.local` for local overrides:

```
VITE_INSTANT_APP_ID=your-dev-app-id
```

Then update `src/lib/instant.js`:

```javascript
export const db = init({
  appId: import.meta.env.VITE_INSTANT_APP_ID || '77790f0d-33cf-4de1-afdf-846dad908dea',
});
```

## Testing

### Manual Testing Checklist

- [ ] Sign up with email
- [ ] Receive magic code
- [ ] Sign in successfully
- [ ] Upload custom image
- [ ] Use a template
- [ ] Add text to meme
- [ ] Drag text around
- [ ] Change font size
- [ ] Change text color
- [ ] Download meme
- [ ] Post meme to feed
- [ ] View feed
- [ ] Like a meme
- [ ] Unlike a meme
- [ ] Add a comment
- [ ] Search memes
- [ ] Sort memes
- [ ] Sign out
- [ ] Sign back in

### Multi-User Testing

1. Open app in two browsers (or incognito)
2. Sign in with different emails
3. Create a meme in browser 1
4. Verify it appears in browser 2 immediately
5. Like the meme in browser 2
6. Verify the like count updates in browser 1

This tests real-time functionality!

## Performance

### Optimizing Queries

Only fetch data you need:

```javascript
// Good - only fetch what you display
const { data } = useQuery({
  memes: {
    $: {
      limit: 20,  // Limit results
    },
    user: {},  // Only need user info
    likes: {},  // Only need likes
  }
});

// Avoid - fetching everything
const { data } = useQuery({
  memes: {},
  users: {},
  likes: {},
  comments: {},
  tags: {},
});
```

### Image Optimization

Before uploading, consider:
- Resize images to reasonable dimensions (e.g., max 1200px width)
- Compress images
- Use appropriate formats (PNG for memes with text)

### Code Splitting

Vite automatically code-splits your app. You can manually split routes:

```javascript
const MemeFeed = lazy(() => import('./components/MemeFeed'));
const MemeGenerator = lazy(() => import('./components/MemeGenerator'));
```

## Next Steps

1. **Customize**: Edit `src/style.css` to change colors and styling
2. **Add Features**: 
   - User profiles
   - Meme categories
   - Trending section
   - Share buttons
3. **Deploy**: See `DEPLOY.md` for deployment instructions
4. **Monitor**: Check InstantDB dashboard for usage

## Learning Resources

- [InstantDB Docs](https://www.instantdb.com/docs)
- [React Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)

## Getting Help

- Check browser console for errors
- Read InstantDB documentation
- Join InstantDB Discord community
- File an issue in this repository

Happy coding!

