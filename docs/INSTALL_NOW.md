# Install Now - Step by Step Guide

Since the automated script requires interactive input, follow these steps:

## Step 1: Install Homebrew (if not installed)

Open Terminal and run:
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

**You'll be prompted for your password** - this is normal and secure.

After installation, you might need to add Homebrew to your PATH. The installer will tell you what to run (usually something like):
```bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

## Step 2: Install Node.js

```bash
brew install node
```

Verify installation:
```bash
node --version
npm --version
```

## Step 3: Install PostgreSQL

```bash
brew install postgresql@15
brew services start postgresql@15
```

Verify it's running:
```bash
pg_isready
```

## Step 4: Create Database

```bash
createdb memedb
```

## Step 5: Setup Backend

```bash
cd backend
npm install
```

Create `.env` file:
```bash
cp .env.example .env
```

Edit `.env` and update the DATABASE_URL. Find your username:
```bash
whoami
```

Then edit `.env` and change:
```
DATABASE_URL="postgresql://YOUR_USERNAME@localhost:5432/memedb"
```

(Replace YOUR_USERNAME with the output from `whoami`)

Generate Prisma client and run migrations:
```bash
npm run prisma:generate
npm run prisma:migrate
```

## Step 6: Start the Application

**Terminal 1 - Start Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Start Frontend:**
```bash
cd frontend
python3 -m http.server 5500
```

## Step 7: Open in Browser

Go to: **http://localhost:5500**

## Quick Commands Reference

```bash
# Check if everything is installed
node --version
npm --version
psql --version
pg_isready

# Start backend (in backend directory)
npm start

# Start frontend (in frontend directory)  
python3 -m http.server 5500
```

## Alternative: Use the Setup Script

If you've installed Homebrew manually, you can now run:
```bash
./setup.sh
```

This will automate steps 2-5 for you.


