# Quick Deployment Guide

## 🚀 Deploy in 5 Minutes

### Step 1: Deploy Backend to Render (2 minutes)
1. Go to https://render.com/login
2. Click **"New +"** → **"Web Service"**
3. Click **"Connect GitHub"** and authorize
4. Select repository: **bug-bounty-recon-dashboard**
5. Fill in:
   ```
   Name: bug-bounty-recon-api
   Root Directory: backend
   Environment: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: python main.py
   Instance Type: Free
   ```
6. Click **"Create Web Service"**
7. Wait ~2 minutes for deployment
8. **Copy your backend URL** (e.g., `https://bug-bounty-recon-api.onrender.com`)

### Step 2: Deploy Frontend to Netlify (3 minutes)
1. Go to https://app.netlify.com/
2. Click **"Add new site"** → **"Import an existing project"**
3. Click **"Deploy with GitHub"**
4. Select repository: **bug-bounty-recon-dashboard**
5. Configure:
   ```
   Base directory: frontend
   Build command: npm run build
   Publish directory: frontend/dist
   ```
6. Click **"Add environment variables"**:
   ```
   Key: VITE_API_URL
   Value: [Paste your Render backend URL from Step 1]
   ```
7. Click **"Deploy bug-bounty-recon-dashboard"**
8. Wait ~2 minutes for deployment
9. **Your app is live!** Click the URL to view

### Step 3: Test Your Deployment
1. Visit your Netlify URL
2. Try adding a program, target, and vulnerability
3. Check that statistics update on the dashboard

## 🎉 Done!

Your Bug Bounty Recon Dashboard is now live and accessible via the public URL.

## 📝 URLs to Submit
- **GitHub Repository**: https://github.com/darshini2003/albussecurity-assesment.git
- **Live Application**: [Your Netlify URL]
- **Backend API**: [Your Render URL]

## ⚠️ Important Notes
- Free tier services may spin down after 15 minutes of inactivity
- First request after inactivity may take 30-60 seconds
- Database resets on Render service restart (free tier limitation)

## 🐛 Troubleshooting
- **Frontend shows "Failed to fetch"**: Check that VITE_API_URL is set correctly in Netlify
- **Backend not responding**: Wait 30-60 seconds for Render to wake up
- **Build failed**: Check build logs in Render/Netlify dashboard
