const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api' 
    : '/api';

class ApiService {
    constructor() {
        this.token = localStorage.getItem('authToken');
    }

    setToken(token) {
        this.token = token;
        localStorage.setItem('authToken', token);
    }

    clearToken() {
        this.token = null;
        localStorage.removeItem('authToken');
    }

    async request(endpoint, options = {}) {
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        const config = {
            ...options,
            headers
        };

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Request failed');
            }

            return data;
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    async register(email, password, name) {
        const data = await this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, password, name })
        });
        
        if (data.token) {
            this.setToken(data.token);
        }
        
        return data;
    }

    async login(email, password) {
        const data = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        
        if (data.token) {
            this.setToken(data.token);
        }
        
        return data;
    }

    async getUserProfile() {
        return this.request('/users/profile');
    }

    async updateProfile(profileData) {
        return this.request('/users/profile', {
            method: 'PUT',
            body: JSON.stringify(profileData)
        });
    }

    async updateSettings(settings) {
        return this.request('/users/settings', {
            method: 'PUT',
            body: JSON.stringify(settings)
        });
    }

    async getPeriods() {
        return this.request('/periods');
    }

    async createPeriod(periodData) {
        return this.request('/periods', {
            method: 'POST',
            body: JSON.stringify(periodData)
        });
    }

    async updatePeriod(id, periodData) {
        return this.request(`/periods/${id}`, {
            method: 'PUT',
            body: JSON.stringify(periodData)
        });
    }

    async getDailyLogs(startDate, endDate) {
        return this.request(`/periods/daily-logs?startDate=${startDate}&endDate=${endDate}`);
    }

    async createDailyLog(logData) {
        return this.request('/periods/daily-logs', {
            method: 'POST',
            body: JSON.stringify(logData)
        });
    }

    async getPainEntries(startDate, endDate, limit = 50) {
        let url = `/pain?limit=${limit}`;
        if (startDate && endDate) {
            url += `&startDate=${startDate}&endDate=${endDate}`;
        }
        return this.request(url);
    }

    async createPainEntry(painData) {
        return this.request('/pain', {
            method: 'POST',
            body: JSON.stringify(painData)
        });
    }

    async getPainAnalytics() {
        return this.request('/pain/analytics');
    }

    async getDevices() {
        return this.request('/devices');
    }

    async connectDevice(deviceId, deviceName) {
        return this.request('/devices/connect', {
            method: 'POST',
            body: JSON.stringify({ deviceId, deviceName })
        });
    }

    async disconnectDevice(deviceId) {
        return this.request(`/devices/disconnect/${deviceId}`, {
            method: 'POST'
        });
    }

    async getDeviceReadings(deviceId, startDate, endDate, limit = 100) {
        let url = `/devices/${deviceId}/readings?limit=${limit}`;
        if (startDate && endDate) {
            url += `&startDate=${startDate}&endDate=${endDate}`;
        }
        return this.request(url);
    }

    async createDeviceReading(deviceId, readingData) {
        return this.request(`/devices/${deviceId}/readings`, {
            method: 'POST',
            body: JSON.stringify(readingData)
        });
    }

    async getHealthInsights(limit = 20, unreadOnly = false) {
        return this.request(`/health/insights?limit=${limit}&unreadOnly=${unreadOnly}`);
    }

    async createHealthInsight(insightData) {
        return this.request('/health/insights', {
            method: 'POST',
            body: JSON.stringify(insightData)
        });
    }

    async markInsightRead(id) {
        return this.request(`/health/insights/${id}/read`, {
            method: 'PUT'
        });
    }

    async getDashboard() {
        return this.request('/health/dashboard');
    }

    async getFertilityData(startDate, endDate, limit = 30) {
        let url = `/fertility?limit=${limit}`;
        if (startDate && endDate) {
            url += `&startDate=${startDate}&endDate=${endDate}`;
        }
        return this.request(url);
    }

    async createFertilityEntry(fertilityData) {
        return this.request('/fertility', {
            method: 'POST',
            body: JSON.stringify(fertilityData)
        });
    }

    async getFertilityWindow() {
        return this.request('/fertility/window');
    }

    async getCommunityPosts(category, limit = 20, offset = 0) {
        let url = `/community/posts?limit=${limit}&offset=${offset}`;
        if (category) {
            url += `&category=${category}`;
        }
        return this.request(url);
    }

    async createCommunityPost(postData) {
        return this.request('/community/posts', {
            method: 'POST',
            body: JSON.stringify(postData)
        });
    }

    async getPost(id) {
        return this.request(`/community/posts/${id}`);
    }

    async createComment(postId, commentData) {
        return this.request(`/community/posts/${postId}/comments`, {
            method: 'POST',
            body: JSON.stringify(commentData)
        });
    }

    async likePost(postId) {
        return this.request(`/community/posts/${postId}/like`, {
            method: 'POST'
        });
    }

    async likeComment(commentId) {
        return this.request(`/community/comments/${commentId}/like`, {
            method: 'POST'
        });
    }

    async getNotifications(unreadOnly = false, limit = 50) {
        return this.request(`/notifications?unreadOnly=${unreadOnly}&limit=${limit}`);
    }

    async createNotification(notificationData) {
        return this.request('/notifications', {
            method: 'POST',
            body: JSON.stringify(notificationData)
        });
    }

    async markNotificationRead(id) {
        return this.request(`/notifications/${id}/read`, {
            method: 'PUT'
        });
    }

    async markAllNotificationsRead() {
        return this.request('/notifications/read-all', {
            method: 'PUT'
        });
    }

    async getUnreadCount() {
        return this.request('/notifications/unread-count');
    }
}

const apiService = new ApiService();
window.apiService = apiService;
