class AuthManager {
    constructor() {
        this.currentUser = null;
        this.checkAuthStatus();
    }

    checkAuthStatus() {
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('userData');
        
        if (token && userData) {
            this.currentUser = JSON.parse(userData);
            return true;
        }
        return false;
    }

    async login(email, password) {
        try {
            const response = await apiService.login(email, password);
            this.currentUser = response.user;
            localStorage.setItem('userData', JSON.stringify(response.user));
            return response;
        } catch (error) {
            throw error;
        }
    }

    async register(email, password, name) {
        try {
            const response = await apiService.register(email, password, name);
            this.currentUser = response.user;
            localStorage.setItem('userData', JSON.stringify(response.user));
            return response;
        } catch (error) {
            throw error;
        }
    }

    logout() {
        this.currentUser = null;
        apiService.clearToken();
        localStorage.removeItem('userData');
        window.location.reload();
    }

    isAuthenticated() {
        return this.currentUser !== null && apiService.token !== null;
    }

    getCurrentUser() {
        return this.currentUser;
    }

    async loadUserProfile() {
        try {
            const response = await apiService.getUserProfile();
            this.currentUser = response.user;
            localStorage.setItem('userData', JSON.stringify(response.user));
            return response.user;
        } catch (error) {
            console.error('Failed to load user profile:', error);
            throw error;
        }
    }
}

function showLoginModal() {
    const modalContent = `
        <div class="auth-modal">
            <div class="modal-header">
                <h3>Welcome to Binti Health</h3>
                <button class="close-modal-btn" onclick="window.app.closeModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="auth-tabs">
                    <button class="auth-tab active" data-tab="login">Login</button>
                    <button class="auth-tab" data-tab="register">Register</button>
                </div>
                
                <div id="login-form" class="auth-form active">
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" id="login-email" class="form-control" placeholder="Enter your email">
                    </div>
                    <div class="form-group">
                        <label>Password</label>
                        <input type="password" id="login-password" class="form-control" placeholder="Enter your password">
                    </div>
                    <div id="login-error" class="error-message" style="display: none;"></div>
                    <button class="btn btn-primary btn-block" onclick="handleLogin()">
                        <i class="fas fa-sign-in-alt"></i> Login
                    </button>
                </div>
                
                <div id="register-form" class="auth-form">
                    <div class="form-group">
                        <label>Full Name</label>
                        <input type="text" id="register-name" class="form-control" placeholder="Enter your name">
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" id="register-email" class="form-control" placeholder="Enter your email">
                    </div>
                    <div class="form-group">
                        <label>Password</label>
                        <input type="password" id="register-password" class="form-control" placeholder="At least 8 characters">
                    </div>
                    <div id="register-error" class="error-message" style="display: none;"></div>
                    <button class="btn btn-primary btn-block" onclick="handleRegister()">
                        <i class="fas fa-user-plus"></i> Create Account
                    </button>
                </div>
            </div>
        </div>
    `;
    
    window.app.showModal(modalContent);
    
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
            
            this.classList.add('active');
            const tabName = this.getAttribute('data-tab');
            document.getElementById(`${tabName}-form`).classList.add('active');
        });
    });
}

async function handleLogin() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const errorEl = document.getElementById('login-error');
    
    if (!email || !password) {
        errorEl.textContent = 'Please enter both email and password';
        errorEl.style.display = 'block';
        return;
    }
    
    try {
        await authManager.login(email, password);
        window.app.closeModal();
        
        // Hide overlay after closing modal
        const overlay = document.getElementById('app-overlay');
        if (overlay) {
            overlay.classList.remove('visible');
        }
        
        showToast('Login successful! Welcome back.');
        await initializeAppWithUser();
    } catch (error) {
        errorEl.textContent = error.message || 'Login failed. Please check your credentials.';
        errorEl.style.display = 'block';
    }
}

async function handleRegister() {
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const errorEl = document.getElementById('register-error');
    
    if (!name || !email || !password) {
        errorEl.textContent = 'Please fill in all fields';
        errorEl.style.display = 'block';
        return;
    }
    
    if (password.length < 8) {
        errorEl.textContent = 'Password must be at least 8 characters';
        errorEl.style.display = 'block';
        return;
    }
    
    try {
        await authManager.register(email, password, name);
        window.app.closeModal();
        showToast('Account created successfully! Welcome to Binti Health.');
        await initializeAppWithUser();
    } catch (error) {
        errorEl.textContent = error.message || 'Registration failed. Please try again.';
        errorEl.style.display = 'block';
    }
}

async function initializeAppWithUser() {
    try {
        const user = await authManager.loadUserProfile();
        
        // Initialize userProfile in appState
        appState.userProfile = {
            name: user.name,
            email: user.email,
            membershipType: user.membership_type,
            cycleData: {
                averageCycleLength: user.average_cycle_length || 28,
                averagePeriodLength: user.average_period_length || 5,
                lastPeriodStart: user.last_period_start ? new Date(user.last_period_start) : null,
                nextPeriodEstimate: user.next_period_estimate ? new Date(user.next_period_estimate) : null
            }
        };
        
        // Update UI elements
        const userNameEl = document.getElementById('user-name');
        if (userNameEl) {
            userNameEl.textContent = user.name;
        }
        
        const membershipEl = document.getElementById('user-membership');
        if (membershipEl) {
            membershipEl.textContent = user.membership_type === 'premium' ? 'Premium Member' : 'Free Member';
        }
        
        // Load avatar from server (preferred) or localStorage (fallback)
        const serverAvatar = user.avatar_url;
        const localAvatar = localStorage.getItem('userAvatar');
        const avatarToUse = serverAvatar || localAvatar;
        
        if (avatarToUse) {
            console.log('✓ Found avatar:', serverAvatar ? 'from server' : 'from localStorage');
            setTimeout(() => {
                const avatarElements = document.querySelectorAll('#user-avatar, .user-avatar img');
                console.log(`✓ Found ${avatarElements.length} avatar elements to update`);
                avatarElements.forEach(el => {
                    el.src = avatarToUse;
                    console.log('✓ Updated avatar element');
                });
                
                // Update localStorage with server avatar if available
                if (serverAvatar) {
                    localStorage.setItem('userAvatar', serverAvatar);
                }
            }, 100);
        } else {
            console.log('⚠ No avatar found');
        }
        
        // Load saved dark mode preference
        const savedDarkMode = localStorage.getItem('darkMode');
        if (savedDarkMode === 'true') {
            document.body.classList.add('dark-mode');
            appState.settings.darkMode = true;
        }
        
        // Reload current screen with user data
        if (window.loadScreen) {
            loadScreen(appState.currentScreen);
        }
        
        // Load notifications count
        if (window.apiService) {
            apiService.getUnreadCount().then(response => {
                const badge = document.getElementById('notification-count');
                if (badge && response.unreadCount > 0) {
                    badge.textContent = response.unreadCount;
                    badge.style.display = 'block';
                }
            }).catch(err => console.error('Failed to load notification count:', err));
        }
    } catch (error) {
        console.error('Failed to initialize user data:', error);
        showToast('Failed to load user profile');
    }
}

const authManager = new AuthManager();
window.authManager = authManager;
window.showLoginModal = showLoginModal;
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
window.initializeAppWithUser = initializeAppWithUser;
