# Deployment Guide

## GitHub Repository
The code has been pushed to: https://github.com/darshini2003/albussecurity-assesment.git

## Backend Deployment (Render)

### Steps:
1. Go to [Render.com](https://render.com) and sign up/login
2. Click "New +" and select "Web Service"
3. Connect your GitHub account and select the `bug-bounty-recon-dashboard` repository
4. Configure the service:
   - **Name**: bug-bounty-recon-api (or your choice)
   - **Root Directory**: `backend`
   - **Environment**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python main.py`
   - **Instance Type**: Free
5. Click "Create Web Service"
6. Wait for deployment to complete
7. Copy your backend URL (e.g., `https://bug-bounty-recon-api.onrender.com`)

## Frontend Deployment (Netlify)

### Steps:
1. Go to [Netlify.com](https://netlify.com) and sign up/login
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub and select the `bug-bounty-recon-dashboard` repository
4. Configure build settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
5. Add environment variable:
   - **Key**: `VITE_API_URL`
   - **Value**: Your Render backend URL (from step 7 above)
6. Click "Deploy site"
7. Wait for deployment to complete
8. Your app will be live at a URL like: `https://your-site-name.netlify.app`

## Alternative: Deploy Frontend to Vercel

If you prefer Vercel over Netlify:

1. Go to [Vercel.com](https://vercel.com) and sign up/login
2. Click "Add New" → "Project"
3. Import the `bug-bounty-recon-dashboard` repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add environment variable:
   - **Key**: `VITE_API_URL`
   - **Value**: Your Render backend URL
6. Click "Deploy"

## Post-Deployment

After both services are deployed:
1. Test the backend API by visiting: `https://your-backend-url.onrender.com/docs`
2. Test the frontend by visiting your Netlify/Vercel URL
3. The frontend should now be able to communicate with the backend

## Notes

- **Render Free Tier**: The backend may spin down after 15 minutes of inactivity. First request after inactivity may take 30-60 seconds.
- **Database**: SQLite database will be created automatically on first run. Note that on Render's free tier, the database will be reset if the service restarts.
- **CORS**: The backend is configured to accept requests from any origin for development purposes.

## Troubleshooting

If the frontend can't connect to the backend:
1. Verify the `VITE_API_URL` environment variable is set correctly in Netlify/Vercel
2. Check that the backend is running by visiting the `/docs` endpoint
3. Check browser console for CORS or network errors
4. Redeploy the frontend after updating environment variables
