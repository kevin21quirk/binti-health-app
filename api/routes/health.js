const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const db = require('../config/database');
const router = express.Router();

router.get('/insights', authenticateToken, async (req, res) => {
    const { limit = 20, unreadOnly = false } = req.query;

    try {
        let query = `SELECT id, insight_date, insight_type, title, description, 
                            data_points, priority, is_read, created_at
                     FROM health_insights
                     WHERE user_id = $1`;
        const params = [req.user.userId];

        if (unreadOnly === 'true') {
            query += ' AND is_read = false';
        }

        query += ` ORDER BY insight_date DESC, priority DESC LIMIT $2`;
        params.push(limit);

        const result = await db.query(query, params);

        res.json({ insights: result.rows });
    } catch (error) {
        console.error('Get health insights error:', error);
        res.status(500).json({ error: 'Failed to fetch health insights' });
    }
});

router.post('/insights', authenticateToken, async (req, res) => {
    const { insightType, title, description, dataPoints, priority } = req.body;

    try {
        const result = await db.query(
            `INSERT INTO health_insights (user_id, insight_date, insight_type, title, 
                                          description, data_points, priority)
             VALUES ($1, CURRENT_DATE, $2, $3, $4, $5, $6)
             RETURNING id, insight_date, insight_type, title, description, data_points, priority`,
            [req.user.userId, insightType, title, description, JSON.stringify(dataPoints), priority]
        );

        res.status(201).json({ insight: result.rows[0] });
    } catch (error) {
        console.error('Create health insight error:', error);
        res.status(500).json({ error: 'Failed to create health insight' });
    }
});

router.put('/insights/:id/read', authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        await db.query(
            'UPDATE health_insights SET is_read = true WHERE id = $1 AND user_id = $2',
            [id, req.user.userId]
        );

        res.json({ message: 'Insight marked as read' });
    } catch (error) {
        console.error('Mark insight read error:', error);
        res.status(500).json({ error: 'Failed to mark insight as read' });
    }
});

router.get('/dashboard', authenticateToken, async (req, res) => {
    try {
        const profileResult = await db.query(
            `SELECT up.last_period_start, up.next_period_estimate, up.average_cycle_length
             FROM user_profiles up
             WHERE up.user_id = $1`,
            [req.user.userId]
        );

        const recentPainResult = await db.query(
            `SELECT AVG(pain_level) as avg_pain_level
             FROM pain_entries
             WHERE user_id = $1 AND entry_date >= CURRENT_DATE - INTERVAL '7 days'`,
            [req.user.userId]
        );

        const deviceResult = await db.query(
            `SELECT connection_status, battery_level, last_sync
             FROM device_connections
             WHERE user_id = $1 AND connection_status = 'connected'
             ORDER BY last_sync DESC
             LIMIT 1`,
            [req.user.userId]
        );

        const recentReadingResult = await db.query(
            `SELECT sr.ph_level, sr.moisture_level, sr.temperature, sr.reading_timestamp
             FROM sensor_readings sr
             JOIN device_connections dc ON sr.device_id = dc.id
             WHERE dc.user_id = $1
             ORDER BY sr.reading_timestamp DESC
             LIMIT 1`,
            [req.user.userId]
        );

        res.json({
            dashboard: {
                cycleInfo: profileResult.rows[0] || null,
                recentPainLevel: parseFloat(recentPainResult.rows[0]?.avg_pain_level || 0).toFixed(1),
                deviceStatus: deviceResult.rows[0] || null,
                latestReading: recentReadingResult.rows[0] || null
            }
        });
    } catch (error) {
        console.error('Get dashboard error:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
});

module.exports = router;
