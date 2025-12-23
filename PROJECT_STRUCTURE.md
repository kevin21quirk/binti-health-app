# Binti Health App - Project Structure

## Directory Overview

```
binti-app/
├── api/                          # Backend API (Node.js/Express)
│   ├── config/
│   │   └── database.js          # PostgreSQL connection config
│   ├── middleware/
│   │   └── auth.js              # JWT authentication middleware
│   ├── routes/                  # API route handlers
│   │   ├── auth.js             # Registration & login
│   │   ├── users.js            # User profile & settings
│   │   ├── periods.js          # Period tracking
│   │   ├── pain.js             # Pain management
│   │   ├── devices.js          # Smart pad devices
│   │   ├── health.js           # Health insights & dashboard
│   │   ├── fertility.js        # Fertility tracking
│   │   ├── community.js        # Community posts & comments
│   │   └── notifications.js    # User notifications
│   └── index.js                # Main API entry point
│
├── database/                     # Database files
│   ├── schema.sql              # Complete PostgreSQL schema
│   └── migrate.js              # Migration script
│
├── js/                          # Frontend JavaScript
│   ├── api-service.js          # API client service (NEW)
│   ├── auth.js                 # Authentication manager (NEW)
│   ├── app.js                  # Main app logic
│   ├── ui.js                   # UI components
│   ├── components.js           # Reusable components
│   ├── screens.js              # Screen management
│   ├── pain-management.js      # Pain tracking features
│   ├── leak-prevention.js      # Leak prevention features
│   ├── fertility-tracking.js   # Fertility tracking features
│   ├── health-insights.js      # Health insights features
│   ├── community.js            # Community features
│   ├── device-connection.js    # Device connection features
│   ├── ble-manager.js          # Bluetooth management
│   ├── animations.js           # UI animations
│   └── animation-controller.js # Animation controller
│
├── css/                         # Stylesheets
│   ├── styles.css              # Main styles
│   ├── auth.css                # Authentication UI styles (NEW)
│   ├── animations.css          # Animation styles
│   ├── enhanced-ui.css         # Enhanced UI components
│   ├── pain-journal.css        # Pain journal styles
│   ├── leak-prevention.css     # Leak prevention styles
│   ├── fertility-tracking.css  # Fertility tracking styles
│   ├── community.css           # Community styles
│   └── visual-enhancements.css # Visual enhancements
│
├── images/                      # Image assets
├── icons/                       # App icons
│
├── index.html                   # Main HTML file
├── offline.html                 # Offline fallback page
├── manifest.json                # PWA manifest
├── service-worker.js            # Service worker for PWA
│
├── package.json                 # Node.js dependencies
├── vercel.json                  # Vercel deployment config (NEW)
├── .env.example                 # Environment variables template (NEW)
├── .gitignore                   # Git ignore rules
│
└── Documentation/
    ├── README.md               # Project overview
    ├── DEPLOYMENT.md           # Deployment guide (NEW)
    ├── API_INTEGRATION.md      # API integration guide (NEW)
    └── PROJECT_STRUCTURE.md    # This file (NEW)
```

## Key Files Explained

### Backend (NEW)

**`api/index.js`**
- Main Express server
- Routes configuration
- Error handling middleware
- CORS setup

**`api/config/database.js`**
- PostgreSQL connection pool
- Database query wrapper
- Connection error handling

**`api/middleware/auth.js`**
- JWT token verification
- Authentication middleware
- Protected route handler

**`api/routes/*.js`**
- RESTful API endpoints
- Request validation
- Database operations
- Response formatting

### Database (NEW)

**`database/schema.sql`**
- Complete database schema
- All tables with relationships
- Indexes for performance
- Triggers for auto-updates

**`database/migrate.js`**
- Migration script
- Runs schema.sql on database
- Error handling and logging

### Frontend (UPDATED)

**`js/api-service.js`** (NEW)
- API client wrapper
- Handles all HTTP requests
- Token management
- Error handling

**`js/auth.js`** (NEW)
- Authentication manager
- Login/register UI
- Token storage
- User session management

**`js/app.js`** (UPDATED)
- Now integrates with API service
- User authentication flow
- App initialization

### Configuration (NEW)

**`vercel.json`**
- Vercel deployment configuration
- API routing setup
- Build settings

**`.env.example`**
- Environment variables template
- Database URL
- JWT secret
- API configuration

## Data Flow

### Authentication Flow
```
User → Login Form → auth.js → apiService → API → Database → JWT Token → localStorage
```

### Data Retrieval Flow
```
Component → apiService → API (with JWT) → Database → Response → Component Render
```

### Data Creation Flow
```
User Input → Form → apiService → API (with JWT) → Database → Success Response → UI Update
```

## API Architecture

### Serverless Functions (Vercel)
- Each API route runs as a serverless function
- Auto-scaling based on traffic
- Cold start optimization

### Database Connection
- Connection pooling for efficiency
- SSL/TLS encryption
- Automatic reconnection

### Authentication
- JWT tokens (7-day expiry)
- Bcrypt password hashing
- Token refresh on activity

## Frontend Architecture

### Progressive Web App (PWA)
- Service worker for offline support
- App manifest for installation
- Responsive mobile-first design

### State Management
- Global `appState` object
- LocalStorage for persistence
- Real-time API synchronization

### Component Structure
- Modular JavaScript files
- Reusable UI components
- Event-driven architecture

## Deployment Architecture

```
GitHub (main branch)
    ↓ (auto-deploy)
Vercel
    ├── Frontend (Static Files)
    └── Backend (Serverless Functions)
         ↓
    Neon.tech (PostgreSQL Database)
```

## Security Features

- **Password Security**: Bcrypt hashing (10 rounds)
- **API Security**: JWT authentication on all endpoints
- **Database Security**: SSL connections, parameterized queries
- **CORS**: Restricted to frontend domain only
- **Environment Variables**: Secrets stored securely in Vercel

## Performance Optimizations

- Database indexes on frequently queried fields
- Connection pooling for database
- Lazy loading of components
- Service worker caching
- Optimized SQL queries

## Mobile Optimization

- Touch-friendly UI elements
- Responsive breakpoints
- Mobile-first CSS
- PWA installation support
- Offline functionality

---

This structure supports a production-ready, scalable mobile health application with real-time data synchronization and no dummy data.
