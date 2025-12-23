/**
 * Binti International Health App
 * Health Insights Functionality
 */

// Create health metrics overview
function createHealthMetrics(container) {
    const metricsEl = document.createElement('div');
    metricsEl.className = 'health-metrics-container';
    
    metricsEl.innerHTML = `
        <div class="card sensor-card">
            <div class="card-header">
                <div class="card-title">Smart Pad Insights</div>
                <div class="card-actions">
                    <button class="btn-icon btn-text" onclick="refreshSmartPadData()">
                        <i class="fas fa-sync-alt"></i>
                    </button>
                </div>
            </div>
            <div class="card-content">
                <div class="sensor-data">
                    <div class="sensor-circle">
                        <div class="sensor-value">${appState.isDeviceConnected ? appState.deviceData.sensorReadings.ph : '--'}</div>
                        <div class="sensor-label">pH Level</div>
                        ${appState.isDeviceConnected ? '<div class="sensor-status">Normal</div>' : ''}
                    </div>
                </div>
                <div class="empty-state" style="padding: 20px;">
                    <i class="fas fa-chart-line" style="font-size: 36px; color: #ccc; margin-bottom: 12px;"></i>
                    <p style="margin: 0; color: #666;">Connect your Smart Pad to see detailed metrics</p>
                </div>
            </div>
        </div>
        
        <div class="health-data-cards">
            <div class="card">
                <div class="card-header">
                    <div class="card-title">Menstrual Health Score</div>
                </div>
                <div class="card-content">
                    <div class="empty-state">
                        <i class="fas fa-heartbeat" style="font-size: 48px; color: #ccc; margin-bottom: 16px;"></i>
                        <p>Track your cycle to calculate your health score</p>
                        <p style="font-size: 14px; color: #666;">Based on cycle regularity and symptom patterns</p>
                    </div>
                </div>
            </div>
            
            <div class="card">
                <div class="card-header">
                    <div class="card-title">Hormone Balance</div>
                </div>
                <div class="card-content">
                    <div class="empty-state">
                        <i class="fas fa-flask" style="font-size: 48px; color: #ccc; margin-bottom: 16px;"></i>
                        <p>Hormone tracking coming soon</p>
                        <p style="font-size: 14px; color: #666;">Connect your Smart Pad for advanced analytics</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    container.appendChild(metricsEl);
}

// Create health trends visualization
function createHealthTrends(container) {
    const trendsEl = document.createElement('div');
    trendsEl.className = 'health-trends-container';
    
    trendsEl.innerHTML = `
        <h3>Monthly Health Trends</h3>
        
        <div class="trend-tabs">
            <button class="trend-tab active" data-trend="pain">Pain</button>
            <button class="trend-tab" data-trend="mood">Mood</button>
            <button class="trend-tab" data-trend="energy">Energy</button>
            <button class="trend-tab" data-trend="sleep">Sleep</button>
        </div>
        
        <div class="chart-container">
            <div class="empty-state" style="padding: 40px;">
                <i class="fas fa-chart-bar" style="font-size: 48px; color: #ccc; margin-bottom: 16px;"></i>
                <p>No trend data yet</p>
                <p style="font-size: 14px; color: #666;">Track your symptoms to see trends over time</p>
            </div>
        </div>
        
        <div class="card insight-card">
            <div class="card-header">
                <div class="card-title">Monthly Trend Analysis</div>
            </div>
            <div class="card-content">
                <p>Track your symptoms over time to identify patterns and receive personalized recommendations.</p>
            </div>
        </div>
    `;
    
    container.appendChild(trendsEl);
    
    // Add event listeners for trend tabs
    setTimeout(() => {
        const trendTabs = container.querySelectorAll('.trend-tab');
        trendTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs
                trendTabs.forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked tab
                tab.classList.add('active');
                
                // In a real app, this would update the chart data
                // For the demo, we'll just show a message
                showToast(`Showing ${tab.dataset.trend} trends`);
            });
        });
    }, 0);
}

// Create smart pad insights
function createSmartPadInsights(container) {
    const insightsEl = document.createElement('div');
    insightsEl.className = 'smart-pad-insights-container';
    
    // Only show detailed insights if connected to device
    if (appState.isDeviceConnected) {
        insightsEl.innerHTML = `
            <h3>Smart Pad Analytics</h3>
            
            <div class="card">
                <div class="card-header">
                    <div class="card-title">Advanced Health Metrics</div>
                </div>
                <div class="card-content">
                    <div class="metrics-grid">
                        <div class="metric-box">
                            <div class="metric-icon"><i class="fas fa-vial"></i></div>
                            <div class="metric-value">${appState.deviceData.sensorReadings.ph}</div>
                            <div class="metric-label">pH Level</div>
                            <div class="metric-info">Normal range</div>
                        </div>
                        <div class="metric-box">
                            <div class="metric-icon"><i class="fas fa-temperature-high"></i></div>
                            <div class="metric-value">${appState.deviceData.sensorReadings.temperature}°C</div>
                            <div class="metric-label">Temperature</div>
                            <div class="metric-info">Slightly elevated</div>
                        </div>
                        <div class="metric-box">
                            <div class="metric-icon"><i class="fas fa-tint"></i></div>
                            <div class="metric-value">${appState.deviceData.sensorReadings.moisture}%</div>
                            <div class="metric-label">Moisture</div>
                            <div class="metric-info">Normal</div>
                        </div>
                        <div class="metric-box">
                            <div class="metric-icon"><i class="fas fa-clock"></i></div>
                            <div class="metric-value">--</div>
                            <div class="metric-label">Hours of Use</div>
                            <div class="metric-info">Tracking...</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="card alert-card">
                <div class="card-header">
                    <div class="card-title">Your Personalized Recommendations</div>
                </div>
                <div class="card-content">
                    <div class="empty-state">
                        <i class="fas fa-lightbulb" style="font-size: 36px; color: #ccc; margin-bottom: 12px;"></i>
                        <p>Personalized recommendations will appear here</p>
                        <p style="font-size: 14px; color: #666;">Based on your tracked data and patterns</p>
                    </div>
                </div>
            </div>
        `;
    } else {
        insightsEl.innerHTML = `
            <div class="card">
                <div class="card-header">
                    <div class="card-title">Connect Your Smart Pad</div>
                </div>
                <div class="card-content">
                    <div class="connect-prompt">
                        <div class="connect-icon"><i class="fas fa-bluetooth"></i></div>
                        <p>Connect your Binti Smart Pad to unlock advanced health metrics and personalized insights</p>
                        <button class="btn btn-primary" onclick="app.navigateToScreen('device-connection')">Connect Device</button>
                    </div>
                </div>
            </div>
            
            <div class="card">
                <div class="card-header">
                    <div class="card-title">Available with Smart Pad</div>
                </div>
                <div class="card-content">
                    <ul class="feature-list">
                        <li><i class="fas fa-check"></i> Real-time pH monitoring</li>
                        <li><i class="fas fa-check"></i> Flow volume and consistency tracking</li>
                        <li><i class="fas fa-check"></i> Advanced hormone analysis</li>
                        <li><i class="fas fa-check"></i> Early detection of irregularities</li>
                        <li><i class="fas fa-check"></i> Personalized health recommendations</li>
                    </ul>
                </div>
            </div>
        `;
    }
    
    container.appendChild(insightsEl);
}

// Refresh data from smart pad
function refreshSmartPadData() {
    if (!appState.isDeviceConnected) {
        showToast('No device connected. Please connect your Smart Pad first.', 'error');
        return;
    }
    
    // Show loading indicator
    showToast('Syncing data from Smart Pad...', 'info');
    
    // Fetch real data from API
    if (window.apiService && window.authManager.isAuthenticated()) {
        apiService.getDevices().then(response => {
            if (response.devices && response.devices.length > 0) {
                const device = response.devices[0];
                return apiService.getDeviceReadings(device.device_id, null, null, 1);
            }
        }).then(response => {
            if (response && response.readings && response.readings.length > 0) {
                const reading = response.readings[0];
                appState.deviceData = {
                    sensorReadings: {
                        ph: reading.ph_level,
                        moisture: reading.moisture_level,
                        temperature: reading.temperature
                    },
                    lastSynced: new Date(reading.reading_timestamp)
                };
                
                // Refresh UI if on health insights page
                if (appState.currentScreen === 'health-insights') {
                    const container = document.getElementById('health-insights');
                    if (container) {
                        container.innerHTML = '';
                        createHealthMetrics(container);
                        createHealthTrends(container);
                        createSmartPadInsights(container);
                    }
                }
                showToast('Smart Pad data updated successfully!');
            } else {
                showToast('No device data available');
            }
        }).catch(error => {
            console.error('Failed to refresh device data:', error);
            showToast('Failed to sync device data');
        });
    } else {
        showToast('Please login to sync device data');
    }
}

// Export functions for use in other modules
window.createHealthMetrics = createHealthMetrics;
window.createHealthTrends = createHealthTrends;
window.createSmartPadInsights = createSmartPadInsights;
window.refreshSmartPadData = refreshSmartPadData;
