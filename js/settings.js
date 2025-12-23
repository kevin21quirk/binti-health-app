/**
 * Settings Screen Functionality
 */

function createSettingsForm(container) {
    const settingsEl = document.createElement('div');
    settingsEl.className = 'settings-container';
    
    settingsEl.innerHTML = `
        <div class="settings-section">
            <h2>Account Settings</h2>
            
            <div class="setting-item">
                <div class="setting-info">
                    <h3>Profile Image</h3>
                    <p>Upload your profile picture</p>
                </div>
                <button class="btn btn-outline" onclick="showProfileImageModal()">
                    <i class="fas fa-camera"></i> Change Photo
                </button>
            </div>
            
            <div class="setting-item">
                <div class="setting-info">
                    <h3>Profile Information</h3>
                    <p>Update your name and email</p>
                </div>
                <button class="btn btn-outline" onclick="showProfileEditModal()">
                    <i class="fas fa-edit"></i> Edit Profile
                </button>
            </div>
            
            <div class="setting-item">
                <div class="setting-info">
                    <h3>Change Password</h3>
                    <p>Update your account password</p>
                </div>
                <button class="btn btn-outline" onclick="showPasswordChangeModal()">
                    <i class="fas fa-key"></i> Change Password
                </button>
            </div>
        </div>
        
        <div class="settings-section">
            <h2>Notifications</h2>
            
            <div class="setting-item">
                <div class="setting-info">
                    <h3>Period Reminders</h3>
                    <p>Get notified before your period starts</p>
                </div>
                <label class="toggle-switch">
                    <input type="checkbox" id="period-reminders" ${appState.settings.notifications ? 'checked' : ''}>
                    <span class="toggle-slider"></span>
                </label>
            </div>
            
            <div class="setting-item">
                <div class="setting-info">
                    <h3>Medication Reminders</h3>
                    <p>Reminders for pain medication</p>
                </div>
                <label class="toggle-switch">
                    <input type="checkbox" id="medication-reminders" ${appState.settings.notifications ? 'checked' : ''}>
                    <span class="toggle-slider"></span>
                </label>
            </div>
        </div>
        
        <div class="settings-section">
            <h2>Privacy</h2>
            
            <div class="setting-item">
                <div class="setting-info">
                    <h3>Data Sharing</h3>
                    <p>Share anonymous data for research</p>
                </div>
                <label class="toggle-switch">
                    <input type="checkbox" id="data-sharing" ${appState.settings.dataSharing ? 'checked' : ''}>
                    <span class="toggle-slider"></span>
                </label>
            </div>
        </div>
        
        <div class="settings-section">
            <h2>Appearance</h2>
            
            <div class="setting-item">
                <div class="setting-info">
                    <h3>Dark Mode</h3>
                    <p>Use dark theme</p>
                </div>
                <label class="toggle-switch">
                    <input type="checkbox" id="dark-mode" ${appState.settings.darkMode ? 'checked' : ''}>
                    <span class="toggle-slider"></span>
                </label>
            </div>
        </div>
        
        <div class="settings-section">
            <h2>Account Actions</h2>
            
            <div class="setting-item">
                <button class="btn btn-danger" onclick="handleLogout()">
                    <i class="fas fa-sign-out-alt"></i> Logout
                </button>
            </div>
        </div>
    `;
    
    container.appendChild(settingsEl);
}

function setupSettingChangeHandlers(container) {
    // Period reminders toggle
    const periodReminders = container.querySelector('#period-reminders');
    if (periodReminders) {
        periodReminders.addEventListener('change', (e) => {
            appState.settings.notifications = e.target.checked;
            showToast(e.target.checked ? 'Period reminders enabled' : 'Period reminders disabled');
        });
    }
    
    // Medication reminders toggle
    const medicationReminders = container.querySelector('#medication-reminders');
    if (medicationReminders) {
        medicationReminders.addEventListener('change', (e) => {
            showToast(e.target.checked ? 'Medication reminders enabled' : 'Medication reminders disabled');
        });
    }
    
    // Data sharing toggle
    const dataSharing = container.querySelector('#data-sharing');
    if (dataSharing) {
        dataSharing.addEventListener('change', (e) => {
            appState.settings.dataSharing = e.target.checked;
            showToast(e.target.checked ? 'Data sharing enabled' : 'Data sharing disabled');
        });
    }
    
    // Dark mode toggle
    const darkMode = container.querySelector('#dark-mode');
    if (darkMode) {
        darkMode.addEventListener('change', (e) => {
            appState.settings.darkMode = e.target.checked;
            document.body.classList.toggle('dark-mode', e.target.checked);
            // Save dark mode preference to localStorage
            localStorage.setItem('darkMode', e.target.checked);
            showToast(e.target.checked ? 'Dark mode enabled' : 'Dark mode disabled');
        });
    }
}

function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        appState.userProfile = null;
        showToast('Logged out successfully');
        
        // Reload page to show login screen
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }
}

function showProfileEditModal() {
    const user = appState.userProfile;
    const modalContent = `
        <div class="modal-header">
            <h3>Edit Profile</h3>
            <button class="close-modal-btn" onclick="window.app.closeModal()">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="modal-body">
            <div class="form-group">
                <label>Name</label>
                <input type="text" id="profile-name" class="form-control" value="${user?.name || ''}">
            </div>
            <div class="form-group">
                <label>Email</label>
                <input type="email" id="profile-email" class="form-control" value="${user?.email || ''}" disabled>
                <small>Email cannot be changed</small>
            </div>
            <div id="profile-error" class="error-message" style="display: none;"></div>
        </div>
        <div class="modal-footer">
            <button class="btn btn-outline" onclick="window.app.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="saveProfileChanges()">
                <i class="fas fa-save"></i> Save Changes
            </button>
        </div>
    `;
    
    window.app.showModal(modalContent);
}

function showProfileImageModal() {
    const currentAvatar = document.getElementById('user-avatar')?.src || 'images/avatar-placeholder.jpg';
    
    const modalContent = `
        <div class="modal-header">
            <h3>Change Profile Photo</h3>
            <button class="close-modal-btn" onclick="window.app.closeModal()">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="modal-body">
            <div class="profile-image-preview">
                <img id="image-preview" src="${currentAvatar}" alt="Profile Preview" style="width: 150px; height: 150px; border-radius: 50%; object-fit: cover; margin: 20px auto; display: block; border: 3px solid #8a2be2;">
            </div>
            
            <div class="photo-options" style="display: flex; gap: 10px; margin: 20px 0;">
                <button class="btn btn-primary" onclick="triggerCamera()" style="flex: 1;">
                    <i class="fas fa-camera"></i> Take Photo
                </button>
                <button class="btn btn-outline" onclick="triggerGallery()" style="flex: 1;">
                    <i class="fas fa-images"></i> Choose from Gallery
                </button>
            </div>
            
            <input type="file" id="profile-image-input" accept="image/*" capture="environment" style="display: none;" onchange="previewProfileImage(event)">
            <input type="file" id="profile-gallery-input" accept="image/*" style="display: none;" onchange="previewProfileImage(event)">
            
            <div id="image-error" class="error-message" style="display: none;"></div>
        </div>
        <div class="modal-footer">
            <button class="btn btn-outline" onclick="window.app.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="saveProfileImage()">
                <i class="fas fa-save"></i> Save Photo
            </button>
        </div>
    `;
    
    window.app.showModal(modalContent);
}

function triggerCamera() {
    const cameraInput = document.getElementById('profile-image-input');
    if (cameraInput) {
        cameraInput.click();
    }
}

function triggerGallery() {
    const galleryInput = document.getElementById('profile-gallery-input');
    if (galleryInput) {
        galleryInput.click();
    }
}

function showPasswordChangeModal() {
    const modalContent = `
        <div class="modal-header">
            <h3>Change Password</h3>
            <button class="close-modal-btn" onclick="window.app.closeModal()">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="modal-body">
            <div class="form-group">
                <label>Current Password</label>
                <input type="password" id="current-password" class="form-control">
            </div>
            <div class="form-group">
                <label>New Password</label>
                <input type="password" id="new-password" class="form-control">
            </div>
            <div class="form-group">
                <label>Confirm New Password</label>
                <input type="password" id="confirm-password" class="form-control">
            </div>
            <div id="password-error" class="error-message" style="display: none;"></div>
        </div>
        <div class="modal-footer">
            <button class="btn btn-outline" onclick="window.app.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="savePasswordChange()">
                <i class="fas fa-save"></i> Change Password
            </button>
        </div>
    `;
    
    window.app.showModal(modalContent);
}

async function saveProfileChanges() {
    const name = document.getElementById('profile-name').value;
    const errorEl = document.getElementById('profile-error');
    
    if (!name) {
        errorEl.textContent = 'Name is required';
        errorEl.style.display = 'block';
        return;
    }
    
    try {
        await apiService.updateProfile({ name });
        appState.userProfile.name = name;
        document.getElementById('user-name').textContent = name;
        window.app.closeModal();
        showToast('Profile updated successfully');
    } catch (error) {
        errorEl.textContent = error.message || 'Failed to update profile';
        errorEl.style.display = 'block';
    }
}

async function savePasswordChange() {
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const errorEl = document.getElementById('password-error');
    
    if (!currentPassword || !newPassword || !confirmPassword) {
        errorEl.textContent = 'All fields are required';
        errorEl.style.display = 'block';
        return;
    }
    
    if (newPassword.length < 8) {
        errorEl.textContent = 'New password must be at least 8 characters';
        errorEl.style.display = 'block';
        return;
    }
    
    if (newPassword !== confirmPassword) {
        errorEl.textContent = 'Passwords do not match';
        errorEl.style.display = 'block';
        return;
    }
    
    try {
        await apiService.changePassword({ currentPassword, newPassword });
        window.app.closeModal();
        showToast('Password changed successfully');
    } catch (error) {
        errorEl.textContent = error.message || 'Failed to change password';
        errorEl.style.display = 'block';
    }
}

function previewProfileImage(event) {
    const file = event.target.files[0];
    if (file) {
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            const errorEl = document.getElementById('image-error');
            errorEl.textContent = 'Image size must be less than 5MB';
            errorEl.style.display = 'block';
            return;
        }
        
        // Compress image before preview
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                // Create canvas to resize image
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // Calculate new dimensions (max 400x400)
                let width = img.width;
                let height = img.height;
                const maxSize = 400;
                
                if (width > height) {
                    if (width > maxSize) {
                        height *= maxSize / width;
                        width = maxSize;
                    }
                } else {
                    if (height > maxSize) {
                        width *= maxSize / height;
                        height = maxSize;
                    }
                }
                
                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);
                
                // Convert to compressed JPEG
                const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
                
                const preview = document.getElementById('image-preview');
                if (preview) {
                    preview.src = compressedDataUrl;
                }
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

async function saveProfileImage() {
    const cameraInput = document.getElementById('profile-image-input');
    const galleryInput = document.getElementById('profile-gallery-input');
    const errorEl = document.getElementById('image-error');
    
    let file = null;
    if (cameraInput?.files?.[0]) {
        file = cameraInput.files[0];
    } else if (galleryInput?.files?.[0]) {
        file = galleryInput.files[0];
    }
    
    if (!file) {
        errorEl.textContent = 'Please take a photo or choose an image';
        errorEl.style.display = 'block';
        return;
    }
    
    const reader = new FileReader();
    
    reader.onload = async function(e) {
        try {
            // Compress image before saving
            const img = new Image();
            img.onload = async function() {
                // Create canvas to resize image
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // Calculate new dimensions (max 400x400)
                let width = img.width;
                let height = img.height;
                const maxSize = 400;
                
                if (width > height) {
                    if (width > maxSize) {
                        height *= maxSize / width;
                        width = maxSize;
                    }
                } else {
                    if (height > maxSize) {
                        width *= maxSize / height;
                        height = maxSize;
                    }
                }
                
                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);
                
                // Convert to compressed JPEG (70% quality)
                const compressedImageData = canvas.toDataURL('image/jpeg', 0.7);
                
                // Update avatar in UI immediately
                const avatarElements = document.querySelectorAll('#user-avatar, .user-avatar img');
                avatarElements.forEach(el => {
                    el.src = compressedImageData;
                });
                
                // Save to server via API
                const token = localStorage.getItem('authToken');
                const response = await fetch('http://localhost:3000/api/users/avatar', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ avatarData: compressedImageData })
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to save avatar to server');
                }
                
                console.log('✓ Avatar saved to server');
                
                // Also save to localStorage as backup
                localStorage.setItem('userAvatar', compressedImageData);
                
                window.app.closeModal();
                showToast('Profile photo updated successfully');
            };
            img.onerror = function() {
                errorEl.textContent = 'Failed to process image';
                errorEl.style.display = 'block';
            };
            img.src = e.target.result;
        } catch (error) {
            console.error('Avatar save error:', error);
            errorEl.textContent = error.message || 'Failed to update profile photo';
            errorEl.style.display = 'block';
        }
    };
    
    reader.readAsDataURL(file);
}

// Load saved avatar on page load
function loadSavedAvatar() {
    const savedAvatar = localStorage.getItem('userAvatar');
    if (savedAvatar) {
        const avatarElements = document.querySelectorAll('#user-avatar, .user-avatar img');
        avatarElements.forEach(el => {
            el.src = savedAvatar;
        });
    }
}

// Call on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadSavedAvatar);
} else {
    loadSavedAvatar();
}

// Export functions
window.createSettingsForm = createSettingsForm;
window.setupSettingChangeHandlers = setupSettingChangeHandlers;
window.handleLogout = handleLogout;
window.showProfileEditModal = showProfileEditModal;
window.showPasswordChangeModal = showPasswordChangeModal;
window.saveProfileChanges = saveProfileChanges;
window.savePasswordChange = savePasswordChange;
window.showProfileImageModal = showProfileImageModal;
window.triggerCamera = triggerCamera;
window.triggerGallery = triggerGallery;
window.previewProfileImage = previewProfileImage;
window.saveProfileImage = saveProfileImage;
