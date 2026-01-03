# Local Setup Instructions

## Quick Setup (Recommended)

Run the automated setup script:

```bash
./setup.sh
```

This will:
- Install Homebrew (if needed)
- Install Node.js
- Install PostgreSQL
- Create the database
- Install backend dependencies
- Set up environment variables
- Run database migrations

## Manual Setup

If you prefer to set up manually or the script doesn't work:

### 1. Install Homebrew (macOS)

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 2. Install Node.js

```bash
brew install node
```

### 3. Install PostgreSQL

```bash
brew install postgresql@15
brew services start postgresql@15
```

### 4. Create Database

```bash
createdb memedb
```

### 5. Setup Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env and update DATABASE_URL with your PostgreSQL username
npm run prisma:generate
npm run prisma:migrate
```

### 6. Update .env File

Edit `backend/.env` and make sure `DATABASE_URL` matches your setup:

```
DATABASE_URL="postgresql://YOUR_USERNAME@localhost:5432/memedb"
```

If your PostgreSQL has a password, use:
```
DATABASE_URL="postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/memedb"
```

## Starting the Application

### Option 1: Use the start script

```bash
./start.sh
```

### Option 2: Manual start

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

Then open http://localhost:5500 in your browser.

## Troubleshooting

### PostgreSQL Connection Issues

If you get connection errors:

1. Check PostgreSQL is running:
   ```bash
   pg_isready
   ```

2. Check your username:
   ```bash
   whoami
   ```

3. Update `backend/.env` with correct username

4. If PostgreSQL has a password, add it to DATABASE_URL:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/memedb"
   ```

### Port Already in Use

If port 3000 or 5500 is in use:

- Backend: Change `PORT` in `backend/.env`
- Frontend: Use a different port: `python3 -m http.server 5501`

### Database Migration Errors

If migrations fail:

```bash
cd backend
npm run prisma:reset  # This will reset the database
npm run prisma:migrate
```

## Need Help?

Check the main README.md for more detailed information.


