const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const db = require('../config/database');
const router = express.Router();

router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const result = await db.query(
            `SELECT u.id, u.email, u.name, u.membership_type, u.avatar_url, u.created_at,
                    up.date_of_birth, up.average_cycle_length, up.average_period_length,
                    up.last_period_start, up.next_period_estimate,
                    us.notifications_enabled, us.data_sharing_enabled, us.dark_mode,
                    us.language, us.units, us.alert_sensitivity
             FROM users u
             LEFT JOIN user_profiles up ON u.id = up.user_id
             LEFT JOIN user_settings us ON u.id = us.user_id
             WHERE u.id = $1`,
            [req.user.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user: result.rows[0] });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});

router.put('/avatar', authenticateToken, async (req, res) => {
    console.log('📸 Avatar upload endpoint hit');
    console.log('User ID:', req.user?.userId);
    console.log('Has avatar data:', !!req.body?.avatarData);
    
    const { avatarData } = req.body;

    if (!avatarData) {
        console.log('❌ No avatar data provided');
        return res.status(400).json({ error: 'Avatar data is required' });
    }

    try {
        console.log('💾 Saving avatar to database...');
        // Store the base64 image data directly in the database
        // In production, you'd upload to a file storage service and store the URL
        await db.query(
            'UPDATE users SET avatar_url = $1 WHERE id = $2',
            [avatarData, req.user.userId]
        );

        console.log('✅ Avatar saved successfully');
        res.json({ message: 'Avatar updated successfully', avatarUrl: avatarData });
    } catch (error) {
        console.error('❌ Update avatar error:', error);
        res.status(500).json({ error: 'Failed to update avatar' });
    }
});

router.put('/profile', authenticateToken, async (req, res) => {
    const {
        name,
        dateOfBirth,
        averageCycleLength,
        averagePeriodLength,
        lastPeriodStart
    } = req.body;

    try {
        if (name) {
            await db.query(
                'UPDATE users SET name = $1 WHERE id = $2',
                [name, req.user.userId]
            );
        }

        if (dateOfBirth || averageCycleLength || averagePeriodLength || lastPeriodStart) {
            const updates = [];
            const values = [];
            let paramCount = 1;

            if (dateOfBirth) {
                updates.push(`date_of_birth = $${paramCount++}`);
                values.push(dateOfBirth);
            }
            if (averageCycleLength) {
                updates.push(`average_cycle_length = $${paramCount++}`);
                values.push(averageCycleLength);
            }
            if (averagePeriodLength) {
                updates.push(`average_period_length = $${paramCount++}`);
                values.push(averagePeriodLength);
            }
            if (lastPeriodStart) {
                updates.push(`last_period_start = $${paramCount++}`);
                values.push(lastPeriodStart);
            }

            values.push(req.user.userId);

            if (updates.length > 0) {
                await db.query(
                    `UPDATE user_profiles SET ${updates.join(', ')} WHERE user_id = $${paramCount}`,
                    values
                );
            }
        }

        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

router.put('/settings', authenticateToken, async (req, res) => {
    const {
        notificationsEnabled,
        dataSharingEnabled,
        darkMode,
        language,
        units,
        alertSensitivity
    } = req.body;

    try {
        const updates = [];
        const values = [];
        let paramCount = 1;

        if (notificationsEnabled !== undefined) {
            updates.push(`notifications_enabled = $${paramCount++}`);
            values.push(notificationsEnabled);
        }
        if (dataSharingEnabled !== undefined) {
            updates.push(`data_sharing_enabled = $${paramCount++}`);
            values.push(dataSharingEnabled);
        }
        if (darkMode !== undefined) {
            updates.push(`dark_mode = $${paramCount++}`);
            values.push(darkMode);
        }
        if (language) {
            updates.push(`language = $${paramCount++}`);
            values.push(language);
        }
        if (units) {
            updates.push(`units = $${paramCount++}`);
            values.push(units);
        }
        if (alertSensitivity) {
            updates.push(`alert_sensitivity = $${paramCount++}`);
            values.push(alertSensitivity);
        }

        values.push(req.user.userId);

        if (updates.length > 0) {
            await db.query(
                `UPDATE user_settings SET ${updates.join(', ')} WHERE user_id = $${paramCount}`,
                values
            );
        }

        res.json({ message: 'Settings updated successfully' });
    } catch (error) {
        console.error('Update settings error:', error);
        res.status(500).json({ error: 'Failed to update settings' });
    }
});

module.exports = router;
