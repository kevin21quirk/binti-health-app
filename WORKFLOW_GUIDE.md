# Binti Health App - User Workflow Guide

## Period Tracking Workflow

### How to Track Your Period

**Method 1: Using the + Button (FAB)**
1. Navigate to the **Period** tab (bottom navigation)
2. Click the red **+ button** (floating action button)
3. Fill in the period entry form:
   - **Start Date**: When your period started (defaults to today)
   - **End Date**: When it ended (optional - can add later)
   - **Flow Intensity**: Light, Medium, or Heavy (optional)
   - **Notes**: Any symptoms or observations (optional)
4. Click **Save Period**
5. Your period is now saved and will appear on the calendar

**Method 2: Clicking Calendar Days**
1. Navigate to the **Period** tab
2. Click any day on the calendar
3. The period entry form opens with that date pre-selected
4. Fill in the details and save

### What Happens After Saving

When you save a period entry:
- ✅ Data is saved to your PostgreSQL database
- ✅ Calendar updates to show your period days (purple)
- ✅ Period History list updates with your new entry
- ✅ Cycle statistics recalculate (average cycle length, period length)
- ✅ Next period prediction updates based on your data
- ✅ Dashboard shows updated predictions

### Understanding the Calendar

**Calendar Legend:**
- **Purple days** = Your period days (from tracked data)
- **Red days** = Fertile window (5 days before ovulation)
- **Orange day** = Predicted ovulation day
- **Blue outline** = Today

### First-Time User Flow

**Step 1: Register/Login**
- Open the app
- Login modal appears automatically
- Create an account or login

**Step 2: Track Your First Period**
- Go to Period tab
- Click the + button
- Enter your last period start date
- Save

**Step 3: See Your Data**
- Calendar shows your period days
- Period History shows your entry
- Cycle Statistics calculate averages
- Dashboard shows next period prediction

**Step 4: Continue Tracking**
- Track each new period as it starts
- App learns your cycle pattern
- Predictions become more accurate

## Pain Management Workflow

### How to Log Pain

1. Navigate to **Pain Management** tab
2. Click the red **+ button**
3. Fill in pain details:
   - Pain level (0-10 slider)
   - Pain locations (checkboxes)
   - Pain type (cramping, sharp, etc.)
   - Notes
4. Click **Save**
5. Pain entry appears in your journal

### What You'll See

- Pain chart showing your pain levels over time
- Pain journal with all your entries
- Patterns and triggers identified
- Remedy recommendations

## Health Insights Workflow

### Viewing Your Health Data

1. Navigate to **Insights** tab
2. See your health metrics (when device connected)
3. View monthly trends
4. Get personalized recommendations

**Note**: Most insights require tracking data or Smart Pad connection

## Leak Prevention Workflow

### Getting Flow Predictions

1. Track at least 2-3 periods
2. Navigate to **Leaks** tab
3. See flow predictions for your next period
4. Get protection recommendations by day
5. Enable smart alerts (requires Smart Pad)

## Device Connection Workflow

### Connecting Your Smart Pad

1. Navigate to **Connect** tab
2. Ensure Smart Pad is nearby and powered on
3. Press the button on your Smart Pad
4. Click **Connect to Smart Pad** in the app
5. Allow Bluetooth permissions
6. Wait for connection
7. Once connected, sensor data syncs automatically

**What You Get:**
- Real-time pH monitoring
- Flow volume tracking
- Temperature sensing
- Automatic leak alerts
- Enhanced health insights

## Community Workflow

**Note**: Community features are coming soon in a future update.

## Data Flow Summary

```
User Action → API Call → PostgreSQL Database → Data Retrieved → UI Updates
```

**Example: Tracking a Period**
1. User fills form and clicks Save
2. `apiService.createPeriod()` sends data to backend
3. Backend saves to `periods` table in PostgreSQL
4. Backend calculates next period prediction
5. Frontend reloads screen
6. `loadCalendarPeriodData()` fetches periods from API
7. Calendar marks period days
8. Period History shows new entry
9. Dashboard updates predictions

## Tips for Best Results

### Period Tracking
- ✅ Track every period consistently
- ✅ Add end dates when period finishes
- ✅ Note flow intensity for better predictions
- ✅ Track at least 3 cycles for accurate predictions

### Pain Management
- ✅ Log pain when it happens (not later)
- ✅ Be specific about locations
- ✅ Note what helps (remedies)
- ✅ Track patterns over multiple cycles

### General
- ✅ Login regularly to keep data synced
- ✅ Enable notifications for reminders
- ✅ Connect Smart Pad for advanced features
- ✅ Review insights weekly

## Troubleshooting

**Period not showing on calendar?**
- Refresh the page
- Check you're logged in
- Verify the date was saved (check Period History)

**+ Button not working?**
- Ensure you're logged in
- Check browser console for errors
- Try refreshing the page

**Predictions not accurate?**
- Track at least 3 complete cycles
- Ensure you're adding end dates
- Predictions improve with more data

**Can't connect Smart Pad?**
- Use Chrome, Edge, or Opera browser
- Enable Bluetooth on your device
- Press button on Smart Pad first
- Ensure Smart Pad is charged

## Privacy & Data

- All data is stored securely in PostgreSQL
- Data is encrypted in transit (HTTPS)
- Only you can see your health data
- Data is never shared without permission
- You can export or delete your data anytime
