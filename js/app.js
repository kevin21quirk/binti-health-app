/**
 * Binti International Health App
 * Core application functionality
 */

// App state
const appState = {
    currentScreen: 'dashboard',
    isDrawerOpen: false,
    isNotificationsPanelOpen: false,
    isDeviceConnected: false,
    deviceData: null,
    userProfile: null,
    loginModalShown: false,
    settings: {
        notifications: true,
        dataSharing: false,
        darkMode: false,
        language: 'en',
        units: 'metric',
    }
};

// DOM Elements
let elements = {};

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Binti App: DOMContentLoaded - Starting initialization');
    
    // Cache DOM elements
    cacheElements();
    console.log('✓ DOM elements cached');
    
    // Initialize UI components
    initializeUI();
    console.log('✓ UI initialized');
    
    // Setup event listeners
    setupEventListeners();
    console.log('✓ Event listeners setup');
    
    // Check if user is authenticated
    const isAuthenticated = window.authManager && window.authManager.isAuthenticated();
    console.log('Auth status:', isAuthenticated);
    
    if (isAuthenticated) {
        // Load user data and initialize app
        window.initializeAppWithUser().then(() => {
            console.log('✓ User data loaded');
            loadScreen(appState.currentScreen);
        });
    } else {
        // Load screen without user data (will show empty states)
        console.log('Loading screen without auth');
        loadScreen(appState.currentScreen);
    }
    
    // Show app content with professional animations
    setTimeout(() => {
        // Fade out splash screen with animation
        const splashScreen = document.getElementById('splash-screen');
        splashScreen.classList.add('fade-out');
        
        // After splash animation completes, show app with zoom-in effect
        setTimeout(() => {
            splashScreen.style.visibility = 'hidden';
            document.getElementById('app-container').classList.remove('hidden');
            document.getElementById('app-container').classList.add('zoom-in');
            
            // Show login modal if not authenticated
            if (!isAuthenticated) {
                setTimeout(() => {
                    window.showLoginModal();
                }, 500);
            }
            
            // Add staggered entrance effects to dashboard elements
            const dashboardCards = document.querySelectorAll('#dashboard .card');
            dashboardCards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('slide-in-right');
                    card.style.opacity = '1';
                }, 100 * index);
            });
        }, 500);
    }, 2000); // Reduced to 2 seconds for faster load
});

// Cache frequently used DOM elements
function cacheElements() {
    elements = {
        // Main containers
        appContainer: document.getElementById('app-container'),
        mainContent: document.getElementById('main-content'),
        screenContainer: document.getElementById('screen-container'),
        
        // Navigation elements
        drawer: document.getElementById('side-drawer'),
        drawerItems: document.querySelectorAll('.drawer-item'),
        bottomNavItems: document.querySelectorAll('.nav-item'),
        headerTitle: document.querySelector('.header-title'),
        
        // Action buttons
        menuToggle: document.getElementById('menu-toggle'),
        closeDrawer: document.getElementById('close-drawer'),
        notificationsToggle: document.getElementById('notifications-toggle'),
        fabButton: document.getElementById('fab-button'),
        
        // Panels and overlays
        notificationsPanel: document.getElementById('notifications-panel'),
        appOverlay: document.getElementById('app-overlay'),
        modalContainer: document.getElementById('modal-container'),
        
        // Screens
        screens: document.querySelectorAll('.screen')
    };
}

// Initialize UI components
function initializeUI() {
    // Update header title based on initial screen
    updateHeaderTitle(appState.currentScreen);
    
    // Initialize components that need setup
    // Device connection only happens when user manually connects via BLE
}

// Setup event listeners
function setupEventListeners() {
    // Drawer toggle
    elements.menuToggle.addEventListener('click', toggleDrawer);
    elements.closeDrawer.addEventListener('click', closeDrawer);
    
    // Drawer navigation
    elements.drawerItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetScreen = item.getAttribute('href').substring(1);
            navigateToScreen(targetScreen);
            closeDrawer();
        });
    });
    
    // Bottom navigation
    elements.bottomNavItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetScreen = item.getAttribute('href').substring(1);
            navigateToScreen(targetScreen);
        });
    });
    
    // Notifications panel
    elements.notificationsToggle.addEventListener('click', toggleNotificationsPanel);
    document.querySelector('.close-panel').addEventListener('click', closeNotificationsPanel);
    
    // Overlay click to close panels/modals
    elements.appOverlay.addEventListener('click', () => {
        if (appState.isDrawerOpen) closeDrawer();
        if (appState.isNotificationsPanelOpen) closeNotificationsPanel();
        closeModal();
    });
    
    // FAB button
    elements.fabButton.addEventListener('click', handleFABAction);
    
    // Handle back button (for mobile)
    window.addEventListener('popstate', (e) => {
        if (appState.isDrawerOpen) {
            e.preventDefault();
            closeDrawer();
        } else if (appState.isNotificationsPanelOpen) {
            e.preventDefault();
            closeNotificationsPanel();
        }
    });
}

// Navigation Functions
function navigateToScreen(screenId) {
    // Don't navigate if we're already on this screen
    if (screenId === appState.currentScreen) return;
    
    // Scroll to top of page
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Also scroll the main content container to top
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
        mainContent.scrollTop = 0;
    }
    
    // Update URL hash without triggering reload
    window.history.pushState({}, '', `#${screenId}`);
    
    // Load the screen content
    loadScreen(screenId);
    
    // Update app state
    appState.currentScreen = screenId;
    
    // Update UI to reflect current screen
    updateActiveNavItems(screenId);
    updateHeaderTitle(screenId);
}

function loadScreen(screenId) {
    console.log('📱 Loading screen:', screenId);
    
    // Scroll to top when loading screen
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
        mainContent.scrollTop = 0;
    }
    
    // Hide all screens
    elements.screens.forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show the requested screen
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
        appState.currentScreen = screenId;
        console.log('✓ Screen activated:', screenId);
        
        // Scroll the target screen to top as well
        targetScreen.scrollTop = 0;
        
        // Update header title
        updateHeaderTitle(screenId);
        
        // Update navigation active states
        updateActiveNavItems(screenId);
        
        // Initialize screen-specific functionality
        if (screenId === 'pain-management') {
            // Initialize pain management functionality
            initPainManagement();
        } else if (screenId === 'fertility-tracking') {
            // Initialize fertility tracking functionality
            initFertilityTracking();
        }
        console.log('🔧 Initializing screen content for:', screenId);
        initializeScreenContent(screenId);
        console.log('✓ Screen initialization complete');
    } else {
        console.error('❌ Screen not found:', screenId);
    }
}

function updateActiveNavItems(screenId) {
    // Update drawer items active state
    elements.drawerItems.forEach(item => {
        const itemTarget = item.getAttribute('href').substring(1);
        if (itemTarget === screenId) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
    
    // Update bottom nav items active state
    elements.bottomNavItems.forEach(item => {
        const itemTarget = item.getAttribute('href').substring(1);
        if (itemTarget === screenId) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

function updateHeaderTitle(screenId) {
    let title = 'Binti Health';
    
    switch(screenId) {
        case 'dashboard':
            title = 'Binti Health';
            break;
        case 'period-tracking':
            title = 'Period Tracking';
            break;
        case 'pain-management':
            title = 'Pain Management';
            break;
        case 'fertility-tracking':
            title = 'Fertility Tracking';
            break;
        case 'leak-prevention':
            title = 'Leak Prevention';
            break;
        case 'health-insights':
            title = 'Health Insights';
            break;
        case 'community':
            title = 'Community';
            break;
        // Add more cases for other screens
    }
    
    elements.headerTitle.textContent = title;
}

// UI Control Functions
function toggleDrawer() {
    if (appState.isDrawerOpen) {
        closeDrawer();
    } else {
        openDrawer();
    }
}

function openDrawer() {
    AnimationController.animateDrawerOpen(elements.drawer);
    appState.isDrawerOpen = true;
}

function closeDrawer() {
    AnimationController.animateDrawerClose(elements.drawer);
    appState.isDrawerOpen = false;
}

function toggleNotificationsPanel() {
    if (appState.isNotificationsPanelOpen) {
        closeNotificationsPanel();
    } else {
        openNotificationsPanel();
    }
}

function openNotificationsPanel() {
    AnimationController.animateNotificationsOpen(elements.notificationsPanel);
    appState.isNotificationsPanelOpen = true;
}

function closeNotificationsPanel() {
    AnimationController.animateNotificationsClose(elements.notificationsPanel);
    appState.isNotificationsPanelOpen = false;
}

function showModal(content) {
    console.log('🎭 showModal called, content length:', content?.length);
    const modalContent = document.getElementById('modal-content');
    console.log('Modal content element:', modalContent);
    
    if (!modalContent) {
        console.error('❌ Modal content element not found!');
        return;
    }
    
    modalContent.innerHTML = content;
    console.log('✓ Modal HTML set');
    
    console.log('Modal container:', elements.modalContainer);
    console.log('AnimationController:', AnimationController);
    console.log('AnimationController.animateModalOpen:', typeof AnimationController?.animateModalOpen);
    
    if (AnimationController && typeof AnimationController.animateModalOpen === 'function') {
        AnimationController.animateModalOpen(elements.modalContainer);
        console.log('✓ Modal animation triggered');
    } else {
        console.error('❌ AnimationController.animateModalOpen not available');
        // Fallback: show modal without animation
        if (elements.modalContainer) {
            elements.modalContainer.classList.remove('modal-hidden');
            elements.modalContainer.classList.add('modal-visible');
            console.log('✓ Modal shown with fallback (no animation)');
        }
    }
}

function closeModal() {
    AnimationController.animateModalClose(elements.modalContainer);
}

// Action Handlers
function handleFABAction() {
    console.log('🔘 FAB button clicked! Current screen:', appState.currentScreen);
    
    // Animate the FAB button
    if (AnimationController && AnimationController.animateFab) {
        AnimationController.animateFab(elements.fabButton);
    }
    
    // Change FAB action based on current screen
    switch(appState.currentScreen) {
        case 'period-tracking':
            console.log('📅 Opening period entry modal...');
            // Show period entry modal with animation
            if (window.showPeriodEntryModal) {
                console.log('✓ showPeriodEntryModal found, calling it');
                window.showPeriodEntryModal();
            } else {
                console.error('❌ showPeriodEntryModal not available');
                console.log('Available window functions:', Object.keys(window).filter(k => k.includes('show')));
            }
            break;
        case 'pain-management':
            // Show pain entry modal with animation
            if (window.showPainEntryModal) {
                window.showPainEntryModal();
            }
            break;
        case 'health-insights':
            // Show health data entry modal with animation
            if (window.showHealthDataEntryModal) {
                window.showHealthDataEntryModal();
            }
            break;
        case 'leak-prevention':
            // Show leak alert settings modal
            showLeakAlertModal();
            break;
        case 'community':
            // Show new post modal with animation
            showNewPostModal();
            break;
        default:
            // Default action - show quick actions modal with animation
            if (window.showQuickActionsModal) {
                window.showQuickActionsModal();
            }
            break;
    }
}

// Function to show new post modal for community section
function showNewPostModal() {
    showModal(`
        <div class="modal-header">
            <h3>Create New Community Post</h3>
        </div>
        <div class="modal-body">
            <div class="form-group">
                <label>Post Title</label>
                <input type="text" placeholder="Enter a title for your post" class="form-control">
            </div>
            <div class="form-group">
                <label>Category</label>
                <select class="form-control">
                    <option>General Discussion</option>
                    <option>Questions & Answers</option>
                    <option>Share Your Story</option>
                    <option>Tips & Tricks</option>
                </select>
            </div>
            <div class="form-group">
                <label>Your Message</label>
                <textarea placeholder="What would you like to share with the community?" class="form-control" rows="4"></textarea>
            </div>
            <div class="attachment-options">
                <button class="btn btn-small btn-outline">
                    <i class="fas fa-image"></i> Add Photo
                </button>
                <button class="btn btn-small btn-outline">
                    <i class="fas fa-paperclip"></i> Attachment
                </button>
                <button class="btn btn-small btn-outline">
                    <i class="fas fa-poll"></i> Poll
                </button>
            </div>
        </div>
        <div class="modal-footer">
            <button class="btn btn-outline" onclick="window.app.closeModal()">
                Cancel
            </button>
            <button class="btn btn-primary" onclick="window.app.closeModal(); showToast('Post submitted to the community!')">
                <i class="fas fa-paper-plane"></i> Post
            </button>
        </div>
    `);
}

// Device connection is handled by BLE manager in device-connection.js
// No simulation - only real BLE connections

// Function to show leak alert settings modal
function showLeakAlertModal() {
    showModal(`
        <div class="modal-header">
            <h3>Configure Leak Alerts</h3>
        </div>
        <div class="modal-body">
            <div class="form-group">
                <label>Alert Sensitivity</label>
                <select class="form-control">
                    <option>High (Alert at 65% saturation)</option>
                    <option selected>Medium (Alert at 75% saturation)</option>
                    <option>Low (Alert at 85% saturation)</option>
                </select>
            </div>
            <div class="form-group">
                <label>Alert Methods</label>
                <div class="checkbox-group">
                    <div class="checkbox-item">
                        <input type="checkbox" id="push-alerts" checked>
                        <label for="push-alerts">Push Notifications</label>
                    </div>
                    <div class="checkbox-item">
                        <input type="checkbox" id="sound-alerts" checked>
                        <label for="sound-alerts">Sound Alert</label>
                    </div>
                    <div class="checkbox-item">
                        <input type="checkbox" id="vibration-alerts" checked>
                        <label for="vibration-alerts">Vibration</label>
                    </div>
                </div>
            </div>
            <div class="form-group">
                <label>Advanced Settings</label>
                <div class="toggle-setting">
                    <span>Alert Only During Active Hours</span>
                    <div class="toggle-switch small">
                        <input type="checkbox" id="active-hours" checked>
                        <label for="active-hours" class="toggle-slider"></label>
                    </div>
                </div>
                <div class="toggle-setting">
                    <span>Enhanced Alerts During Heavy Flow Days</span>
                    <div class="toggle-switch small">
                        <input type="checkbox" id="heavy-flow" checked>
                        <label for="heavy-flow" class="toggle-slider"></label>
                    </div>
                </div>
                <div class="toggle-setting">
                    <span>Night Mode (Quieter Alerts)</span>
                    <div class="toggle-switch small">
                        <input type="checkbox" id="night-mode">
                        <label for="night-mode" class="toggle-slider"></label>
                    </div>
                </div>
            </div>
            <div class="helper-text">
                <i class="fas fa-info-circle"></i>
                <span>Your Binti Smart Pad connects to this app via Bluetooth to provide real-time data and alerts.</span>
            </div>
        </div>
        <div class="modal-footer">
            <button class="btn btn-outline" onclick="window.app.closeModal()">
                Cancel
            </button>
            <button class="btn btn-primary" onclick="window.app.closeModal(); showToast('Leak alert settings updated!')">
                Save Settings
            </button>
        </div>
    `);
}

// Export functions and state for other modules
window.appState = appState;
window.app = {
    navigateToScreen,
    showModal,
    closeModal,
    toggleDrawer,
    toggleNotificationsPanel,
    updateHeaderTitle,
    handleFABAction
};
