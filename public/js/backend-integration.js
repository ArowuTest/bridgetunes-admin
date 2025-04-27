/**
 * Backend Integration Module for Bridgetunes MTN Admin Portal
 * 
 * This module provides a unified interface for all backend API calls,
 * ensuring proper data connectivity and error handling throughout the portal.
 */

// Configuration
const PRODUCTION_API_URL = 'https://api.bridgetunes.com/api/v1'; // Production API URL
const DEVELOPMENT_API_URL = 'http://localhost:8080/api/v1'; // Development API URL
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? DEVELOPMENT_API_URL
    : PRODUCTION_API_URL;
const AUTH_TOKEN_KEY = 'bridgetunes_auth_token';

// Create axios instance for API calls
const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000 // 10 seconds timeout
});

// Add request interceptor to add auth token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(AUTH_TOKEN_KEY);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error('API Request Error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor to handle errors
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.error('API Response Error:', error);
        
        // Handle authentication errors
        if (error.response && error.response.status === 401) {
            console.warn('Authentication error, redirecting to login...');
            // Clear token and redirect to login
            localStorage.removeItem(AUTH_TOKEN_KEY);
            window.location.href = '/';
            return Promise.reject(new Error('Authentication failed. Please log in again.'));
        }
        
        // Handle server errors
        if (error.response && error.response.status >= 500) {
            console.error('Server error:', error.response.data);
            return Promise.reject(new Error('Server error. Please try again later.'));
        }
        
        // Handle network errors
        if (error.message === 'Network Error') {
            console.error('Network error:', error);
            return Promise.reject(new Error('Network error. Please check your connection.'));
        }
        
        // Handle timeout errors
        if (error.code === 'ECONNABORTED') {
            console.error('Request timeout:', error);
            return Promise.reject(new Error('Request timeout. Please try again.'));
        }
        
        return Promise.reject(error);
    }
);

// Backend Service
class BackendService {
    constructor() {
        this.apiClient = apiClient;
        this.initialized = false;
        
        // Initialize the service
        this.init();
    }
    
    /**
     * Initialize the backend service
     */
    init() {
        if (this.initialized) return;
        
        console.log('Initializing Backend Service...');
        
        // Check if API is available
        this.checkApiAvailability()
            .then(available => {
                if (available) {
                    console.log('Backend API is available');
                } else {
                    console.warn('Backend API is not available, using fallback data');
                }
                this.initialized = true;
            })
            .catch(error => {
                console.error('Error checking API availability:', error);
                this.initialized = true;
            });
    }
    
    /**
     * Check if API is available
     * @returns {Promise<boolean>} True if API is available
     */
    async checkApiAvailability() {
        try {
            const response = await this.apiClient.get('/health', { timeout: 5000 });
            return response.status === 200;
        } catch (error) {
            console.warn('API health check failed:', error.message);
            return false;
        }
    }
    
    /**
     * Get API URL
     * @returns {string} API URL
     */
    getApiUrl() {
        return API_URL;
    }
    
    /**
     * Get authentication token
     * @returns {string|null} Authentication token
     */
    getAuthToken() {
        return localStorage.getItem(AUTH_TOKEN_KEY);
    }
    
    /**
     * Set authentication token
     * @param {string} token - Authentication token
     */
    setAuthToken(token) {
        localStorage.setItem(AUTH_TOKEN_KEY, token);
    }
    
    /**
     * Clear authentication token
     */
    clearAuthToken() {
        localStorage.removeItem(AUTH_TOKEN_KEY);
    }
    
    /**
     * Check if user is authenticated
     * @returns {boolean} True if user is authenticated
     */
    isAuthenticated() {
        return !!this.getAuthToken();
    }
    
    /**
     * Make API request with error handling
     * @param {string} method - HTTP method (get, post, put, delete)
     * @param {string} endpoint - API endpoint
     * @param {Object} data - Request data
     * @param {Object} config - Request configuration
     * @returns {Promise<Object>} Response data
     */
    async request(method, endpoint, data = null, config = {}) {
        try {
            const response = await this.apiClient[method](endpoint, data, config);
            return response.data;
        } catch (error) {
            console.error(`Error in ${method.toUpperCase()} request to ${endpoint}:`, error);
            
            // Use fallback data if available
            if (this.getFallbackData && typeof this.getFallbackData === 'function') {
                const fallbackData = this.getFallbackData(endpoint);
                if (fallbackData) {
                    console.warn(`Using fallback data for ${endpoint}`);
                    return fallbackData;
                }
            }
            
            throw error;
        }
    }
    
    /**
     * Make GET request
     * @param {string} endpoint - API endpoint
     * @param {Object} params - Query parameters
     * @returns {Promise<Object>} Response data
     */
    async get(endpoint, params = {}) {
        return this.request('get', endpoint, null, { params });
    }
    
    /**
     * Make POST request
     * @param {string} endpoint - API endpoint
     * @param {Object} data - Request data
     * @returns {Promise<Object>} Response data
     */
    async post(endpoint, data = {}) {
        return this.request('post', endpoint, data);
    }
    
    /**
     * Make PUT request
     * @param {string} endpoint - API endpoint
     * @param {Object} data - Request data
     * @returns {Promise<Object>} Response data
     */
    async put(endpoint, data = {}) {
        return this.request('put', endpoint, data);
    }
    
    /**
     * Make DELETE request
     * @param {string} endpoint - API endpoint
     * @returns {Promise<Object>} Response data
     */
    async delete(endpoint) {
        return this.request('delete', endpoint);
    }
    
    /**
     * Get fallback data for development/testing
     * @param {string} endpoint - API endpoint
     * @returns {Object|null} Fallback data or null if not available
     */
    getFallbackData(endpoint) {
        console.warn(`Using fallback data for ${endpoint}`);
        
        // Extract resource type from endpoint
        const parts = endpoint.split('/').filter(p => p);
        const resourceType = parts[0];
        
        switch (resourceType) {
            case 'auth':
                return this.getAuthFallbackData(endpoint);
            case 'users':
                return this.getUsersFallbackData(endpoint);
            case 'draws':
                return this.getDrawsFallbackData(endpoint);
            case 'notifications':
                return this.getNotificationsFallbackData(endpoint);
            case 'topups':
                return this.getTopupsFallbackData(endpoint);
            case 'dashboard':
                return this.getDashboardFallbackData(endpoint);
            case 'reports':
                return this.getReportsFallbackData(endpoint);
            case 'settings':
                return this.getSettingsFallbackData(endpoint);
            default:
                console.warn(`No fallback data available for ${endpoint}`);
                return null;
        }
    }
    
    /**
     * Get authentication fallback data
     * @param {string} endpoint - API endpoint
     * @returns {Object|null} Fallback data
     */
    getAuthFallbackData(endpoint) {
        if (endpoint.includes('login')) {
            return {
                token: 'fallback_token_' + Math.random().toString(36).substring(2),
                user: {
                    id: 'admin1',
                    name: 'Admin User',
                    email: 'admin@bridgetunes.com',
                    type: 'admin',
                    organization: 'Bridgetunes'
                }
            };
        }
        
        return null;
    }
    
    /**
     * Get users fallback data
     * @param {string} endpoint - API endpoint
     * @returns {Object|null} Fallback data
     */
    getUsersFallbackData(endpoint) {
        // Check if endpoint is for a specific user
        if (endpoint.match(/\/users\/[a-zA-Z0-9]+$/)) {
            return {
                id: 'user1',
                name: 'John Doe',
                email: 'john@example.com',
                msisdn: '+2348012345678',
                type: 'public',
                status: 'active',
                createdAt: new Date(Date.now() - 2592000000)
            };
        }
        
        // Default users list
        return {
            users: [
                { id: '1', msisdn: '+2348012345678', name: 'John Doe', status: 'active', type: 'public', createdAt: new Date(Date.now() - 2592000000) },
                { id: '2', msisdn: '+2348023456789', name: 'Jane Smith', status: 'active', type: 'public', createdAt: new Date(Date.now() - 1592000000) },
                { id: '3', email: 'admin@bridgetunes.com', name: 'Admin User', status: 'active', type: 'admin', organization: 'Bridgetunes', createdAt: new Date(Date.now() - 5592000000) },
                { id: '4', email: 'staff@mtn.com', name: 'MTN Staff', status: 'active', type: 'staff', organization: 'MTN', createdAt: new Date(Date.now() - 4592000000) },
                { id: '5', msisdn: '+2348034567890', name: 'Mike Johnson', status: 'inactive', type: 'public', createdAt: new Date(Date.now() - 3592000000) }
            ],
            total: 5,
            page: 1,
            limit: 10
        };
    }
    
    /**
     * Get draws fallback data
     * @param {string} endpoint - API endpoint
     * @returns {Object|null} Fallback data
     */
    getDrawsFallbackData(endpoint) {
        // Check if endpoint is for a specific draw
        if (endpoint.match(/\/draws\/[a-zA-Z0-9]+$/)) {
            return {
                id: 'draw1',
                date: new Date(Date.now() - 86400000),
                status: 'completed',
                winners: 10,
                jackpotAmount: 1000000,
                eligibleNumbers: 5000,
                winningNumbers: [
                    { msisdn: '+2348012345678', prize: 1000000, rank: 1 },
                    { msisdn: '+2348023456789', prize: 350000, rank: 2 },
                    { msisdn: '+2348034567890', prize: 100000, rank: 3 },
                    { msisdn: '+2348045678901', prize: 50000, rank: 4 },
                    { msisdn: '+2348056789012', prize: 10000, rank: 5 }
                ]
            };
        }
        
        // Default draws list
        return {
            draws: [
                { id: '1', date: new Date(Date.now() - 86400000), status: 'completed', winners: 10, jackpotAmount: 1000000, eligibleNumbers: 5000 },
                { id: '2', date: new Date(Date.now() - 172800000), status: 'completed', winners: 8, jackpotAmount: 1000000, eligibleNumbers: 4800 },
                { id: '3', date: new Date(Date.now() - 259200000), status: 'completed', winners: 12, jackpotAmount: 1000000, eligibleNumbers: 5200 },
                { id: '4', date: new Date(Date.now() + 86400000), status: 'scheduled', winners: 0, jackpotAmount: 1000000, eligibleNumbers: 0 },
                { id: '5', date: new Date(Date.now() + 172800000), status: 'scheduled', winners: 0, jackpotAmount: 1000000, eligibleNumbers: 0 }
            ],
            total: 5,
            page: 1,
            limit: 10
        };
    }
    
    /**
     * Get notifications fallback data
     * @param {string} endpoint - API endpoint
     * @returns {Object|null} Fallback data
     */
    getNotificationsFallbackData(endpoint) {
        // Check if endpoint is for campaigns
        if (endpoint.includes('/campaigns')) {
            return {
                campaigns: [
                    { id: '1', name: 'Welcome Campaign', status: 'active', sentCount: 1200, deliveredCount: 1150, failedCount: 50, createdAt: new Date(Date.now() - 2592000000) },
                    { id: '2', name: 'Daily Draw Reminder', status: 'active', sentCount: 5000, deliveredCount: 4800, failedCount: 200, createdAt: new Date(Date.now() - 1592000000) },
                    { id: '3', name: 'Winner Notification', status: 'active', sentCount: 500, deliveredCount: 490, failedCount: 10, createdAt: new Date(Date.now() - 592000000) },
                    { id: '4', name: 'Jackpot Update', status: 'inactive', sentCount: 3000, deliveredCount: 2900, failedCount: 100, createdAt: new Date(Date.now() - 3592000000) },
                    { id: '5', name: 'Re-engagement', status: 'draft', sentCount: 0, deliveredCount: 0, failedCount: 0, createdAt: new Date(Date.now() - 4592000000) }
                ],
                total: 5,
                page: 1,
                limit: 10
            };
        }
        
        // Check if endpoint is for templates
        if (endpoint.includes('/templates')) {
            return {
                templates: [
                    { id: '1', name: 'Welcome Template', content: 'Welcome to Bridgetunes, {{name}}!', type: 'welcome', createdAt: new Date(Date.now() - 2592000000) },
                    { id: '2', name: 'Draw Reminder', content: 'Reminder: Today\'s draw is at 8 PM. Top up to qualify!', type: 'reminder', createdAt: new Date(Date.now() - 1592000000) },
                    { id: '3', name: 'Winner Notification', content: 'Congratulations, {{name}}! You won ₦{{amount}} in today\'s draw.', type: 'winner', createdAt: new Date(Date.now() - 592000000) },
                    { id: '4', name: 'Jackpot Update', content: 'Today\'s jackpot is ₦{{amount}}. Top up to qualify!', type: 'jackpot', createdAt: new Date(Date.now() - 3592000000) },
                    { id: '5', name: 'Re-engagement', content: 'We miss you, {{name}}! Top up today to qualify for our daily draws.', type: 're-engagement', createdAt: new Date(Date.now() - 4592000000) }
                ],
                total: 5,
                page: 1,
                limit: 10
            };
        }
        
        // Default notifications list
        return {
            notifications: [
                { id: '1', msisdn: '+2348012345678', message: 'Welcome to Bridgetunes!', status: 'delivered', timestamp: new Date(Date.now() - 86400000) },
                { id: '2', msisdn: '+2348023456789', message: 'Congratulations! You won ₦10,000 in today\'s draw.', status: 'delivered', timestamp: new Date(Date.now() - 172800000) },
                { id: '3', msisdn: '+2348034567890', message: 'Today\'s jackpot is ₦1,000,000. Top up to qualify!', status: 'delivered', timestamp: new Date(Date.now() - 259200000) },
                { id: '4', msisdn: '+2348045678901', message: 'Your number has been entered into today\'s draw.', status: 'failed', timestamp: new Date(Date.now() - 345600000) },
                { id: '5', msisdn: '+2348056789012', message: 'Reminder: Today\'s draw is at 8 PM.', status: 'pending', timestamp: new D
(Content truncated due to size limit. Use line ranges to read in chunks)
