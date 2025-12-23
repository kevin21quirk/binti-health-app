/**
 * Binti International Health App
 * BLE Manager - Handles Bluetooth Low Energy connectivity with Binti Smart Pad
 * Compatible with nRF52832 (Raytac MDBT42Q) or Dialog DA14531 based hardware
 */

// BLE Service and Characteristic UUIDs
// These would match what's programmed in your firmware
const BLE_CONFIG = {
    SERVICE_UUID: '6e400001-b5a3-f393-e0a9-e50e24dcca9e', // Nordic UART Service or custom service
    CHARACTERISTIC_TX: '6e400002-b5a3-f393-e0a9-e50e24dcca9e', // TX Characteristic (write)
    CHARACTERISTIC_RX: '6e400003-b5a3-f393-e0a9-e50e24dcca9e', // RX Characteristic (notify)
    DEVICE_NAME_PREFIX: 'BintiPad',
};

// BLE Manager Class
class BLEManager {
    constructor() {
        this.device = null;
        this.server = null;
        this.txCharacteristic = null;
        this.rxCharacteristic = null;
        this.isConnected = false;
        this.onConnectedCallback = null;
        this.onDisconnectedCallback = null;
        this.onDataReceivedCallback = null;
        this.connectionAttempts = 0;
        this.maxRetries = 3;

        // Bind methods to preserve 'this' context
        this.connect = this.connect.bind(this);
        this.disconnect = this.disconnect.bind(this);
        this.sendData = this.sendData.bind(this);
        this.handleDisconnection = this.handleDisconnection.bind(this);
    }

    /**
     * Check if Web Bluetooth is supported in the browser
     */
    isSupported() {
        return 'bluetooth' in navigator;
    }

    /**
     * Connect to the Binti Smart Pad
     * @param {Function} onConnectedCallback - Called when connection is successful
     * @param {Function} onDisconnectedCallback - Called when device disconnects
     * @param {Function} onDataReceivedCallback - Called when data is received
     */
    async connect(onConnectedCallback, onDisconnectedCallback, onDataReceivedCallback) {
        if (!this.isSupported()) {
            throw new Error('Bluetooth is not supported in this browser');
        }

        // Store callbacks
        this.onConnectedCallback = onConnectedCallback;
        this.onDisconnectedCallback = onDisconnectedCallback;
        this.onDataReceivedCallback = onDataReceivedCallback;
        
        try {
            console.log('Requesting BLE device...');
            
            // Request device with specific filters
            this.device = await navigator.bluetooth.requestDevice({
                filters: [
                    { namePrefix: BLE_CONFIG.DEVICE_NAME_PREFIX }
                ],
                optionalServices: [BLE_CONFIG.SERVICE_UUID]
            });
            
            // Add event listener for disconnection
            this.device.addEventListener('gattserverdisconnected', this.handleDisconnection);
            
            console.log('Connecting to GATT server...');
            this.server = await this.device.gatt.connect();
            
            console.log('Getting primary service...');
            const service = await this.server.getPrimaryService(BLE_CONFIG.SERVICE_UUID);
            
            console.log('Getting characteristics...');
            this.rxCharacteristic = await service.getCharacteristic(BLE_CONFIG.CHARACTERISTIC_RX);
            this.txCharacteristic = await service.getCharacteristic(BLE_CONFIG.CHARACTERISTIC_TX);
            
            // Start notifications for data received from device
            await this.rxCharacteristic.startNotifications();
            this.rxCharacteristic.addEventListener('characteristicvaluechanged', (event) => {
                const value = event.target.value;
                const data = this.parseDeviceData(value);
                
                if (this.onDataReceivedCallback) {
                    this.onDataReceivedCallback(data);
                }
            });
            
            console.log('BLE connection established successfully');
            this.isConnected = true;
            this.connectionAttempts = 0;
            
            if (this.onConnectedCallback) {
                this.onConnectedCallback();
            }
            
            return true;
            
        } catch (error) {
            console.error('BLE connection error:', error);
            this.connectionAttempts++;
            
            if (this.connectionAttempts < this.maxRetries) {
                console.log(`Retrying connection (${this.connectionAttempts}/${this.maxRetries})...`);
                return this.connect(onConnectedCallback, onDisconnectedCallback, onDataReceivedCallback);
            }
            
            throw error;
        }
    }

    /**
     * Handle device disconnection
     */
    handleDisconnection() {
        console.log('Device disconnected');
        this.isConnected = false;
        this.server = null;
        this.txCharacteristic = null;
        this.rxCharacteristic = null;
        
        if (this.onDisconnectedCallback) {
            this.onDisconnectedCallback();
        }
    }

    /**
     * Disconnect from the device
     */
    async disconnect() {
        if (this.device && this.isConnected) {
            await this.device.gatt.disconnect();
            this.isConnected = false;
            console.log('Disconnected from device');
        }
    }

    /**
     * Send data to the device
     * @param {object} data - Data to send
     */
    async sendData(data) {
        if (!this.isConnected || !this.txCharacteristic) {
            throw new Error('Not connected to device');
        }

        try {
            const encoder = new TextEncoder();
            const dataString = JSON.stringify(data);
            await this.txCharacteristic.writeValue(encoder.encode(dataString));
            console.log('Data sent successfully:', data);
            return true;
        } catch (error) {
            console.error('Error sending data:', error);
            throw error;
        }
    }

    /**
     * Parse raw data received from device
     * @param {DataView} dataView - Raw data from BLE characteristic
     * @returns {object} - Parsed data object
     */
    parseDeviceData(dataView) {
        // Convert DataView to string
        let decoder = new TextDecoder('utf-8');
        let string = decoder.decode(dataView);
        
        try {
            // Try to parse as JSON
            const jsonData = JSON.parse(string);
            return this.formatDeviceData(jsonData);
        } catch (e) {
            // If not JSON, parse as comma-separated values
            // Example: "7.2,98,36.8"
            const parts = string.split(',');
            if (parts.length >= 3) {
                return this.formatDeviceData({
                    ph: parseFloat(parts[0]),
                    moisture: parseInt(parts[1], 10),
                    temperature: parseFloat(parts[2])
                });
            }
            
            console.error('Failed to parse device data:', string);
            return null;
        }
    }

    /**
     * Format and validate device data
     * @param {object} rawData - Raw data object from device
     * @returns {object} - Formatted data
     */
    formatDeviceData(rawData) {
        return {
            pH: rawData.ph ? parseFloat(rawData.ph).toFixed(1) : '0.0',
            moisture: rawData.moisture || 0,
            temperature: rawData.temperature ? parseFloat(rawData.temperature).toFixed(1) : '0.0',
            batteryLevel: rawData.battery || rawData.batteryLevel || 0,
            timestamp: new Date(),
            rawData: rawData
        };
    }

    /**
     * Request pH calibration
     * For calibrating the pH sensor on the device
     */
    async requestCalibration(type = 'neutral') {
        if (!this.isConnected) {
            throw new Error('Not connected to device');
        }
        
        const calibrationCommands = {
            'acid': { cmd: 'cal_acid' },
            'neutral': { cmd: 'cal_mid' },
            'base': { cmd: 'cal_base' }
        };
        
        if (!calibrationCommands[type]) {
            throw new Error('Invalid calibration type');
        }
        
        return this.sendData(calibrationCommands[type]);
    }
}

// Create singleton instance
const bleManager = new BLEManager();

// Export for global use
window.bleManager = bleManager;
