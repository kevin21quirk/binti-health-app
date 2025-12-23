# Frontend API Integration Guide

This guide explains how the frontend connects to the backend API and how to integrate real data instead of dummy data.

## Authentication Flow

The app now uses JWT-based authentication. Users must register/login before accessing features.

### How It Works

1. **On App Load**: `auth.js` checks for existing token in localStorage
2. **No Token**: User sees login/register modal
3. **With Token**: User data loads from API and populates the app
4. **Token Storage**: Stored in localStorage, sent with every API request

### Using Authentication in Your Code

```javascript
// Check if user is authenticated
if (authManager.isAuthenticated()) {
    // User is logged in
    const user = authManager.getCurrentUser();
    console.log(user.name, user.email);
}

// Login
await authManager.login(email, password);

// Register
await authManager.register(email, password, name);

// Logout
authManager.logout();
```

## API Service Usage

The `apiService` object is globally available and handles all API requests.

### Period Tracking

**Replace dummy data with:**

```javascript
// Get all periods
const { periods } = await apiService.getPeriods();

// Create new period
const { period } = await apiService.createPeriod({
    startDate: '2025-01-15',
    endDate: '2025-01-20',
    flowIntensity: 'medium',
    notes: 'Normal cycle'
});

// Update period
await apiService.updatePeriod(periodId, {
    endDate: '2025-01-21',
    notes: 'Updated notes'
});

// Daily logs
const { logs } = await apiService.getDailyLogs('2025-01-01', '2025-01-31');

await apiService.createDailyLog({
    periodEntryId: periodId,
    logDate: '2025-01-15',
    flowLevel: 'heavy',
    symptoms: ['cramps', 'headache'],
    mood: 'tired',
    notes: 'Heavy flow day'
});
```

### Pain Management

**Replace dummy data with:**

```javascript
// Get pain entries
const { painEntries } = await apiService.getPainEntries('2025-01-01', '2025-01-31');

// Create pain entry
const { painEntry } = await apiService.createPainEntry({
    entryDate: new Date().toISOString(),
    painLevel: 7,
    painLocations: ['abdomen', 'lower back'],
    painType: 'cramping',
    triggers: ['stress', 'lack of sleep'],
    remediesUsed: ['heating pad', 'ibuprofen'],
    effectivenessRating: 6,
    notes: 'Moderate pain, heating pad helped'
});

// Get analytics
const { analytics } = await apiService.getPainAnalytics();
console.log(analytics.averagePainLevel);
console.log(analytics.topTriggers);
```

### Device Connection

**Replace dummy data with:**

```javascript
// Get connected devices
const { devices } = await apiService.getDevices();

// Connect device
const { device } = await apiService.connectDevice(
    'device-uuid-123',
    'Binti Smart Pad Pro'
);

// Disconnect device
await apiService.disconnectDevice('device-uuid-123');

// Get sensor readings
const { readings } = await apiService.getDeviceReadings(
    'device-uuid-123',
    '2025-01-01',
    '2025-01-31'
);

// Create sensor reading
await apiService.createDeviceReading('device-uuid-123', {
    phLevel: 7.2,
    moistureLevel: 68,
    temperature: 37.1,
    flowRate: 'medium',
    volumeMl: 15.5
});
```

### Health Insights

**Replace dummy data with:**

```javascript
// Get dashboard data
const { dashboard } = await apiService.getDashboard();
console.log(dashboard.cycleInfo);
console.log(dashboard.recentPainLevel);
console.log(dashboard.deviceStatus);
console.log(dashboard.latestReading);

// Get health insights
const { insights } = await apiService.getHealthInsights(20, false);

// Create insight
await apiService.createHealthInsight({
    insightType: 'cycle_pattern',
    title: 'Cycle Regularity Improving',
    description: 'Your cycle has been more regular this month',
    dataPoints: { accuracy: 95, trend: 'improving' },
    priority: 'medium'
});

// Mark insight as read
await apiService.markInsightRead(insightId);
```

### Fertility Tracking

**Replace dummy data with:**

```javascript
// Get fertility data
const { fertilityData } = await apiService.getFertilityData('2025-01-01', '2025-01-31');

// Create fertility entry
await apiService.createFertilityEntry({
    trackingDate: '2025-01-15',
    basalTemperature: 36.8,
    cervicalMucus: 'egg white',
    ovulationTestResult: 'positive',
    fertilityWindow: true,
    notes: 'Peak fertility day'
});

// Get fertility window prediction
const { fertilityWindow } = await apiService.getFertilityWindow();
console.log(fertilityWindow.estimatedOvulation);
```

### Community

**Replace dummy data with:**

```javascript
// Get community posts
const { posts } = await apiService.getCommunityPosts('general', 20, 0);

// Create post
await apiService.createCommunityPost({
    title: 'My experience with period tracking',
    content: 'I wanted to share...',
    category: 'Share Your Story',
    isAnonymous: false
});

// Get single post with comments
const { post, comments } = await apiService.getPost(postId);

// Add comment
await apiService.createComment(postId, {
    content: 'Thanks for sharing!',
    isAnonymous: false
});

// Like post
await apiService.likePost(postId);

// Like comment
await apiService.likeComment(commentId);
```

### Notifications

**Replace dummy data with:**

```javascript
// Get notifications
const { notifications } = await apiService.getNotifications(false, 50);

// Get unread only
const { notifications } = await apiService.getNotifications(true, 50);

// Mark as read
await apiService.markNotificationRead(notificationId);

// Mark all as read
await apiService.markAllNotificationsRead();

// Get unread count
const { unreadCount } = await apiService.getUnreadCount();
```

### User Profile & Settings

**Replace dummy data with:**

```javascript
// Get user profile
const { user } = await apiService.getUserProfile();

// Update profile
await apiService.updateProfile({
    name: 'Jane Doe',
    dateOfBirth: '1995-05-15',
    averageCycleLength: 28,
    averagePeriodLength: 5,
    lastPeriodStart: '2025-01-10'
});

// Update settings
await apiService.updateSettings({
    notificationsEnabled: true,
    dataSharingEnabled: false,
    darkMode: true,
    language: 'en',
    units: 'metric',
    alertSensitivity: 'high'
});
```

## Updating Existing Components

### Example: Update Period Tracking Screen

**Before (with dummy data):**
```javascript
function initPeriodTracking() {
    const periods = [
        { date: '2025-01-10', flow: 'heavy' },
        { date: '2025-01-11', flow: 'medium' }
    ];
    renderPeriods(periods);
}
```

**After (with API):**
```javascript
async function initPeriodTracking() {
    try {
        const { periods } = await apiService.getPeriods();
        renderPeriods(periods);
    } catch (error) {
        console.error('Failed to load periods:', error);
        showToast('Failed to load period data');
    }
}
```

### Example: Update Dashboard

**Before (with dummy data):**
```javascript
function loadDashboard() {
    const data = {
        nextPeriod: 'July 8, 2025',
        avgPainLevel: 5,
        deviceConnected: true
    };
    renderDashboard(data);
}
```

**After (with API):**
```javascript
async function loadDashboard() {
    try {
        const { dashboard } = await apiService.getDashboard();
        renderDashboard(dashboard);
    } catch (error) {
        console.error('Failed to load dashboard:', error);
        showToast('Failed to load dashboard data');
    }
}
```

## Error Handling

Always wrap API calls in try-catch blocks:

```javascript
try {
    const result = await apiService.someMethod();
    // Handle success
} catch (error) {
    console.error('API error:', error);
    showToast('Operation failed: ' + error.message);
}
```

## Loading States

Show loading indicators during API calls:

```javascript
async function loadData() {
    showLoadingSpinner();
    try {
        const data = await apiService.getData();
        renderData(data);
    } catch (error) {
        showError(error);
    } finally {
        hideLoadingSpinner();
    }
}
```

## Authentication Required

All API endpoints (except `/auth/register` and `/auth/login`) require authentication. The `apiService` automatically includes the JWT token in requests.

If a request fails with 401 or 403, the user needs to login again:

```javascript
try {
    await apiService.someMethod();
} catch (error) {
    if (error.message.includes('token') || error.message.includes('auth')) {
        authManager.logout(); // Clears token and reloads
    }
}
```

## Testing API Integration

1. **Start backend locally**: `npm run dev`
2. **Start frontend**: `python -m http.server 8082`
3. **Register a test account**
4. **Test each feature** to ensure data persists
5. **Check browser console** for any errors
6. **Verify data in database** using Neon.tech SQL editor

## Production Checklist

- [ ] All dummy data replaced with API calls
- [ ] Error handling implemented
- [ ] Loading states added
- [ ] Authentication flow tested
- [ ] All features tested end-to-end
- [ ] Environment variables configured in Vercel
- [ ] Database migrated on Neon.tech
- [ ] CORS configured correctly
- [ ] SSL/HTTPS enabled

---

Your app now uses real data from PostgreSQL with no dummy data!
