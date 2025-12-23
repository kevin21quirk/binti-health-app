const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const db = require('../config/database');
const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
    const { unreadOnly = false, limit = 50 } = req.query;

    try {
        let query = `SELECT id, notification_type, title, message, is_read, action_url, created_at
                     FROM notifications
                     WHERE user_id = $1`;
        const params = [req.user.userId];

        if (unreadOnly === 'true') {
            query += ' AND is_read = false';
        }

        query += ` ORDER BY created_at DESC LIMIT $2`;
        params.push(limit);

        const result = await db.query(query, params);

        res.json({ notifications: result.rows });
    } catch (error) {
        console.error('Get notifications error:', error);
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
});

router.post('/', authenticateToken, async (req, res) => {
    const { notificationType, title, message, actionUrl } = req.body;

    try {
        const result = await db.query(
            `INSERT INTO notifications (user_id, notification_type, title, message, action_url)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id, notification_type, title, message, action_url, created_at`,
            [req.user.userId, notificationType, title, message, actionUrl]
        );

        res.status(201).json({ notification: result.rows[0] });
    } catch (error) {
        console.error('Create notification error:', error);
        res.status(500).json({ error: 'Failed to create notification' });
    }
});

router.put('/:id/read', authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        await db.query(
            'UPDATE notifications SET is_read = true WHERE id = $1 AND user_id = $2',
            [id, req.user.userId]
        );

        res.json({ message: 'Notification marked as read' });
    } catch (error) {
        console.error('Mark notification read error:', error);
        res.status(500).json({ error: 'Failed to mark notification as read' });
    }
});

router.put('/read-all', authenticateToken, async (req, res) => {
    try {
        await db.query(
            'UPDATE notifications SET is_read = true WHERE user_id = $1 AND is_read = false',
            [req.user.userId]
        );

        res.json({ message: 'All notifications marked as read' });
    } catch (error) {
        console.error('Mark all notifications read error:', error);
        res.status(500).json({ error: 'Failed to mark all notifications as read' });
    }
});

router.get('/unread-count', authenticateToken, async (req, res) => {
    try {
        const result = await db.query(
            'SELECT COUNT(*) as count FROM notifications WHERE user_id = $1 AND is_read = false',
            [req.user.userId]
        );

        res.json({ unreadCount: parseInt(result.rows[0].count) });
    } catch (error) {
        console.error('Get unread count error:', error);
        res.status(500).json({ error: 'Failed to fetch unread count' });
    }
});

module.exports = router;
