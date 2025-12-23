/**
 * Binti International Health App
 * Smart Pad Device Connection Functionality
 * Enhanced with BLE support for nRF52832/DA14531 based hardware
 */

// Create device connection interface
function createDeviceInterface(container) {
    const deviceEl = document.createElement('div');
    deviceEl.className = 'device-connection-container';
    
    deviceEl.innerHTML = `
        <div class="connection-status">
            <div class="connection-icon">
                <i class="fas fa-bluetooth"></i>
            </div>
            <div class="connection-text">
                <h3>Not Connected</h3>
                <p>Tap to connect to your Binti Smart Pad</p>
            </div>
        </div>
        
        <div class="connect-button-container">
            <button id="connect-device-btn" class="btn btn-primary">
                <i class="fas fa-bluetooth-b"></i> Connect to Smart Pad
            </button>
        </div>
        
        <div class="device-animation">
            <div class="device-icon-pulse"></div>
            <div class="device-icon">
                <i class="fas fa-broadcast-tower"></i>
            </div>
        </div>
        
        <div class="device-stats">
            <div class="stat-item">
                <div class="stat-icon"><i class="fas fa-battery-empty"></i></div>
                <div class="stat-value">--</div>
                <div class="stat-label">Battery</div>
            </div>
            <div class="stat-item">
                <div class="stat-icon"><i class="fas fa-signal"></i></div>
                <div class="stat-value">--</div>
                <div class="stat-label">Signal</div>
            </div>
            <div class="stat-item">
                <div class="stat-icon"><i class="fas fa-tint"></i></div>
                <div class="stat-value">--</div>
                <div class="stat-label">pH Level</div>
            </div>
        </div>
        
        <div class="device-info-card card">
            <div class="card-header">
                <div class="card-title">Smart Pad Features</div>
            </div>
            <div class="card-content">
                <ul class="feature-list">
                    <li><i class="fas fa-tint"></i> Real-time pH monitoring</li>
                    <li><i class="fas fa-water"></i> Flow volume tracking</li>
                    <li><i class="fas fa-thermometer-half"></i> Temperature sensing</li>
                    <li><i class="fas fa-chart-line"></i> Health pattern recognition</li>
                    <li><i class="fas fa-mobile-alt"></i> Automatic alerts and notifications</li>
                </ul>
            </div>
        </div>
        
        <div class="device-instructions card">
            <div class="card-header">
                <div class="card-title">Connection Instructions</div>
            </div>
            <div class="card-content">
                <ol class="instruction-list">
                    <li>Ensure your Binti Smart Pad is within range (10-15 feet)</li>
                    <li>Press the small button on the Smart Pad device</li>
                    <li>Tap "Connect to Smart Pad" above</li>
                    <li>Allow Bluetooth permissions when prompted</li>
                    <li>Once connected, data will sync automatically</li>
                </ol>
            </div>
        </div>
    `;
    
    container.appendChild(deviceEl);
}

// Setup device connection handlers
function setupDeviceConnectionHandlers(container) {
    const connectBtn = container.querySelector('#connect-device-btn');
    if (!connectBtn) return;
    
    // Update UI with device status for BLE connection
    function handleConnected() {
        // Connection success
        appState.isDeviceConnected = true;
        
        // Update UI
        updateDeviceConnectionUI();
        
        // Reset button
        connectBtn.disabled = false;
        connectBtn.innerHTML = '<i class="fas fa-sync"></i> Refresh Connection';
        
        // Show success message
        showToast('Smart Pad connected successfully!');
        
        // Reset animation
        const deviceAnimation = container.querySelector('.device-animation');
        if (deviceAnimation) {
            deviceAnimation.classList.remove('connecting');
        }
    }
    
    // Handle device disconnection
    function handleDisconnected() {
        appState.isDeviceConnected = false;
        
        // Update UI
        updateDeviceConnectionUI();
        
        // Reset button
        connectBtn.disabled = false;
        connectBtn.innerHTML = '<i class="fas fa-bluetooth-b"></i> Connect to Smart Pad';
        
        // Show message
        showToast('Smart Pad disconnected', 'warning');
    }
    
    // Handle data received from device
    function handleDataReceived(data) {
        console.log('Data received from Smart Pad:', data);
        
        // Update app state with received data
        appState.deviceData = {
            batteryLevel: data.batteryLevel || data.batteryLevel,
            signalStrength: calculateSignalStrength(data.rawData),
            lastSynced: new Date(),
            sensorReadings: {
                ph: data.pH,
                moisture: data.moisture,
                temperature: data.temperature
            }
        };
        
        // Update UI
        updateDeviceConnectionUI();
    }
    
    // Helper function to calculate signal strength
    function calculateSignalStrength(rawData) {
        // In real app, this would use RSSI values
        const rssi = rawData.rssi || -70; // Default to moderate
        
        if (rssi >= -50) return 'Excellent';
        if (rssi >= -65) return 'Good';
        if (rssi >= -80) return 'Moderate';
        return 'Poor';
    }
    
    // Connect button click handler
    connectBtn.addEventListener('click', async () => {
        // Show connecting state
        connectBtn.disabled = true;
        connectBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connecting...';
        
        // Animate the connection attempt
        const deviceAnimation = container.querySelector('.device-animation');
        if (deviceAnimation) {
            deviceAnimation.classList.add('connecting');
        }
        
        try {
            // Check if Web Bluetooth is supported
            if (!bleManager.isSupported()) {
                throw new Error('Bluetooth is not supported in this browser');
            }
            
            // Try to connect to device
            await bleManager.connect(
                handleConnected,
                handleDisconnected,
                handleDataReceived
            );
            
        } catch (error) {
            console.error('Failed to connect:', error);
            
            // Connection failure
            connectBtn.disabled = false;
            connectBtn.innerHTML = '<i class="fas fa-bluetooth-b"></i> Retry Connection';
            
            // Reset animation
            if (deviceAnimation) {
                deviceAnimation.classList.remove('connecting');
            }
            
            // Show error message
            let errorMessage = 'Could not connect to Smart Pad. Please try again.';
            if (error.message.includes('Bluetooth is not supported')) {
                errorMessage = 'Bluetooth is not supported in this browser. Please use Chrome, Edge or Opera.';
            }
            showToast(errorMessage, 'error');
        }
    });
    
    // Add disconnect button
    const connectionStatus = container.querySelector('.connection-status');
    if (connectionStatus && appState.isDeviceConnected) {
        const disconnectBtn = document.createElement('button');
        disconnectBtn.className = 'btn btn-outline disconnect-btn';
        disconnectBtn.innerHTML = '<i class="fas fa-power-off"></i> Disconnect';
        disconnectBtn.addEventListener('click', async () => {
            await bleManager.disconnect();
            handleDisconnected();
        });
        connectionStatus.appendChild(disconnectBtn);
    }
    
    // Update UI based on current connection state
    if (appState.isDeviceConnected) {
        connectBtn.innerHTML = '<i class="fas fa-sync"></i> Refresh Connection';
    }
}

// Functions for collecting and processing device data
function processDeviceData(data) {
    // Process the data from the BLE device
    // This function is called with our app state data format
    // and translates it to the format expected by the health insights
    return {
        pH: parseFloat(data.sensorReadings.ph),
        moisture: data.sensorReadings.moisture,
        temperature: parseFloat(data.sensorReadings.temperature),
        timestamp: new Date(),
        batteryLevel: data.batteryLevel
    };
}

// Request a new reading from the device
async function requestDeviceReading() {
    if (!appState.isDeviceConnected || !bleManager.isConnected) {
        showToast('Device not connected', 'warning');
        return null;
    }
    
    try {
        // Send request to device for a new reading
        await bleManager.sendData({ cmd: 'read' });
        showToast('Reading requested from device');
        return true;
    } catch (error) {
        console.error('Failed to request reading:', error);
        showToast('Failed to request reading from device', 'error');
        return null;
    }
}

// Export functions for use in other modules
window.createDeviceInterface = createDeviceInterface;
window.setupDeviceConnectionHandlers = setupDeviceConnectionHandlers;
window.processDeviceData = processDeviceData;
window.requestDeviceReading = requestDeviceReading;
