/**
 * Binti International Health App
 * Leak Prevention Functionality
 */

// Create flow prediction visualization
function createFlowPrediction(container) {
    const predictionEl = document.createElement('div');
    predictionEl.className = 'flow-prediction-container';
    
    predictionEl.innerHTML = `
        <div class="card prediction-card">
            <div class="card-header">
                <div class="card-title">
                    <i class="fas fa-chart-line pulse-subtle"></i>
                    Flow Prediction
                </div>
            </div>
            <div class="card-content">
                <div class="prediction-graph">
                    <div class="graph-legend">
                        <div class="legend-item">
                            <span class="legend-color light-flow"></span>
                            <span>Light</span>
                        </div>
                        <div class="legend-item">
                            <span class="legend-color medium-flow"></span>
                            <span>Medium</span>
                        </div>
                        <div class="legend-item">
                            <span class="legend-color heavy-flow"></span>
                            <span>Heavy</span>
                        </div>
                    </div>
                    <div class="prediction-timeline">
                        <div class="timeline-header">
                            <div><i class="fas fa-tint-slash"></i> Low</div>
                            <div><i class="fas fa-tint"></i> Medium</div>
                            <div><i class="fas fa-tint binti-icon-shake"></i> Heavy</div>
                        </div>
                        <div class="timeline-days">
                            ${generateFlowTimelineDays()}
                        </div>
                    </div>
                </div>
                
                <div class="prediction-info">
                    <div class="info-item">
                        <div class="info-icon binti-gradient-bg">
                            <i class="fas fa-calendar-check"></i>
                        </div>
                        <div class="info-content">
                            <div class="info-label">Next period</div>
                            <div class="info-value" id="leak-next-period">Not tracked yet</div>
                        </div>
                        <div class="info-emoji">📅</div>
                    </div>
                    <div class="info-item">
                        <div class="info-icon binti-secondary-gradient">
                            <i class="fas fa-tint"></i>
                        </div>
                        <div class="info-content">
                            <div class="info-label">Heaviest flow</div>
                            <div class="info-value">Typically 2nd-3rd day</div>
                        </div>
                        <div class="info-emoji">💧</div>
                    </div>
                </div>
            </div>
        </div>
        
        
        <div class="real-time-alerts">
            <div class="section-header">
                <h3>📲 Smart Alerts</h3>
                <div class="toggle-switch">
                    <input type="checkbox" id="smartAlerts" checked>
                    <label for="smartAlerts" class="toggle-slider"></label>
                </div>
            </div>
            
            <div class="alert-types">
                <div class="alert-type card-3d" onclick="AnimationController.createButtonRipple(event)">
                    <div class="alert-icon leak-icon">💧</div>
                    <div class="alert-info">
                        <h4>Leak Risk Detection</h4>
                        <p>Get notified 30 minutes before a potential leak</p>
                    </div>
                    <div class="active-indicator">ON</div>
                </div>
                
                <div class="alert-type card-3d" onclick="AnimationController.createButtonRipple(event)">
                    <div class="alert-icon saturation-icon">🔔</div>
                    <div class="alert-info">
                        <h4>Saturation Warning</h4>
                        <p>Alerts when pad absorption reaches 75%</p>
                    </div>
                    <div class="active-indicator">ON</div>
                </div>
                
                <div class="alert-type card-3d" onclick="AnimationController.createButtonRipple(event)">
                    <div class="alert-icon time-icon">⏱️</div>
                    <div class="alert-info">
                        <h4>Change Reminder</h4>
                        <p>Get reminders based on your typical usage time</p>
                    </div>
                    <div class="active-indicator">ON</div>
                </div>
            </div>
        </div>
    `;
    
    container.appendChild(predictionEl);
}

// Generate the flow timeline visualization for the next period
function generateFlowTimelineDays() {
    return `
        <div class="empty-state" style="padding: 20px;">
            <i class="fas fa-chart-area" style="font-size: 36px; color: #ccc; margin-bottom: 12px;"></i>
            <p style="margin: 0; color: #666;">Track your period to see flow predictions</p>
        </div>
    `;
}

// Create protection recommendations
function createProtectionRecommendations(container) {
    const recommendationsEl = document.createElement('div');
    recommendationsEl.className = 'protection-recommendations-container';
    
    recommendationsEl.innerHTML = `
        <div class="card">
            <div class="card-header">
                <div class="card-title">
                    <i class="fas fa-shield-alt pulse-subtle"></i>
                    Recommended Protection
                </div>
            </div>
            <div class="card-content">
                <div class="empty-state" style="padding: 30px;">
                    <i class="fas fa-shield-alt" style="font-size: 48px; color: #ccc; margin-bottom: 16px;"></i>
                    <p>Protection recommendations will appear here</p>
                    <p style="font-size: 14px; color: #666;">Based on your tracked period data</p>
                </div>
                
            </div>
        </div>
    `;
    
    container.appendChild(recommendationsEl);
    
    // Add event listeners for day selectors
    setTimeout(() => {
        const daySelectors = recommendationsEl.querySelectorAll('.day-selector');
        const recommendations = {
            1: {
                day: "Day 1",
                items: [
                    { title: "Binti Smart Pad - Regular", description: "Change every 4-6 hours" },
                    { title: "Menstrual Cup - Light Flow", description: "Empty every 8-12 hours", alternative: true }
                ]
            },
            2: {
                day: "Day 2",
                items: [
                    { title: "Binti Smart Pad - Regular", description: "Change every 3-4 hours" },
                    { title: "Menstrual Cup - Regular Flow", description: "Empty every 6-8 hours", alternative: true }
                ]
            },
            3: {
                day: "Day 3",
                items: [
                    { title: "Binti Smart Pad - Heavy Flow", description: "Change every 2-3 hours" },
                    { title: "Menstrual Cup - Heavy Flow", description: "Empty every 4-6 hours", alternative: true }
                ]
            },
            4: {
                day: "Day 4",
                items: [
                    { title: "Binti Smart Pad - Heavy Flow", description: "Change every 2-3 hours" },
                    { title: "Menstrual Cup - Heavy Flow", description: "Empty every 4-6 hours", alternative: true }
                ]
            },
            5: {
                day: "Day 5",
                items: [
                    { title: "Binti Smart Pad - Regular", description: "Change every 4-6 hours" },
                    { title: "Menstrual Cup - Regular Flow", description: "Empty every 6-8 hours", alternative: true }
                ]
            },
            6: {
                day: "Day 6",
                items: [
                    { title: "Binti Smart Pad - Light", description: "Change every 6-8 hours" },
                    { title: "Menstrual Cup - Light Flow", description: "Empty every 8-12 hours", alternative: true }
                ]
            },
            7: {
                day: "Day 7",
                items: [
                    { title: "Binti Smart Pad - Pantyliner", description: "Change every 6-8 hours" },
                    { title: "Menstrual Cup - Light Flow", description: "Empty every 8-12 hours", alternative: true }
                ]
            },
        };
        
        daySelectors.forEach(selector => {
            selector.addEventListener('click', () => {
                // Remove active class from all selectors
                daySelectors.forEach(s => s.classList.remove('active'));
                
                // Add active class to clicked selector
                selector.classList.add('active');
                
                // Update recommendation content
                const day = selector.dataset.day;
                const recommendation = recommendations[day];
                const currentRec = recommendationsEl.querySelector('.current-recommendation');
                if (recommendation) {
                    currentRec.innerHTML = `
                        <h3>${recommendation.day}</h3>
                        <div class="recommendation-items">
                            ${recommendation.items.map(item => `
                                <div class="recommendation-item ${item.alternative ? 'alternative' : ''}">
                                    <div class="item-icon"><i class="fas fa-check-circle"></i></div>
                                    <div class="item-details">
                                        <div class="item-title">${item.title}</div>
                                        <div class="item-description">${item.description}</div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    `;
                }
            });
        });
    }, 0);
}

// Create leak history visualization
function createLeakHistory(container) {
    const historyEl = document.createElement('div');
    historyEl.className = 'leak-history-container';
    
    historyEl.innerHTML = `
        <div class="card">
            <div class="card-header">
                <div class="card-title">Leak History & Patterns</div>
            </div>
            <div class="card-content">
                <div class="empty-state">
                    <i class="fas fa-shield-alt" style="font-size: 48px; color: #ccc; margin-bottom: 16px;"></i>
                    <p>No leak history yet</p>
                    <p style="font-size: 14px; color: #666;">Connect your Smart Pad to track leak prevention</p>
                </div>
            </div>
        </div>
    `;
    
    container.appendChild(historyEl);
}

// Create smart pad connection reminder
function createSmartPadReminder(container) {
    // Only show if not connected
    if (!appState.isDeviceConnected) {
        const reminderEl = document.createElement('div');
        reminderEl.className = 'smart-pad-reminder-container';
        
        reminderEl.innerHTML = `
            <div class="card feature-card">
                <div class="feature-image">
                    <img src="images/smart-pad.svg" alt="Smart Pad">
                </div>
                <div class="card-content">
                    <h3>Enhanced Leak Protection with Smart Pad</h3>
                    <p>Get real-time alerts and 98% leak prevention accuracy with our smart menstrual pad.</p>
                    <div class="feature-benefits">
                        <div class="feature-benefit">
                            <i class="fas fa-bell"></i>
                            <span>Early Warning Alerts</span>
                        </div>
                        <div class="feature-benefit">
                            <i class="fas fa-tint-slash"></i>
                            <span>Smart Absorption</span>
                        </div>
                        <div class="feature-benefit">
                            <i class="fas fa-mobile-alt"></i>
                            <span>Real-time Monitoring</span>
                        </div>
                    </div>
                    <button class="btn btn-primary" onclick="app.navigateToScreen('device-connection')">
                        Connect Smart Pad
                    </button>
                </div>
            </div>
        `;
        
        container.appendChild(reminderEl);
    }
}

// Flag to track if leak prevention content has been initialized
let leakPreventionInitialized = false;

// Create or update leak prevention content only once
function ensureLeakPreventionInitialized(container) {
    // If already initialized, don't duplicate content
    if (leakPreventionInitialized) return;
    
    // Clear any existing content
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
    
    // Create all leak prevention components
    createFlowPrediction(container);
    createProtectionRecommendations(container);
    createLeakHistory(container);
    createSmartPadReminder(container);
    
    // Set flag to prevent reinitializing
    leakPreventionInitialized = true;
}

// Export functions for use in other modules
window.createFlowPrediction = createFlowPrediction;
window.createProtectionRecommendations = createProtectionRecommendations;
window.createLeakHistory = createLeakHistory;
window.createSmartPadReminder = createSmartPadReminder;
window.generateFlowTimelineDays = generateFlowTimelineDays;
window.ensureLeakPreventionInitialized = ensureLeakPreventionInitialized;
