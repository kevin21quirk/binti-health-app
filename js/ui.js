/**
 * Binti International Health App
 * UI and Screen-specific functionality
 */

// Initialize screen content when loaded
function initializeScreenContent(screenId) {
    switch(screenId) {
        case 'dashboard':
            initDashboard();
            break;
        case 'period-tracking':
            initPeriodTracking();
            break;
        case 'pain-management':
            initPainManagement();
            break;
        case 'leak-prevention':
            initLeakPrevention();
            break;
        case 'health-insights':
            initHealthInsights();
            break;
        case 'community':
            initCommunity();
            break;
        case 'device-connection':
            initDeviceConnection();
            break;
        case 'settings':
            initSettings();
            break;
        case 'help-support':
            initHelpSupport();
            break;
    }
}

// Modal content generators
function showQuickActionsModal() {
    const content = `
        <div class="modal-header">
            <h2>Quick Actions</h2>
            <button class="close-modal" onclick="window.app.closeModal()"><i class="fas fa-times"></i></button>
        </div>
        <div class="modal-body">
            <div class="quick-action-grid">
                <div class="quick-action-item" onclick="navigateAndCloseModal('period-tracking')">
                    <i class="fas fa-calendar-alt"></i>
                    <span>Log Period</span>
                </div>
                <div class="quick-action-item" onclick="navigateAndCloseModal('pain-management')">
                    <i class="fas fa-heartbeat"></i>
                    <span>Log Symptoms</span>
                </div>
                <div class="quick-action-item" onclick="navigateAndCloseModal('device-connection')">
                    <i class="fas fa-bluetooth-b"></i>
                    <span>Connect Device</span>
                </div>
                <div class="quick-action-item" onclick="navigateAndCloseModal('health-insights')">
                    <i class="fas fa-chart-line"></i>
                    <span>View Insights</span>
                </div>
            </div>
        </div>
    `;
    
    window.app.showModal(content);
}

function showAddPeriodEntryModal() {
    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    const content = `
        <div class="modal-header">
            <h2>Log Period</h2>
            <button class="close-modal" onclick="app.closeModal()"><i class="fas fa-times"></i></button>
        </div>
        <div class="modal-body">
            <form id="period-entry-form">
                <div class="form-group">
                    <label class="form-label" for="period-date">Date</label>
                    <input type="date" id="period-date" class="form-input" value="${formattedDate}">
                </div>
                <div class="form-group">
                    <label class="form-label" for="flow-intensity">Flow Intensity</label>
                    <div class="segmented-control">
                        <input type="radio" name="flow-intensity" id="flow-light" value="light" checked>
                        <label for="flow-light">Light</label>
                        <input type="radio" name="flow-intensity" id="flow-medium" value="medium">
                        <label for="flow-medium">Medium</label>
                        <input type="radio" name="flow-intensity" id="flow-heavy" value="heavy">
                        <label for="flow-heavy">Heavy</label>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Symptoms</label>
                    <div class="chip-selection">
                        <div class="chip-item">
                            <input type="checkbox" id="symptom-cramps" value="cramps">
                            <label for="symptom-cramps">Cramps</label>
                        </div>
                        <div class="chip-item">
                            <input type="checkbox" id="symptom-headache" value="headache">
                            <label for="symptom-headache">Headache</label>
                        </div>
                        <div class="chip-item">
                            <input type="checkbox" id="symptom-fatigue" value="fatigue">
                            <label for="symptom-fatigue">Fatigue</label>
                        </div>
                        <div class="chip-item">
                            <input type="checkbox" id="symptom-bloating" value="bloating">
                            <label for="symptom-bloating">Bloating</label>
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label" for="notes">Notes</label>
                    <textarea id="notes" class="form-input" rows="3" placeholder="Add any additional notes..."></textarea>
                </div>
                <button type="submit" class="btn btn-primary" style="width: 100%;" onclick="savePeriodEntry(event)">Save Entry</button>
            </form>
        </div>
    `;
    
    window.app.showModal(content);
}

function showAddPainEntryModal() {
    const content = `
        <div class="modal-header">
            <h2>Log Pain & Symptoms</h2>
            <button class="close-modal" onclick="app.closeModal()"><i class="fas fa-times"></i></button>
        </div>
        <div class="modal-body">
            <form id="pain-entry-form">
                <div class="form-group">
                    <label class="form-label">Pain Level</label>
                    <div class="pain-scale">
                        <input type="range" min="0" max="10" value="3" id="pain-slider" class="pain-slider">
                        <div class="pain-scale-labels">
                            <span>None</span>
                            <span>Mild</span>
                            <span>Moderate</span>
                            <span>Severe</span>
                            <span>Extreme</span>
                        </div>
                        <div class="pain-value">3/10</div>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Pain Location</label>
                    <div class="body-diagram">
                        <img src="images/body-diagram.svg" alt="Body Diagram">
                        <div class="body-markers">
                            <div class="marker" data-area="abdomen" style="top: 45%; left: 50%;"></div>
                            <div class="marker" data-area="lower-back" style="top: 45%; left: 20%;"></div>
                            <div class="marker" data-area="head" style="top: 15%; left: 50%;"></div>
                            <div class="marker" data-area="breast" style="top: 30%; left: 50%;"></div>
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label" for="pain-notes">Description & Remedies Tried</label>
                    <textarea id="pain-notes" class="form-input" rows="3" placeholder="Describe your pain and what helped..."></textarea>
                </div>
                <button type="submit" class="btn btn-primary" style="width: 100%;" onclick="savePainEntry(event)">Save Entry</button>
            </form>
        </div>
    `;
    
    window.app.showModal(content);
    
    // Set up pain slider interaction after modal is shown
    setTimeout(() => {
        const painSlider = document.getElementById('pain-slider');
        const painValue = document.querySelector('.pain-value');
        
        if (painSlider) {
            painSlider.addEventListener('input', () => {
                painValue.textContent = `${painSlider.value}/10`;
            });
        }
    }, 100);
}

function showAddHealthDataModal() {
    const content = `
        <div class="modal-header">
            <h2>Add Health Data</h2>
            <button class="close-modal" onclick="app.closeModal()"><i class="fas fa-times"></i></button>
        </div>
        <div class="modal-body">
            <div class="form-group">
                <label class="form-label">Data Type</label>
                <div class="segmented-control">
                    <input type="radio" name="data-type" id="data-manual" value="manual" checked>
                    <label for="data-manual">Manual Entry</label>
                    <input type="radio" name="data-type" id="data-device" value="device">
                    <label for="data-device">Device Sync</label>
                </div>
            </div>
            <div id="manual-entry-form">
                <div class="form-group">
                    <label class="form-label" for="metric-type">Select Metric</label>
                    <select id="metric-type" class="form-input">
                        <option value="temperature">Basal Temperature</option>
                        <option value="weight">Weight</option>
                        <option value="mood">Mood</option>
                        <option value="sleep">Sleep Duration</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label" for="metric-value">Value</label>
                    <input type="text" id="metric-value" class="form-input" placeholder="Enter value">
                </div>
                <div class="form-group">
                    <label class="form-label" for="metric-notes">Notes</label>
                    <textarea id="metric-notes" class="form-input" rows="2" placeholder="Additional notes..."></textarea>
                </div>
                <button class="btn btn-primary" style="width: 100%;" onclick="saveHealthData()">Save Data</button>
            </div>
            <div id="device-sync-form" style="display: none;">
                <div class="device-sync-message">
                    <i class="fas fa-bluetooth-b"></i>
                    <p>Connect to your Binti Smart Pad device to automatically sync health data.</p>
                </div>
                <button class="btn btn-primary" onclick="app.navigateToScreen('device-connection'); app.closeModal();">Connect Device</button>
            </div>
        </div>
    `;
    
    window.app.showModal(content);
    
    // Set up form toggle interaction
    setTimeout(() => {
        const radioButtons = document.querySelectorAll('input[name="data-type"]');
        const manualForm = document.getElementById('manual-entry-form');
        const deviceForm = document.getElementById('device-sync-form');
        
        radioButtons.forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (e.target.value === 'manual') {
                    manualForm.style.display = 'block';
                    deviceForm.style.display = 'none';
                } else {
                    manualForm.style.display = 'none';
                    deviceForm.style.display = 'block';
                }
            });
        });
    }, 100);
}

function showNewPostModal() {
    const content = `
        <div class="modal-header">
            <h2>New Community Post</h2>
            <button class="close-modal" onclick="app.closeModal()"><i class="fas fa-times"></i></button>
        </div>
        <div class="modal-body">
            <form id="post-form">
                <div class="form-group">
                    <label class="form-label" for="post-category">Category</label>
                    <select id="post-category" class="form-input">
                        <option value="question">Question</option>
                        <option value="story">My Story</option>
                        <option value="tip">Helpful Tip</option>
                        <option value="support">Need Support</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label" for="post-title">Title</label>
                    <input type="text" id="post-title" class="form-input" placeholder="Enter a title for your post">
                </div>
                <div class="form-group">
                    <label class="form-label" for="post-content">Content</label>
                    <textarea id="post-content" class="form-input" rows="5" placeholder="Share your thoughts..."></textarea>
                </div>
                <div class="form-group">
                    <label class="form-label">Tags</label>
                    <div class="tag-input-container">
                        <input type="text" id="tag-input" placeholder="Add tag and press Enter">
                        <div class="tag-chips"></div>
                    </div>
                </div>
                <div class="form-group">
                    <div class="checkbox-control">
                        <input type="checkbox" id="post-anonymous">
                        <label for="post-anonymous">Post Anonymously</label>
                    </div>
                </div>
                <button type="submit" class="btn btn-primary" style="width: 100%;" onclick="createCommunityPost(event)">Post</button>
            </form>
        </div>
    `;
    
    window.app.showModal(content);
}

function navigateAndCloseModal(screenId) {
    window.app.closeModal();
    window.app.navigateToScreen(screenId);
}

// Export functions to window
window.showQuickActionsModal = showQuickActionsModal;
window.navigateAndCloseModal = navigateAndCloseModal;

// Helper for updating device connection UI
function updateDeviceConnectionUI() {
    const deviceScreen = document.getElementById('device-connection');
    if (!deviceScreen) return;
    
    const connectionStatusEl = deviceScreen.querySelector('.connection-status');
    if (connectionStatusEl) {
        if (appState.isDeviceConnected) {
            connectionStatusEl.innerHTML = `
                <div class="connection-status-card">
                    <div class="connection-header binti-gradient-bg">
                        <div class="connection-icon connected pulse-subtle">
                            <i class="fas fa-bluetooth-b"></i>
                        </div>
                        <div class="connection-text">
                            <h3>Connected to Binti Smart Pad <span class="device-emoji">🌸</span></h3>
                            <p><i class="fas fa-sync-alt"></i> Last synced: <span class="highlight-text">Just now</span></p>
                        </div>
                        <div class="connection-badge">Active</div>
                    </div>
                    <div class="connection-actions">
                        <button class="refresh-connection-btn binti-btn-outline" onclick="AnimationController.createButtonRipple(event)">
                            <i class="fas fa-redo-alt"></i> Refresh Connection
                        </button>
                    </div>
                </div>
            `;
            
            // Update device stats
            const deviceStats = deviceScreen.querySelector('.device-stats');
            if (deviceStats && appState.deviceData) {
                deviceStats.innerHTML = `
                    <div class="stats-container">
                        <div class="stat-item">
                            <div class="stat-icon binti-gradient-bg">
                                <i class="fas fa-battery-three-quarters"></i>
                            </div>
                            <div class="stat-content">
                                <div class="stat-value">${appState.deviceData.batteryLevel}%</div>
                                <div class="stat-label">Battery</div>
                                <div class="stat-badge ${appState.deviceData.batteryLevel > 50 ? 'good' : 'warning'}">
                                    ${appState.deviceData.batteryLevel > 50 ? 'Good' : 'Low'}
                                </div>
                            </div>
                            <div class="stat-emoji">🔋</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-icon binti-secondary-gradient">
                                <i class="fas fa-signal"></i>
                            </div>
                            <div class="stat-content">
                                <div class="stat-value">${appState.deviceData.signalStrength}</div>
                                <div class="stat-label">Signal</div>
                                <div class="stat-badge good">Excellent</div>
                            </div>
                            <div class="stat-emoji">📶</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-icon binti-gradient-bg">
                                <i class="fas fa-tint"></i>
                            </div>
                            <div class="stat-content">
                                <div class="stat-value">${appState.deviceData.sensorReadings.ph}</div>
                                <div class="stat-label">pH Level</div>
                                <div class="stat-badge good">Normal</div>
                            </div>
                            <div class="stat-emoji">🧪</div>
                        </div>
                    </div>
                `;
            }
        } else {
            connectionStatusEl.innerHTML = `
                <div class="connection-icon">
                    <i class="fas fa-bluetooth"></i>
                </div>
                <div class="connection-text">
                    <h3>Not Connected</h3>
                    <p>Tap to connect to your Binti Smart Pad</p>
                </div>
            `;
        }
    }
}

// Save data from modals
function savePeriodEntry(e) {
    e.preventDefault();
    // In a real app, this would save data to a database
    app.closeModal();
    showToast('Period entry saved successfully!');
    // Refresh the calendar display
    initPeriodTracking();
}

function savePainEntry(e) {
    e.preventDefault();
    // In a real app, this would save data to a database
    app.closeModal();
    showToast('Pain entry logged successfully!');
    // Refresh the pain management screen
    initPainManagement();
}

function saveHealthData() {
    // In a real app, this would save data to a database
    app.closeModal();
    showToast('Health data saved successfully!');
    // Refresh the health insights screen
    initHealthInsights();
}

function createCommunityPost(e) {
    e.preventDefault();
    // In a real app, this would save post to a database
    app.closeModal();
    showToast('Your post has been published!');
    // Add the new post to the UI without full reinitialization
    updateCommunityPosts();
}

// Toast notifications
function showToast(message, type = 'success') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        </div>
        <div class="toast-message">${message}</div>
    `;
    
    // Add to document
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => {
        toast.classList.add('toast-visible');
    }, 10);
    
    // Hide and remove after delay
    setTimeout(() => {
        toast.classList.remove('toast-visible');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// Helper functions for navigation
window.navigateAndCloseModal = navigateAndCloseModal;
window.savePeriodEntry = savePeriodEntry;
window.savePainEntry = savePainEntry;
window.saveHealthData = saveHealthData;
window.createCommunityPost = createCommunityPost;
