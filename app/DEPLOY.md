# Deployment Guide

## Prerequisites

Before deploying, make sure you have:
1. Tested the app locally (`npm run dev`)
2. Verified all features work
3. Your InstantDB App ID is correctly configured in `src/lib/instant.js`

## Deployment Options

### 1. Vercel (Recommended - Easiest)

#### Deploy via GitHub

1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Migrate to InstantDB"
   git push
   ```

2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Configure project:
   - **Root Directory**: `frontend-new`
   - **Framework**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Click "Deploy"

#### Deploy via CLI

```bash
cd frontend-new
npx vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Scope: Choose your account
# - Link to existing project? N
# - Project name: meme-platform
# - Directory: ./
# - Override settings? N

# For production deployment:
npx vercel --prod
```

Your app will be live at `https://your-project.vercel.app`

### 2. Netlify

#### Deploy via GitHub

1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Connect to GitHub and select your repository
5. Configure build settings:
   - **Base directory**: `frontend-new`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend-new/dist`
6. Click "Deploy site"

#### Deploy via CLI

```bash
cd frontend-new

# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod

# Follow the prompts:
# - Create & configure a new site
# - Site name: meme-platform
# - Publish directory: dist
```

Your app will be live at `https://your-project.netlify.app`

### 3. GitHub Pages

1. Install `gh-pages`:
   ```bash
   cd frontend-new
   npm install --save-dev gh-pages
   ```

2. Add to `package.json`:
   ```json
   {
     "scripts": {
       "deploy": "npm run build && gh-pages -d dist"
     }
   }
   ```

3. Deploy:
   ```bash
   npm run deploy
   ```

4. Enable GitHub Pages:
   - Go to your repository on GitHub
   - Settings → Pages
   - Source: `gh-pages` branch
   - Save

Your app will be live at `https://your-username.github.io/repository-name`

### 4. Cloudflare Pages

1. Push your code to GitHub
2. Go to [pages.cloudflare.com](https://pages.cloudflare.com)
3. Click "Create a project"
4. Connect to GitHub and select your repository
5. Configure build:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `frontend-new`
6. Click "Save and Deploy"

### 5. Other Hosting Platforms

The app can be deployed to any static hosting service:

- **Render**: Connect GitHub, set build command to `npm run build`, publish directory to `dist`
- **Firebase Hosting**: `firebase deploy` after configuring `firebase.json`
- **AWS S3 + CloudFront**: Upload `dist/` contents to S3, configure CloudFront
- **DigitalOcean App Platform**: Connect GitHub, deploy as static site

## Post-Deployment

### 1. Test Your Deployed App

- [ ] Visit your deployed URL
- [ ] Test authentication (sign up/login)
- [ ] Create a meme
- [ ] Upload to feed
- [ ] Like and comment
- [ ] Test in multiple browsers/devices

### 2. Configure Custom Domain (Optional)

#### Vercel
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as shown

#### Netlify
1. Go to Site Settings → Domain Management
2. Add custom domain
3. Update DNS records

### 3. Set Up Analytics (Optional)

Add analytics to track usage:

**Vercel Analytics:**
```bash
npm install @vercel/analytics
```

In `src/main.jsx`:
```jsx
import { Analytics } from '@vercel/analytics/react';

// Add <Analytics /> to your root component
```

**Google Analytics:**
Add to `index.html`:
```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=YOUR-GA-ID"></script>
```

### 4. Monitor InstantDB Usage

1. Go to [InstantDB Dashboard](https://instantdb.com/dash)
2. Select your app
3. Monitor:
   - Storage usage
   - Query performance
   - Active connections
   - Rate limits

## Environment-Specific Configuration

If you need different settings for dev vs production:

1. Create `.env.production`:
   ```
   VITE_INSTANT_APP_ID=your-production-app-id
   ```

2. Update `src/lib/instant.js`:
   ```js
   export const db = init({
     appId: import.meta.env.VITE_INSTANT_APP_ID || '77790f0d-33cf-4de1-afdf-846dad908dea',
   });
   ```

## Troubleshooting Deployment

### Build Fails

**Error: Cannot find module '@instantdb/react'**
- Make sure `package.json` has all dependencies
- Run `npm install` before building

**Error: Vite build failed**
- Check for syntax errors in your code
- Ensure all imports are correct
- Check browser console for specific errors

### App Loads but Features Don't Work

**Authentication doesn't work**
- Verify InstantDB App ID is correct
- Check browser console for errors
- Ensure emails can be sent (check spam folder)

**Images don't upload**
- Verify InstantDB Storage is enabled
- Check browser console for CORS errors
- Ensure you're signed in when uploading

**Real-time updates don't work**
- Check InstantDB connection in console
- Verify queries are using `useQuery` hook
- Check for network errors

### Performance Issues

**Slow initial load**
- Enable code splitting in Vite
- Optimize images before uploading
- Use lazy loading for components

**High data usage**
- Limit number of memes loaded initially
- Implement pagination or infinite scroll
- Optimize query to only fetch needed data

## Continuous Deployment

Set up automatic deployments on every git push:

### Vercel
- Automatically enabled when you connect GitHub
- Pushes to `main` branch deploy to production
- Pushes to other branches create preview deployments

### Netlify
- Automatically enabled when you connect GitHub
- Configure branch deploys in Site Settings
- Preview deploys for pull requests

### GitHub Actions

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: cd frontend-new && npm install
      - run: cd frontend-new && npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./frontend-new/dist
```

## Security Considerations

1. **InstantDB Permissions**: Review `instant.perms.ts` to ensure proper access control
2. **Environment Variables**: Never commit API keys (though InstantDB App ID is safe to expose)
3. **HTTPS**: All deployment platforms use HTTPS by default
4. **CSP Headers**: Configure Content Security Policy if needed

## Cost Estimation

InstantDB Free Tier includes:
- 100k reads/month
- 100k writes/month
- 1 GB storage
- Unlimited bandwidth

For a small to medium meme platform, this should be sufficient. Monitor usage in the InstantDB dashboard.

## Rollback Plan

If something goes wrong:

1. **Vercel/Netlify**: Revert to previous deployment via dashboard
2. **GitHub Pages**: Revert git commit and redeploy
3. **Manual**: Keep old backend running until you're confident

## Next Steps After Deployment

1. Share your app with users
2. Collect feedback
3. Monitor errors and usage
4. Iterate and improve
5. Consider upgrading InstantDB plan if needed

## Support

Need help deploying?
- Check the platform's documentation
- Join InstantDB Discord
- Review deployment logs for errors
- File an issue in your repository

Happy deploying!

