# Binti Health App - Production Deployment Guide

## Quick Start for GitHub + Vercel + Neon.tech

### 1. Database Setup (Neon.tech)

1. Create account at [neon.tech](https://neon.tech)
2. Create new project named "binti-health"
3. Copy the connection string (looks like):
   ```
   postgresql://user:pass@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
   ```

### 2. Local Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` file:
   ```bash
   cp .env.example .env
   ```

3. Edit `.env` with your values:
   ```
   DATABASE_URL=your-neon-connection-string
   JWT_SECRET=generate-random-32-char-string
   NODE_ENV=production
   FRONTEND_URL=https://your-app.vercel.app
   ```

4. Run database migration:
   ```bash
   npm run migrate
   ```

### 3. GitHub Setup

```bash
git init
git add .
git commit -m "Production-ready Binti Health App"
git remote add origin https://github.com/YOUR-USERNAME/binti-app.git
git branch -M main
git push -u origin main
```

### 4. Vercel Deployment

1. Go to [vercel.com](https://vercel.com) and import your GitHub repo
2. Add environment variables in Vercel dashboard:
   - `DATABASE_URL`: Your Neon connection string
   - `JWT_SECRET`: Same as in your .env
   - `NODE_ENV`: production
3. Deploy!

### 5. Post-Deployment

1. Copy your Vercel URL (e.g., `https://binti-app.vercel.app`)
2. Update `FRONTEND_URL` in Vercel environment variables
3. Redeploy if needed

## Architecture

- **Frontend**: Static HTML/CSS/JS (PWA)
- **Backend**: Node.js/Express API (Serverless on Vercel)
- **Database**: PostgreSQL on Neon.tech
- **Auth**: JWT tokens
- **Deployment**: Vercel (auto-deploy from GitHub main branch)

## API Endpoints

All endpoints are at `/api/*`:

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/users/profile` - Get user profile
- `GET /api/periods` - Get period entries
- `POST /api/periods` - Create period entry
- `GET /api/pain` - Get pain entries
- `POST /api/pain` - Create pain entry
- `GET /api/devices` - Get connected devices
- `POST /api/devices/connect` - Connect device
- `GET /api/health/dashboard` - Get dashboard data
- `GET /api/fertility` - Get fertility data
- `GET /api/community/posts` - Get community posts
- `GET /api/notifications` - Get notifications

## Environment Variables

Required for production:

```
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app
```

## Database Schema

The app uses PostgreSQL with the following main tables:
- `users` - User accounts
- `user_profiles` - User health profiles
- `period_entries` - Period tracking data
- `pain_entries` - Pain management logs
- `device_connections` - Smart pad devices
- `sensor_readings` - Device sensor data
- `fertility_data` - Fertility tracking
- `community_posts` - Community content
- `notifications` - User notifications

## Features

✅ User authentication (JWT)
✅ Period tracking with predictions
✅ Pain management and analytics
✅ Smart pad device integration
✅ Health insights dashboard
✅ Fertility tracking
✅ Community platform
✅ Real-time notifications
✅ PWA support (offline capable)

## Continuous Deployment

Every push to `main` branch automatically deploys to Vercel.

## Troubleshooting

**API errors**: Check Vercel function logs
**Database issues**: Verify Neon.tech connection string
**Auth problems**: Clear localStorage and re-login
**CORS errors**: Check FRONTEND_URL matches your domain

## Security

- Passwords hashed with bcrypt
- JWT tokens for authentication
- SSL/TLS for all connections
- Environment variables for secrets
- CORS configured for your domain only

---

Your app is now production-ready with no dummy data!
