# ✅ Servers Are Running!

## Status

- ✅ **Backend**: Running on http://localhost:3000
- ✅ **Frontend**: Running on http://localhost:5500
- ✅ **Database**: SQLite (dev.db)
- ✅ **Browser**: Should have opened automatically

## Access the App

**Open in your browser:** http://localhost:5500

## What's Running

- Backend server (Node.js/Express) - Port 3000
- Frontend server (Python HTTP Server) - Port 5500
- SQLite database - backend/dev.db

## To Stop the Servers

```bash
# Find and kill the processes
pkill -f "node src/server.js"
pkill -f "python.*http.server"
```

Or use:
```bash
# Backend PID (check with ps)
kill <BACKEND_PID>

# Frontend PID (check with ps)  
kill <FRONTEND_PID>
```

## To Restart

```bash
# Backend
cd backend
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && nvm use v24.12.0
npm start

# Frontend (in another terminal)
cd frontend
python3 -m http.server 5500
```

## Logs

- Backend logs: `/tmp/backend.log`
- Frontend logs: `/tmp/frontend.log`

View logs:
```bash
tail -f /tmp/backend.log
tail -f /tmp/frontend.log
```

