# Quick Start Guide

## Prerequisites Check

Make sure you have:
- Node.js installed (`node --version` should show v18+)
- PostgreSQL installed and running
- npm installed (`npm --version`)

## Step-by-Step Setup

### 1. Install Node.js (if not installed)

Visit https://nodejs.org/ and install the LTS version.

### 2. Install PostgreSQL (if not installed)

**macOS:**
```bash
brew install postgresql
brew services start postgresql
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Windows:**
Download from https://www.postgresql.org/download/windows/

### 3. Create Database

```bash
createdb memedb
```

Or using psql:
```bash
psql postgres
CREATE DATABASE memedb;
\q
```

### 4. Setup Backend

```bash
cd backend
npm install
```

Create `.env` file:
```bash
cp .env.example .env
```

Edit `.env` and update:
```
DATABASE_URL="postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/memedb"
JWT_SECRET="change-this-to-a-random-secret-key"
PORT=3000
NODE_ENV=development
```

Generate Prisma client and run migrations:
```bash
npm run prisma:generate
npm run prisma:migrate
```

Start backend:
```bash
npm start
```

Backend should be running on http://localhost:3000

### 5. Setup Frontend

Open a new terminal:

**Option 1: Python**
```bash
cd frontend
python3 -m http.server 5500
```

**Option 2: Node.js http-server**
```bash
npm install -g http-server
cd frontend
http-server -p 5500
```

**Option 3: VS Code Live Server**
- Install "Live Server" extension
- Right-click on `index.html` → "Open with Live Server"

Frontend should be available at http://localhost:5500

### 6. Test the Application

1. Open http://localhost:5500 in your browser
2. Click "Login" → "Sign Up" to create an account
3. Create a meme and click "Post to Feed"
4. Navigate to "Feed" to see your meme

## Troubleshooting

### Database Connection Error

- Make sure PostgreSQL is running: `pg_isready`
- Check your DATABASE_URL in `.env` matches your PostgreSQL setup
- Verify database exists: `psql -l | grep memedb`

### Port Already in Use

- Backend: Change PORT in `.env` file
- Frontend: Use a different port (e.g., 5501)

### CORS Errors

- Make sure backend is running on port 3000
- Check `FRONTEND_URL` in backend `.env` matches your frontend URL

### Module Import Errors

- Make sure you're using ES modules (type: "module" in package.json)
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

## Next Steps

- Read the full README.md for detailed documentation
- Check API endpoints in README.md
- Customize styling in `frontend/style.css`
- Add more features as needed!

