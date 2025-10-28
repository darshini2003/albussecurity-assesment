# Bug Bounty Recon Dashboard - Submission

## Project Overview
A full-stack web application designed for security researchers to manage bug bounty reconnaissance workflows. The application provides a centralized dashboard to track programs, targets, vulnerabilities, and bounty earnings.

## GitHub Repository
**URL**: https://github.com/darshini2003/albussecurity-assesment.git

## Technology Stack

### Backend
- **Framework**: Python FastAPI
- **Database**: SQLite (with automatic initialization)
- **Features**:
  - RESTful API with automatic OpenAPI documentation
  - CRUD operations for programs, targets, and vulnerabilities
  - Statistics aggregation endpoint
  - CORS enabled for cross-origin requests

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: TailwindCSS
- **Icons**: Lucide React
- **Features**:
  - Modern gradient UI design
  - Responsive layout
  - Real-time statistics dashboard
  - Form-based data entry
  - Interactive cards for data visualization

## Key Features

### 1. Dashboard
- Overview statistics (total programs, targets, vulnerabilities, bounties)
- Color-coded stat cards with gradient backgrounds
- Real-time data updates

### 2. Program Management
- Add/delete bug bounty programs
- Track platform (HackerOne, Bugcrowd, etc.)
- Record scope and maximum bounty amounts
- Status tracking (active/inactive)

### 3. Target Management
- Link targets to specific programs
- Record domain, IP address, and tech stack
- Add reconnaissance notes
- Quick reference cards

### 4. Vulnerability Tracking
- Document findings with severity levels (Critical, High, Medium, Low, Info)
- Categorize by vulnerability type (XSS, SQLi, IDOR, etc.)
- Track status (Draft, Reported, Triaged, Resolved, Duplicate)
- Record bounty amounts
- Detailed descriptions

## Local Testing

Both backend and frontend are currently running locally:
- **Backend**: http://localhost:8000 (API docs at /docs)
- **Frontend**: http://localhost:3000

The application has been tested and is fully functional.

## Deployment Instructions

### Backend Deployment (Render - Free Tier)
1. Visit https://render.com and sign up
2. Create new Web Service
3. Connect GitHub repository: `darshini2003/albussecurity-assesment`
4. Configure:
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `python main.py`
5. Deploy and copy the backend URL

### Frontend Deployment (Netlify - Free Tier)
1. Visit https://netlify.com and sign up
2. Import project from GitHub
3. Configure:
   - Base Directory: `frontend`
   - Build Command: `npm run build`
   - Publish Directory: `frontend/dist`
   - Environment Variable: `VITE_API_URL` = [Your Render backend URL]
4. Deploy

**Alternative**: Deploy frontend to Vercel instead of Netlify (instructions in DEPLOYMENT.md)

## API Endpoints

- `GET /` - API status
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
- `GET /docs` - Interactive API documentation (Swagger UI)

## Security Considerations

### Implemented
- CORS middleware for cross-origin requests
- Input validation with Pydantic models
- SQL injection prevention (parameterized queries)
- Environment variable support for configuration

### Production Recommendations
- Add authentication/authorization
- Implement rate limiting
- Use PostgreSQL instead of SQLite for production
- Add HTTPS enforcement
- Implement API key authentication
- Add input sanitization for XSS prevention
- Set up proper CORS origins (not wildcard)

## File Structure
```
bug-bounty-recon-dashboard/
├── backend/
│   ├── main.py                 # FastAPI application
│   ├── requirements.txt        # Python dependencies
│   ├── render.yaml            # Render deployment config
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── App.jsx            # Main React component
│   │   ├── main.jsx           # Entry point
│   │   └── index.css          # Tailwind styles
│   ├── package.json           # Node dependencies
│   ├── vite.config.js         # Vite configuration
│   ├── netlify.toml           # Netlify deployment config
│   └── README.md
├── DEPLOYMENT.md              # Detailed deployment guide
├── SUBMISSION.md              # This file
└── README.md                  # Project overview
```

## Screenshots

The application features:
- Dark theme with purple gradient accents
- Glass-morphism effects with backdrop blur
- Responsive grid layouts
- Color-coded severity indicators for vulnerabilities
- Interactive forms with validation
- Smooth transitions and hover effects

## Testing Checklist

✅ Backend API running and accessible
✅ Database initialization working
✅ All CRUD operations functional
✅ Frontend connecting to backend
✅ Dashboard statistics displaying correctly
✅ Forms submitting and validating data
✅ Delete operations working
✅ Responsive design on different screen sizes
✅ Code committed to GitHub
✅ Build process successful

## Next Steps for Deployment

1. **Deploy Backend**: Follow instructions in DEPLOYMENT.md to deploy to Render
2. **Deploy Frontend**: Deploy to Netlify/Vercel with backend URL as environment variable
3. **Test Production**: Verify all features work in production environment
4. **Submit URL**: Provide the public Netlify/Vercel URL

## Notes

- The SQLite database will be created automatically on first run
- On Render's free tier, the service may spin down after inactivity
- First request after inactivity may take 30-60 seconds
- Database will persist unless the service is redeployed

## License
MIT

---

**Developer**: Built with FastAPI, React, and TailwindCSS
**Repository**: https://github.com/darshini2003/albussecurity-assesment.git
