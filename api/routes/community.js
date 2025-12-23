const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const db = require('../config/database');
const router = express.Router();

router.get('/posts', authenticateToken, async (req, res) => {
    const { category, limit = 20, offset = 0 } = req.query;

    try {
        let query = `SELECT p.id, p.title, p.content, p.category, p.is_anonymous,
                            p.likes_count, p.comments_count, p.created_at,
                            CASE WHEN p.is_anonymous THEN 'Anonymous' ELSE u.name END as author_name,
                            CASE WHEN p.is_anonymous THEN null ELSE u.avatar_url END as author_avatar
                     FROM community_posts p
                     JOIN users u ON p.user_id = u.id
                     WHERE p.is_published = true`;
        const params = [];

        if (category) {
            params.push(category);
            query += ` AND p.category = $${params.length}`;
        }

        params.push(limit, offset);
        query += ` ORDER BY p.created_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`;

        const result = await db.query(query, params);

        res.json({ posts: result.rows });
    } catch (error) {
        console.error('Get community posts error:', error);
        res.status(500).json({ error: 'Failed to fetch community posts' });
    }
});

router.post('/posts', authenticateToken, async (req, res) => {
    const { title, content, category, isAnonymous } = req.body;

    try {
        const result = await db.query(
            `INSERT INTO community_posts (user_id, title, content, category, is_anonymous)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id, title, content, category, is_anonymous, created_at`,
            [req.user.userId, title, content, category, isAnonymous || false]
        );

        res.status(201).json({ post: result.rows[0] });
    } catch (error) {
        console.error('Create community post error:', error);
        res.status(500).json({ error: 'Failed to create community post' });
    }
});

router.get('/posts/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        const postResult = await db.query(
            `SELECT p.id, p.title, p.content, p.category, p.is_anonymous,
                    p.likes_count, p.comments_count, p.created_at,
                    CASE WHEN p.is_anonymous THEN 'Anonymous' ELSE u.name END as author_name,
                    CASE WHEN p.is_anonymous THEN null ELSE u.avatar_url END as author_avatar
             FROM community_posts p
             JOIN users u ON p.user_id = u.id
             WHERE p.id = $1 AND p.is_published = true`,
            [id]
        );

        if (postResult.rows.length === 0) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const commentsResult = await db.query(
            `SELECT c.id, c.content, c.is_anonymous, c.likes_count, c.created_at,
                    CASE WHEN c.is_anonymous THEN 'Anonymous' ELSE u.name END as author_name,
                    CASE WHEN c.is_anonymous THEN null ELSE u.avatar_url END as author_avatar
             FROM community_comments c
             JOIN users u ON c.user_id = u.id
             WHERE c.post_id = $1
             ORDER BY c.created_at ASC`,
            [id]
        );

        res.json({
            post: postResult.rows[0],
            comments: commentsResult.rows
        });
    } catch (error) {
        console.error('Get post details error:', error);
        res.status(500).json({ error: 'Failed to fetch post details' });
    }
});

router.post('/posts/:id/comments', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { content, isAnonymous } = req.body;

    try {
        const result = await db.query(
            `INSERT INTO community_comments (post_id, user_id, content, is_anonymous)
             VALUES ($1, $2, $3, $4)
             RETURNING id, content, is_anonymous, created_at`,
            [id, req.user.userId, content, isAnonymous || false]
        );

        await db.query(
            'UPDATE community_posts SET comments_count = comments_count + 1 WHERE id = $1',
            [id]
        );

        res.status(201).json({ comment: result.rows[0] });
    } catch (error) {
        console.error('Create comment error:', error);
        res.status(500).json({ error: 'Failed to create comment' });
    }
});

router.post('/posts/:id/like', authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        const existing = await db.query(
            'SELECT id FROM community_likes WHERE post_id = $1 AND user_id = $2',
            [id, req.user.userId]
        );

        if (existing.rows.length > 0) {
            await db.query(
                'DELETE FROM community_likes WHERE post_id = $1 AND user_id = $2',
                [id, req.user.userId]
            );
            await db.query(
                'UPDATE community_posts SET likes_count = likes_count - 1 WHERE id = $1',
                [id]
            );
            return res.json({ message: 'Like removed', liked: false });
        }

        await db.query(
            'INSERT INTO community_likes (post_id, user_id) VALUES ($1, $2)',
            [id, req.user.userId]
        );
        await db.query(
            'UPDATE community_posts SET likes_count = likes_count + 1 WHERE id = $1',
            [id]
        );

        res.json({ message: 'Post liked', liked: true });
    } catch (error) {
        console.error('Like post error:', error);
        res.status(500).json({ error: 'Failed to like post' });
    }
});

router.post('/comments/:id/like', authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        const existing = await db.query(
            'SELECT id FROM community_likes WHERE comment_id = $1 AND user_id = $2',
            [id, req.user.userId]
        );

        if (existing.rows.length > 0) {
            await db.query(
                'DELETE FROM community_likes WHERE comment_id = $1 AND user_id = $2',
                [id, req.user.userId]
            );
            await db.query(
                'UPDATE community_comments SET likes_count = likes_count - 1 WHERE id = $1',
                [id]
            );
            return res.json({ message: 'Like removed', liked: false });
        }

        await db.query(
            'INSERT INTO community_likes (comment_id, user_id) VALUES ($1, $2)',
            [id, req.user.userId]
        );
        await db.query(
            'UPDATE community_comments SET likes_count = likes_count + 1 WHERE id = $1',
            [id]
        );

        res.json({ message: 'Comment liked', liked: true });
    } catch (error) {
        console.error('Like comment error:', error);
        res.status(500).json({ error: 'Failed to like comment' });
    }
});

module.exports = router;
