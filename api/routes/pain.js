const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const db = require('../config/database');
const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
    const { startDate, endDate, limit = 50 } = req.query;

    try {
        let query = `SELECT id, entry_date, pain_level, pain_locations, pain_type, 
                            triggers, remedies_used, effectiveness_rating, notes, created_at
                     FROM pain_entries
                     WHERE user_id = $1`;
        const params = [req.user.userId];

        if (startDate && endDate) {
            query += ` AND entry_date BETWEEN $2 AND $3`;
            params.push(startDate, endDate);
        }

        query += ` ORDER BY entry_date DESC LIMIT $${params.length + 1}`;
        params.push(limit);

        const result = await db.query(query, params);

        res.json({ painEntries: result.rows });
    } catch (error) {
        console.error('Get pain entries error:', error);
        res.status(500).json({ error: 'Failed to fetch pain entries' });
    }
});

router.post('/', authenticateToken, async (req, res) => {
    const {
        entryDate,
        painLevel,
        painLocations,
        painType,
        triggers,
        remediesUsed,
        effectivenessRating,
        notes
    } = req.body;

    try {
        const result = await db.query(
            `INSERT INTO pain_entries (user_id, entry_date, pain_level, pain_locations, 
                                       pain_type, triggers, remedies_used, effectiveness_rating, notes)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
             RETURNING id, entry_date, pain_level, pain_locations, pain_type, 
                       triggers, remedies_used, effectiveness_rating, notes, created_at`,
            [
                req.user.userId,
                entryDate || new Date(),
                painLevel,
                JSON.stringify(painLocations),
                painType,
                JSON.stringify(triggers),
                JSON.stringify(remediesUsed),
                effectivenessRating,
                notes
            ]
        );

        res.status(201).json({ painEntry: result.rows[0] });
    } catch (error) {
        console.error('Create pain entry error:', error);
        res.status(500).json({ error: 'Failed to create pain entry' });
    }
});

router.get('/analytics', authenticateToken, async (req, res) => {
    try {
        const avgPainResult = await db.query(
            `SELECT AVG(pain_level) as avg_pain_level,
                    COUNT(*) as total_entries
             FROM pain_entries
             WHERE user_id = $1 AND entry_date >= CURRENT_DATE - INTERVAL '30 days'`,
            [req.user.userId]
        );

        const commonTriggersResult = await db.query(
            `SELECT triggers
             FROM pain_entries
             WHERE user_id = $1 AND triggers IS NOT NULL
             ORDER BY entry_date DESC
             LIMIT 50`,
            [req.user.userId]
        );

        const triggerCounts = {};
        commonTriggersResult.rows.forEach(row => {
            if (row.triggers) {
                row.triggers.forEach(trigger => {
                    triggerCounts[trigger] = (triggerCounts[trigger] || 0) + 1;
                });
            }
        });

        const topTriggers = Object.entries(triggerCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([trigger, count]) => ({ trigger, count }));

        res.json({
            analytics: {
                averagePainLevel: parseFloat(avgPainResult.rows[0].avg_pain_level || 0).toFixed(1),
                totalEntries: parseInt(avgPainResult.rows[0].total_entries),
                topTriggers
            }
        });
    } catch (error) {
        console.error('Get pain analytics error:', error);
        res.status(500).json({ error: 'Failed to fetch pain analytics' });
    }
});

module.exports = router;
