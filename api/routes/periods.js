const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const db = require('../config/database');
const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
    try {
        const result = await db.query(
            `SELECT id, start_date, end_date, flow_intensity, notes, created_at
             FROM period_entries
             WHERE user_id = $1
             ORDER BY start_date DESC
             LIMIT 12`,
            [req.user.userId]
        );

        res.json({ periods: result.rows });
    } catch (error) {
        console.error('Get periods error:', error);
        res.status(500).json({ error: 'Failed to fetch period entries' });
    }
});

router.post('/', authenticateToken, async (req, res) => {
    const { startDate, endDate, flowIntensity, notes } = req.body;

    try {
        const result = await db.query(
            `INSERT INTO period_entries (user_id, start_date, end_date, flow_intensity, notes)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id, start_date, end_date, flow_intensity, notes, created_at`,
            [req.user.userId, startDate, endDate, flowIntensity, notes]
        );

        await db.query(
            `UPDATE user_profiles
             SET last_period_start = $1,
                 next_period_estimate = $1::date + (average_cycle_length || ' days')::interval
             WHERE user_id = $2`,
            [startDate, req.user.userId]
        );

        res.status(201).json({ period: result.rows[0] });
    } catch (error) {
        console.error('Create period error:', error);
        res.status(500).json({ error: 'Failed to create period entry' });
    }
});

router.get('/daily-logs', authenticateToken, async (req, res) => {
    const { startDate, endDate } = req.query;

    try {
        const result = await db.query(
            `SELECT id, log_date, flow_level, symptoms, mood, notes
             FROM daily_period_logs
             WHERE user_id = $1 AND log_date BETWEEN $2 AND $3
             ORDER BY log_date DESC`,
            [req.user.userId, startDate, endDate]
        );

        res.json({ logs: result.rows });
    } catch (error) {
        console.error('Get daily logs error:', error);
        res.status(500).json({ error: 'Failed to fetch daily logs' });
    }
});

router.post('/daily-logs', authenticateToken, async (req, res) => {
    const { periodEntryId, logDate, flowLevel, symptoms, mood, notes } = req.body;

    try {
        const result = await db.query(
            `INSERT INTO daily_period_logs (period_entry_id, user_id, log_date, flow_level, symptoms, mood, notes)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING id, log_date, flow_level, symptoms, mood, notes`,
            [periodEntryId, req.user.userId, logDate, flowLevel, JSON.stringify(symptoms), mood, notes]
        );

        res.status(201).json({ log: result.rows[0] });
    } catch (error) {
        console.error('Create daily log error:', error);
        res.status(500).json({ error: 'Failed to create daily log' });
    }
});

router.put('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { endDate, flowIntensity, notes } = req.body;

    try {
        const result = await db.query(
            `UPDATE period_entries
             SET end_date = COALESCE($1, end_date),
                 flow_intensity = COALESCE($2, flow_intensity),
                 notes = COALESCE($3, notes)
             WHERE id = $4 AND user_id = $5
             RETURNING id, start_date, end_date, flow_intensity, notes`,
            [endDate, flowIntensity, notes, id, req.user.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Period entry not found' });
        }

        res.json({ period: result.rows[0] });
    } catch (error) {
        console.error('Update period error:', error);
        res.status(500).json({ error: 'Failed to update period entry' });
    }
});

module.exports = router;
