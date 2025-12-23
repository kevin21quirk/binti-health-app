# Binti Health App - Setup Guide

This guide will help you set up the Binti Health App for production deployment with PostgreSQL database on Neon.tech and hosting on Vercel.

## Prerequisites

- Node.js 18+ installed
- A GitHub account
- A Vercel account (connected to your GitHub)
- A Neon.tech account for PostgreSQL database

## Step 1: Database Setup on Neon.tech

1. **Create a Neon.tech Account**
   - Go to [https://neon.tech](https://neon.tech)
   - Sign up for a free account

2. **Create a New Project**
   - Click "New Project"
   - Name it "binti-health" or your preferred name
   - Select your preferred region
   - Click "Create Project"

3. **Get Your Database Connection String**
   - After project creation, you'll see a connection string like:
     ```
     postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require
     ```
   - Copy this connection string - you'll need it later

4. **Run Database Migration**
   - Create a `.env` file in your project root:
     ```bash
     cp .env.example .env
     ```
   - Edit `.env` and add your Neon database URL:
     ```
     DATABASE_URL=your-neon-connection-string-here
     JWT_SECRET=your-random-secret-key-here
     NODE_ENV=production
     FRONTEND_URL=https://your-app.vercel.app
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Run the migration:
     ```bash
     npm run migrate
     ```
   - You should see: ✅ Database migration completed successfully!

## Step 2: GitHub Repository Setup

1. **Initialize Git Repository** (if not already done)
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Binti Health App with backend"
   ```

2. **Create GitHub Repository**
   - Go to [https://github.com/new](https://github.com/new)
   - Create a new repository (e.g., "binti-health-app")
   - Don't initialize with README (you already have files)

3. **Push to GitHub**
   ```bash
   git remote add origin https://github.com/YOUR-USERNAME/binti-health-app.git
   git branch -M main
   git push -u origin main
   ```

## Step 3: Vercel Deployment

1. **Connect GitHub to Vercel**
   - Go to [https://vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Environment Variables**
   - In the Vercel project settings, add these environment variables:
     - `DATABASE_URL`: Your Neon.tech connection string
     - `JWT_SECRET`: A secure random string (use a password generator)
     - `NODE_ENV`: `production`
     - `FRONTEND_URL`: Will be auto-filled after first deployment

3. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete
   - Your app will be live at `https://your-project.vercel.app`

4. **Update Environment Variables**
   - After first deployment, update `FRONTEND_URL` in Vercel settings
   - Set it to your actual Vercel URL: `https://your-project.vercel.app`
   - Redeploy if needed

## Step 4: Testing Your Deployment

1. **Visit Your App**
   - Go to your Vercel URL
   - You should see the Binti Health splash screen

2. **Test Registration**
   - The app will prompt you to login/register
   - Create a test account
   - Verify you can login successfully

3. **Test API Endpoints**
   - Try creating a period entry
   - Add a pain log
   - Check that data persists after refresh

## Step 5: Continuous Deployment

Now that everything is connected:
- Any push to the `main` branch on GitHub will automatically deploy to Vercel
- Vercel will build and deploy your changes
- Database remains on Neon.tech

## Local Development

To run the app locally:

1. **Start the Backend API**
   ```bash
   npm run dev
   ```
   This starts the API server on `http://localhost:3000`

2. **Start the Frontend**
   ```bash
   python -m http.server 8082
   ```
   Or use any static file server

3. **Access the App**
   - Open `http://localhost:8082` in your browser
   - The app will connect to your local API

## Database Management

### View Database
- Use Neon.tech's SQL Editor in the dashboard
- Or connect with any PostgreSQL client using your connection string

### Backup Database
Neon.tech provides automatic backups. To manually backup:
```bash
pg_dump $DATABASE_URL > backup.sql
```

### Reset Database
To drop all tables and re-run migration:
```sql
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
```
Then run: `npm run migrate`

## Security Notes

1. **Never commit `.env` file** - It's already in `.gitignore`
2. **Use strong JWT_SECRET** - Generate with: `openssl rand -base64 32`
3. **Keep DATABASE_URL secret** - Only store in Vercel environment variables
4. **Enable CORS properly** - Only allow your frontend domain in production

## Troubleshooting

### API Not Working
- Check Vercel logs for errors
- Verify environment variables are set correctly
- Ensure DATABASE_URL is accessible from Vercel

### Database Connection Issues
- Verify Neon.tech project is active
- Check connection string format
- Ensure SSL mode is enabled

### Authentication Issues
- Clear browser localStorage
- Check JWT_SECRET is set in Vercel
- Verify API endpoints are accessible

## Features Implemented

✅ User authentication (register/login)
✅ Period tracking with daily logs
✅ Pain management entries and analytics
✅ Smart pad device connection and sensor readings
✅ Health insights and dashboard
✅ Fertility tracking
✅ Community posts and comments
✅ Notifications system
✅ User settings and profile management

## Next Steps

1. Customize the app branding
2. Add email verification (optional)
3. Implement password reset functionality
4. Add data export features
5. Enhance analytics and insights
6. Add push notifications
7. Implement real Bluetooth device integration

## Support

For issues or questions:
- Check Vercel deployment logs
- Review Neon.tech database logs
- Check browser console for frontend errors
- Review API response errors

---

**Congratulations!** Your Binti Health App is now live with a production database and ready for users.
