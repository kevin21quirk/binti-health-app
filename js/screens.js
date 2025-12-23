/**
 * Binti International Health App
 * Screen-specific initialization and functionality
 */

// Dashboard Screen
function initDashboard() {
    const dashboardScreen = document.getElementById('dashboard');
    if (!dashboardScreen) return;
    
    // Create cycle overview
    createCycleOverview(dashboardScreen);
    
    // Create today's insights
    createDailyInsights(dashboardScreen);
    
    // Create quick action buttons
    createQuickActions(dashboardScreen);
    
    // Create upcoming events/reminders
    createUpcomingEvents(dashboardScreen);
}

// Period Tracking Screen
function initPeriodTracking() {
    console.log('📅 initPeriodTracking called');
    const periodScreen = document.getElementById('period-tracking');
    if (!periodScreen) {
        console.error('❌ Period screen element not found');
        return;
    }
    
    console.log('✓ Period screen found, creating components...');
    
    // Create monthly calendar
    console.log('Creating calendar...');
    createPeriodCalendar(periodScreen);
    console.log('✓ Calendar created');
    
    // Create cycle statistics
    console.log('Creating cycle statistics...');
    createCycleStatistics(periodScreen);
    console.log('✓ Cycle statistics created');
    
    // Create period history
    console.log('Creating period history...');
    createPeriodHistory(periodScreen);
    console.log('✓ Period history created');
    
    console.log('✅ Period tracking initialization complete');
}

// Pain Management Screen - initialization handled by pain-management.js
// Removed duplicate function that was causing sections to appear twice

// Leak Prevention Screen
function initLeakPrevention() {
    const leakScreen = document.getElementById('leak-prevention');
    if (!leakScreen) return;
    
    // Initialize leak prevention content using the new function that prevents duplication
    if (typeof ensureLeakPreventionInitialized === 'function') {
        ensureLeakPreventionInitialized(leakScreen);
    }
    
    // Load real data
    if (window.updateLeakPreventionData) {
        setTimeout(() => updateLeakPreventionData(), 500);
    }
}

// Health Insights Screen
function initHealthInsights() {
    const insightsScreen = document.getElementById('health-insights');
    if (!insightsScreen) return;
    
    // Create health metrics overview
    createHealthMetrics(insightsScreen);
    
    // Create trend analysis
    createHealthTrends(insightsScreen);
    
    // Create smart pad insights
    createSmartPadInsights(insightsScreen);
}

// Community Screen
let communityInitialized = false;

function initCommunity() {
    const communityScreen = document.getElementById('community');
    if (!communityScreen) return;
    
    // Avoid duplicate initialization
    if (communityInitialized) return;
    
    // Clear any existing content
    while (communityScreen.firstChild) {
        communityScreen.removeChild(communityScreen.firstChild);
    }
    
    // Create community feed
    createCommunityFeed(communityScreen);
    
    // Create trending topics
    createTrendingTopics(communityScreen);
    
    // Mark as initialized
    communityInitialized = true;
}

// Device Connection Screen
function initDeviceConnection() {
    const deviceScreen = document.getElementById('device-connection');
    if (!deviceScreen) return;
    
    // Create connection interface
    createDeviceInterface(deviceScreen);
    
    // Update connection status based on app state
    updateDeviceConnectionUI();
    
    // Setup connect button handlers
    setupDeviceConnectionHandlers(deviceScreen);
}

// Settings Screen
function initSettings() {
    const settingsScreen = document.getElementById('settings');
    if (!settingsScreen) return;
    
    // Create settings form
    createSettingsForm(settingsScreen);
    
    // Setup setting change handlers
    setupSettingChangeHandlers(settingsScreen);
}

// Help & Support Screen
function initHelpSupport() {
    const helpScreen = document.getElementById('help-support');
    if (!helpScreen) return;
    
    // Check if already initialized to prevent duplicates
    if (helpScreen.dataset.initialized === 'true') {
        return;
    }
    
    // Clear any existing content
    helpScreen.innerHTML = '';
    
    // Create FAQ section
    createFAQSection(helpScreen);
    
    // Create contact form
    createContactForm(helpScreen);
    
    // Create help resources
    createHelpResources(helpScreen);
    
    // Mark as initialized
    helpScreen.dataset.initialized = 'true';
}

// We'll implement the specific component functions in separate files
// to keep the code organized and manageable
