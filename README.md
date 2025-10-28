# Bug Bounty Recon Dashboard

A full-stack web application for security researchers to manage bug bounty reconnaissance workflows.

## Features

### Backend (Python FastAPI)
- RESTful API with FastAPI
- SQLite database for data persistence
- CRUD operations for programs, targets, and vulnerabilities
- Statistics and analytics endpoints

### Frontend (React + TailwindCSS)
- Modern, responsive UI with gradient design
- Dashboard with real-time statistics
- Manage bug bounty programs
- Track reconnaissance targets
- Document vulnerabilities with severity levels
- Track bounty earnings

## Tech Stack

- **Backend**: Python, FastAPI, SQLite, SQLAlchemy
- **Frontend**: React, Vite, TailwindCSS, Lucide Icons
- **Deployment**: Render (Backend), Netlify (Frontend)

## Local Development

### Backend
```bash
cd backend
pip install -r requirements.txt
python main.py
```
Backend runs on `http://localhost:8000`

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:3000`

## Deployment

### Backend (Render)
1. Push code to GitHub
2. Create new Web Service on Render
3. Connect repository
4. Set build command: `pip install -r requirements.txt`
5. Set start command: `python main.py`

### Frontend (Netlify)
1. Push code to GitHub
2. Connect repository to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Add environment variable: `VITE_API_URL` with your backend URL

## API Endpoints

- `GET /api/programs` - List all programs
- `POST /api/programs` - Create program
- `DELETE /api/programs/{id}` - Delete program
- `GET /api/targets` - List all targets
- `POST /api/targets` - Create target
- `DELETE /api/targets/{id}` - Delete target
- `GET /api/vulnerabilities` - List all vulnerabilities
- `POST /api/vulnerabilities` - Create vulnerability
- `PUT /api/vulnerabilities/{id}` - Update vulnerability
- `DELETE /api/vulnerabilities/{id}` - Delete vulnerability
- `GET /api/stats` - Get dashboard statistics

## License

MIT
