const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const db = require('../config/database');
const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
    try {
        const result = await db.query(
            `SELECT id, device_id, device_name, connection_status, battery_level,
                    firmware_version, last_sync, created_at
             FROM device_connections
             WHERE user_id = $1
             ORDER BY last_sync DESC`,
            [req.user.userId]
        );

        res.json({ devices: result.rows });
    } catch (error) {
        console.error('Get devices error:', error);
        res.status(500).json({ error: 'Failed to fetch devices' });
    }
});

router.post('/connect', authenticateToken, async (req, res) => {
    const { deviceId, deviceName } = req.body;

    try {
        const existing = await db.query(
            'SELECT id FROM device_connections WHERE device_id = $1',
            [deviceId]
        );

        if (existing.rows.length > 0) {
            const result = await db.query(
                `UPDATE device_connections
                 SET user_id = $1, connection_status = 'connected', last_sync = CURRENT_TIMESTAMP
                 WHERE device_id = $2
                 RETURNING id, device_id, device_name, connection_status, last_sync`,
                [req.user.userId, deviceId]
            );
            return res.json({ device: result.rows[0], message: 'Device reconnected' });
        }

        const result = await db.query(
            `INSERT INTO device_connections (user_id, device_id, device_name, connection_status, last_sync)
             VALUES ($1, $2, $3, 'connected', CURRENT_TIMESTAMP)
             RETURNING id, device_id, device_name, connection_status, last_sync`,
            [req.user.userId, deviceId, deviceName]
        );

        res.status(201).json({ device: result.rows[0], message: 'Device connected successfully' });
    } catch (error) {
        console.error('Connect device error:', error);
        res.status(500).json({ error: 'Failed to connect device' });
    }
});

router.post('/disconnect/:deviceId', authenticateToken, async (req, res) => {
    const { deviceId } = req.params;

    try {
        await db.query(
            `UPDATE device_connections
             SET connection_status = 'disconnected'
             WHERE device_id = $1 AND user_id = $2`,
            [deviceId, req.user.userId]
        );

        res.json({ message: 'Device disconnected successfully' });
    } catch (error) {
        console.error('Disconnect device error:', error);
        res.status(500).json({ error: 'Failed to disconnect device' });
    }
});

router.get('/:deviceId/readings', authenticateToken, async (req, res) => {
    const { deviceId } = req.params;
    const { startDate, endDate, limit = 100 } = req.query;

    try {
        const deviceResult = await db.query(
            'SELECT id FROM device_connections WHERE device_id = $1 AND user_id = $2',
            [deviceId, req.user.userId]
        );

        if (deviceResult.rows.length === 0) {
            return res.status(404).json({ error: 'Device not found' });
        }

        let query = `SELECT id, reading_timestamp, ph_level, moisture_level, temperature,
                            flow_rate, volume_ml, created_at
                     FROM sensor_readings
                     WHERE device_id = $1`;
        const params = [deviceResult.rows[0].id];

        if (startDate && endDate) {
            query += ` AND reading_timestamp BETWEEN $2 AND $3`;
            params.push(startDate, endDate);
        }

        query += ` ORDER BY reading_timestamp DESC LIMIT $${params.length + 1}`;
        params.push(limit);

        const result = await db.query(query, params);

        res.json({ readings: result.rows });
    } catch (error) {
        console.error('Get sensor readings error:', error);
        res.status(500).json({ error: 'Failed to fetch sensor readings' });
    }
});

router.post('/:deviceId/readings', authenticateToken, async (req, res) => {
    const { deviceId } = req.params;
    const { phLevel, moistureLevel, temperature, flowRate, volumeMl } = req.body;

    try {
        const deviceResult = await db.query(
            'SELECT id FROM device_connections WHERE device_id = $1 AND user_id = $2',
            [deviceId, req.user.userId]
        );

        if (deviceResult.rows.length === 0) {
            return res.status(404).json({ error: 'Device not found' });
        }

        const result = await db.query(
            `INSERT INTO sensor_readings (device_id, user_id, reading_timestamp, ph_level,
                                          moisture_level, temperature, flow_rate, volume_ml)
             VALUES ($1, $2, CURRENT_TIMESTAMP, $3, $4, $5, $6, $7)
             RETURNING id, reading_timestamp, ph_level, moisture_level, temperature, flow_rate, volume_ml`,
            [deviceResult.rows[0].id, req.user.userId, phLevel, moistureLevel, temperature, flowRate, volumeMl]
        );

        await db.query(
            'UPDATE device_connections SET last_sync = CURRENT_TIMESTAMP WHERE id = $1',
            [deviceResult.rows[0].id]
        );

        res.status(201).json({ reading: result.rows[0] });
    } catch (error) {
        console.error('Create sensor reading error:', error);
        res.status(500).json({ error: 'Failed to create sensor reading' });
    }
});

module.exports = router;
