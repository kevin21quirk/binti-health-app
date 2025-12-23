const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const periodRoutes = require('./routes/periods');
const painRoutes = require('./routes/pain');
const deviceRoutes = require('./routes/devices');
const healthRoutes = require('./routes/health');
const fertilityRoutes = require('./routes/fertility');
const communityRoutes = require('./routes/community');
const notificationRoutes = require('./routes/notifications');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true
}));

// Increase payload size limit to 50MB for avatar uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Binti Health API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/periods', periodRoutes);
app.use('/api/pain', painRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/fertility', fertilityRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/notifications', notificationRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        error: {
            message: err.message || 'Internal server error',
            status: err.status || 500
        }
    });
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Binti Health API running on port ${PORT}`);
    });
}

module.exports = app;
