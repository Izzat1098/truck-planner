# Deployment Guide

## Frontend Deployment (GitHub Pages)

### Prerequisites
- GitHub account
- Git repository pushed to GitHub

### Steps

1. **Enable GitHub Pages**
   - Go to your repository on GitHub
   - Navigate to Settings > Pages
   - Under "Build and deployment", select "GitHub Actions" as the source

2. **Set up environment variable (Secret)**
   - Go to Settings > Secrets and variables > Actions
   - Click "New repository secret"
   - Name: `VITE_API_BASE_URL`
   - Value: `https://your-backend-name.onrender.com/api` (update after deploying backend)

3. **Deploy**
   - The GitHub Actions workflow will automatically deploy when you push to the main branch
   - Or manually trigger it from Actions tab > "Deploy Frontend to GitHub Pages" > "Run workflow"

4. **Access your site**
   - Your frontend will be available at: `https://yourusername.github.io/truck-planner/`

---

## Backend Deployment (Render)

### Prerequisites
- Render account (free tier available at render.com)
- GitHub repository

### Steps

1. **Create a new Web Service on Render**
   - Go to https://render.com and sign in
   - Click "New +" > "Web Service"
   - Connect your GitHub repository
   - Select the `truck-planner` repository

2. **Configure the service**
   - **Name**: `truck-planner-backend` (or your preferred name)
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `./build.sh`
   - **Start Command**: `gunicorn config.wsgi:application`
   - **Instance Type**: `Free`

3. **Set Environment Variables**
   Click "Advanced" and add these environment variables:
   
   - `SECRET_KEY`: Generate a secure random key (you can use: https://djecrety.ir/)
   - `DEBUG`: `False`
   - `ALLOWED_HOSTS`: `your-app-name.onrender.com`
   - `CORS_ALLOWED_ORIGINS`: `https://yourusername.github.io` (your GitHub Pages URL)
   - `OPENROUTESERVICE_API_KEY`: Your OpenRouteService API key
   - `PYTHON_VERSION`: `3.12.0`

4. **Deploy**
   - Click "Create Web Service"
   - Render will automatically deploy your app
   - Wait for the build to complete (first deploy takes 5-10 minutes)

5. **Get your backend URL**
   - After deployment, copy your service URL (e.g., `https://truck-planner-backend.onrender.com`)
   - Update the GitHub secret `VITE_API_BASE_URL` with this URL + `/api`

6. **Redeploy Frontend**
   - Go to your GitHub repository
   - Trigger the frontend deployment workflow again to use the new backend URL

---

## Local Development Setup

### Frontend
```bash
cd frontend
npm install
# Create .env file with your backend URL
echo "VITE_API_BASE_URL=http://localhost:8000/api" > .env
npm run dev
```

### Backend
```bash
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1  # Windows
# source venv/bin/activate    # Mac/Linux

pip install -r requirements.txt

# Create .env file
copy .env.example .env
# Edit .env and add your API keys

python manage.py migrate
python manage.py runserver
```

---

## Important Notes

### Free Tier Limitations

**GitHub Pages:**
- 100GB bandwidth/month
- 1GB storage
- Public repositories only (or GitHub Pro for private repos)

**Render Free Tier:**
- Service spins down after 15 minutes of inactivity
- 750 hours/month of runtime
- Limited RAM (512MB)
- Slower cold starts (can take 30-60 seconds)

### Security Considerations
- Never commit `.env` files to Git
- Always use environment variables for secrets
- Use strong SECRET_KEY in production
- Set DEBUG=False in production
- Restrict CORS origins to your frontend domain only

### Troubleshooting

**Backend not responding:**
- Check Render logs for errors
- Verify environment variables are set correctly
- Ensure ALLOWED_HOSTS includes your Render domain

**Frontend can't connect to backend:**
- Check CORS settings on backend
- Verify VITE_API_BASE_URL is set correctly
- Check browser console for CORS errors

**Build failures:**
- Check that all dependencies are in requirements.txt
- Verify Python version matches runtime.txt
- Review build logs on Render
