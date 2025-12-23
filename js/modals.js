/**
 * Modal functions for period tracking, pain logging, etc.
 */

function showPeriodEntryModal(preselectedDate = null) {
    console.log('📝 showPeriodEntryModal called with date:', preselectedDate);
    
    const today = new Date();
    const defaultDate = preselectedDate || today.toISOString().split('T')[0];
    
    console.log('Default date:', defaultDate);
    console.log('window.app:', window.app);
    console.log('window.app.showModal:', typeof window.app?.showModal);
    
    const modalContent = `
        <div class="modal-header">
            <h3>Track Your Period</h3>
            <button class="close-modal-btn" onclick="window.app.closeModal()">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="modal-body">
            <p style="margin-bottom: 20px; color: #666;">Enter your period start date and optional details below.</p>
            <div class="form-group">
                <label>Start Date</label>
                <input type="date" id="period-start-date" class="form-control" value="${defaultDate}">
            </div>
            <div class="form-group">
                <label>End Date (Optional)</label>
                <input type="date" id="period-end-date" class="form-control">
            </div>
            <div class="form-group">
                <label>Flow Intensity</label>
                <select id="period-flow" class="form-control">
                    <option value="">Select flow intensity</option>
                    <option value="light">Light</option>
                    <option value="medium">Medium</option>
                    <option value="heavy">Heavy</option>
                </select>
            </div>
            <div class="form-group">
                <label>Notes (Optional)</label>
                <textarea id="period-notes" class="form-control" rows="3" placeholder="Any symptoms or notes..."></textarea>
            </div>
            <div id="period-error" class="error-message" style="display: none;"></div>
        </div>
        <div class="modal-footer">
            <button class="btn btn-outline" onclick="window.app.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="savePeriodEntry()">
                <i class="fas fa-save"></i> Save Period
            </button>
        </div>
    `;
    
    console.log('Modal content prepared, length:', modalContent.length);
    console.log('Calling window.app.showModal...');
    
    if (window.app && typeof window.app.showModal === 'function') {
        window.app.showModal(modalContent);
        console.log('✓ window.app.showModal called');
    } else {
        console.error('❌ window.app.showModal not available!', {
            windowApp: window.app,
            showModalType: typeof window.app?.showModal
        });
    }
}

async function savePeriodEntry() {
    const startDate = document.getElementById('period-start-date').value;
    const endDate = document.getElementById('period-end-date').value;
    const flowIntensity = document.getElementById('period-flow').value;
    const notes = document.getElementById('period-notes').value;
    const errorEl = document.getElementById('period-error');
    
    if (!startDate) {
        errorEl.textContent = 'Please select a start date';
        errorEl.style.display = 'block';
        return;
    }
    
    if (!window.authManager || !window.authManager.isAuthenticated()) {
        errorEl.textContent = 'Please login to track your period';
        errorEl.style.display = 'block';
        return;
    }
    
    try {
        await window.apiService.createPeriod({
            startDate,
            endDate: endDate || null,
            flowIntensity: flowIntensity || null,
            notes: notes || null
        });
        
        window.app.closeModal();
        showToast('Period entry saved successfully!');
        
        // Reload the period tracking screen to show new data
        if (appState.currentScreen === 'period-tracking') {
            setTimeout(() => {
                loadScreen('period-tracking');
            }, 300);
        }
        
        // Reload dashboard to update predictions
        if (appState.currentScreen === 'dashboard') {
            setTimeout(() => {
                loadScreen('dashboard');
            }, 300);
        }
        
        // Update user profile with new period data
        if (window.initializeAppWithUser) {
            setTimeout(() => {
                window.initializeAppWithUser();
            }, 500);
        }
    } catch (error) {
        console.error('Failed to save period:', error);
        errorEl.textContent = error.message || 'Failed to save period entry';
        errorEl.style.display = 'block';
    }
}

function showPainEntryModal() {
    const modalContent = `
        <div class="modal-header">
            <h3>Log Pain</h3>
            <button class="close-modal-btn" onclick="window.app.closeModal()">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="modal-body">
            <div class="form-group">
                <label>Pain Level (0-10)</label>
                <input type="range" id="pain-level" class="form-control" min="0" max="10" value="5" 
                       oninput="document.getElementById('pain-level-value').textContent = this.value">
                <div style="text-align: center; font-size: 24px; font-weight: bold; color: #8A2BE2;">
                    <span id="pain-level-value">5</span>/10
                </div>
            </div>
            <div class="form-group">
                <label>Pain Locations</label>
                <div class="checkbox-group">
                    <label><input type="checkbox" value="abdomen"> Abdomen</label>
                    <label><input type="checkbox" value="lower back"> Lower Back</label>
                    <label><input type="checkbox" value="head"> Head</label>
                    <label><input type="checkbox" value="breasts"> Breasts</label>
                    <label><input type="checkbox" value="legs"> Legs</label>
                </div>
            </div>
            <div class="form-group">
                <label>Pain Type</label>
                <select id="pain-type" class="form-control">
                    <option value="">Select type</option>
                    <option value="cramping">Cramping</option>
                    <option value="sharp">Sharp</option>
                    <option value="dull">Dull ache</option>
                    <option value="throbbing">Throbbing</option>
                </select>
            </div>
            <div class="form-group">
                <label>Notes</label>
                <textarea id="pain-notes" class="form-control" rows="3" placeholder="Describe your pain..."></textarea>
            </div>
            <div id="pain-error" class="error-message" style="display: none;"></div>
        </div>
        <div class="modal-footer">
            <button class="btn btn-outline" onclick="window.app.closeModal()">Cancel</button>
            <button class="btn btn-primary" onclick="savePainEntry()">
                <i class="fas fa-save"></i> Save
            </button>
        </div>
    `;
    
    window.app.showModal(modalContent);
}

async function savePainEntry() {
    const painLevel = parseInt(document.getElementById('pain-level').value);
    const painType = document.getElementById('pain-type').value;
    const notes = document.getElementById('pain-notes').value;
    const errorEl = document.getElementById('pain-error');
    
    // Get checked locations
    const locationCheckboxes = document.querySelectorAll('.checkbox-group input[type="checkbox"]:checked');
    const painLocations = Array.from(locationCheckboxes).map(cb => cb.value);
    
    if (!window.authManager || !window.authManager.isAuthenticated()) {
        errorEl.textContent = 'Please login to log pain';
        errorEl.style.display = 'block';
        return;
    }
    
    try {
        await window.apiService.createPainEntry({
            entryDate: new Date().toISOString(),
            painLevel,
            painLocations,
            painType: painType || null,
            triggers: [],
            remediesUsed: [],
            effectivenessRating: null,
            notes: notes || null
        });
        
        window.app.closeModal();
        showToast('Pain entry saved successfully!');
        
        // Reload pain management screen if we're on it
        if (appState.currentScreen === 'pain-management') {
            loadScreen('pain-management');
        }
    } catch (error) {
        console.error('Failed to save pain entry:', error);
        errorEl.textContent = error.message || 'Failed to save pain entry';
        errorEl.style.display = 'block';
    }
}

function showHealthDataEntryModal() {
    showToast('Health data entry coming soon!');
}

function showQuickActionsModal() {
    const modalContent = `
        <div class="modal-header">
            <h3>Quick Actions</h3>
            <button class="close-modal-btn" onclick="window.app.closeModal()">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="modal-body">
            <div class="quick-actions-grid">
                <button class="action-card" onclick="window.app.closeModal(); showPeriodEntryModal();">
                    <i class="fas fa-calendar-alt"></i>
                    <span>Track Period</span>
                </button>
                <button class="action-card" onclick="window.app.closeModal(); showPainEntryModal();">
                    <i class="fas fa-heartbeat"></i>
                    <span>Log Pain</span>
                </button>
                <button class="action-card" onclick="window.app.closeModal(); app.navigateToScreen('device-connection');">
                    <i class="fas fa-bluetooth-b"></i>
                    <span>Connect Device</span>
                </button>
                <button class="action-card" onclick="window.app.closeModal(); app.navigateToScreen('community');">
                    <i class="fas fa-users"></i>
                    <span>Community</span>
                </button>
            </div>
        </div>
    `;
    
    window.app.showModal(modalContent);
}

// Export functions
window.showPeriodEntryModal = showPeriodEntryModal;
window.savePeriodEntry = savePeriodEntry;
window.showPainEntryModal = showPainEntryModal;
window.savePainEntry = savePainEntry;
window.showHealthDataEntryModal = showHealthDataEntryModal;
window.showQuickActionsModal = showQuickActionsModal;

console.log('✓ Modals.js loaded - Functions exported to window:', {
    showPeriodEntryModal: typeof window.showPeriodEntryModal,
    savePeriodEntry: typeof window.savePeriodEntry,
    showPainEntryModal: typeof window.showPainEntryModal,
    showHealthDataEntryModal: typeof window.showHealthDataEntryModal,
    showQuickActionsModal: typeof window.showQuickActionsModal
});
