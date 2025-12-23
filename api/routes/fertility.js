const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const db = require('../config/database');
const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
    const { startDate, endDate, limit = 30 } = req.query;

    try {
        let query = `SELECT id, tracking_date, basal_temperature, cervical_mucus,
                            ovulation_test_result, fertility_window, notes, created_at
                     FROM fertility_data
                     WHERE user_id = $1`;
        const params = [req.user.userId];

        if (startDate && endDate) {
            query += ` AND tracking_date BETWEEN $2 AND $3`;
            params.push(startDate, endDate);
        }

        query += ` ORDER BY tracking_date DESC LIMIT $${params.length + 1}`;
        params.push(limit);

        const result = await db.query(query, params);

        res.json({ fertilityData: result.rows });
    } catch (error) {
        console.error('Get fertility data error:', error);
        res.status(500).json({ error: 'Failed to fetch fertility data' });
    }
});

router.post('/', authenticateToken, async (req, res) => {
    const {
        trackingDate,
        basalTemperature,
        cervicalMucus,
        ovulationTestResult,
        fertilityWindow,
        notes
    } = req.body;

    try {
        const result = await db.query(
            `INSERT INTO fertility_data (user_id, tracking_date, basal_temperature, cervical_mucus,
                                         ovulation_test_result, fertility_window, notes)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING id, tracking_date, basal_temperature, cervical_mucus,
                       ovulation_test_result, fertility_window, notes, created_at`,
            [req.user.userId, trackingDate, basalTemperature, cervicalMucus, ovulationTestResult, fertilityWindow, notes]
        );

        res.status(201).json({ fertilityEntry: result.rows[0] });
    } catch (error) {
        console.error('Create fertility data error:', error);
        res.status(500).json({ error: 'Failed to create fertility data' });
    }
});

router.get('/window', authenticateToken, async (req, res) => {
    try {
        const profileResult = await db.query(
            `SELECT average_cycle_length, last_period_start
             FROM user_profiles
             WHERE user_id = $1`,
            [req.user.userId]
        );

        if (profileResult.rows.length === 0 || !profileResult.rows[0].last_period_start) {
            return res.json({ fertilityWindow: null, message: 'Insufficient data for prediction' });
        }

        const { average_cycle_length, last_period_start } = profileResult.rows[0];
        const ovulationDay = average_cycle_length - 14;
        
        res.json({
            fertilityWindow: {
                ovulationDay,
                cycleLength: average_cycle_length,
                lastPeriodStart: last_period_start,
                estimatedOvulation: new Date(new Date(last_period_start).getTime() + ovulationDay * 24 * 60 * 60 * 1000)
            }
        });
    } catch (error) {
        console.error('Get fertility window error:', error);
        res.status(500).json({ error: 'Failed to calculate fertility window' });
    }
});

module.exports = router;
