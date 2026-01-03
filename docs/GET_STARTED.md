# 🚀 Get Started in 3 Steps

## Step 1: Install Node.js (if you don't have it)

**macOS:**
```bash
brew install node
```

**Or download:** https://nodejs.org/ (choose LTS version)

## Step 2: Run This Command

```bash
./quick-start.sh
```

This will:
- ✅ Set up everything automatically
- ✅ Start the backend server
- ✅ Start the frontend server  
- ✅ Open your browser

## Step 3: That's It!

The app will open at **http://localhost:5500**

---

## What If It Doesn't Work?

### If you get "node: command not found"
Install Node.js first (see Step 1)

### If you get permission errors
```bash
chmod +x quick-start.sh
./quick-start.sh
```

### Manual Start (if script fails)

**Terminal 1:**
```bash
cd backend
npm install
cp .env.sqlite .env 2>/dev/null || echo "DATABASE_URL=\"file:./dev.db\"" > .env
cp prisma/schema.sqlite.prisma prisma/schema.prisma
npm run prisma:generate
npm run prisma:migrate
npm start
```

**Terminal 2:**
```bash
cd frontend
python3 -m http.server 5500
```

Then open: http://localhost:5500

---

## Need More Help?

See `START_LOCAL.md` for detailed instructions.


