# Start Locally - Easiest Method

## Option 1: SQLite Setup (No PostgreSQL needed!)

This is the easiest way to get started - no database installation required!

### Step 1: Install Node.js

**If you don't have Node.js:**

**macOS:**
```bash
# Install Homebrew first (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Then install Node.js
brew install node
```

**Or download from:** https://nodejs.org/ (choose LTS version)

### Step 2: Run Setup Script

```bash
./setup-sqlite.sh
```

This will:
- Install backend dependencies
- Set up SQLite database (no PostgreSQL needed!)
- Run migrations
- Configure everything

### Step 3: Start the App

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
python3 -m http.server 5500
```

### Step 4: Open Browser

Go to: **http://localhost:5500**

That's it! 🎉

---

## Option 2: Manual Setup

If the script doesn't work, do it manually:

```bash
# 1. Install Node.js (see Option 1)

# 2. Setup backend
cd backend
npm install
cp .env.sqlite .env
cp prisma/schema.sqlite.prisma prisma/schema.prisma
npm run prisma:generate
npm run prisma:migrate

# 3. Start backend (Terminal 1)
npm start

# 4. Start frontend (Terminal 2)
cd ../frontend
python3 -m http.server 5500

# 5. Open http://localhost:5500
```

---

## Troubleshooting

### "node: command not found"
- Install Node.js (see Step 1 above)
- Or restart your terminal after installing

### "npm: command not found"  
- Usually comes with Node.js
- Try: `brew install node` (includes npm)

### Port 3000 or 5500 already in use
- Change PORT in `backend/.env` to something else (e.g., 3001)
- Use different port for frontend: `python3 -m http.server 5501`

### Database errors
- Delete `backend/dev.db` and run `npm run prisma:migrate` again

---

## Quick Commands

```bash
# Check Node.js
node --version
npm --version

# Start backend
cd backend && npm start

# Start frontend  
cd frontend && python3 -m http.server 5500
```


