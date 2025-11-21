// Storage implementation with Vercel KV fallback
// Uses Vercel KV if available, otherwise falls back to in-memory storage

// In-memory storage (shared across function invocations in same instance)
const sessions = new Map();
let leaderboardData = [];

let storage;
let useKV = false;

// Try to use Vercel KV if configured
try {
    // Only try to use KV if environment variables are set
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
        const { kv } = require('@vercel/kv');
        
        // Vercel KV implementation
        storage = {
            async getSession(sessionId) {
                try {
                    return await kv.get(`session:${sessionId}`);
                } catch (error) {
                    console.error('KV getSession error:', error);
                    return sessions.get(sessionId) || null;
                }
            },
            async setSession(sessionId, data) {
                try {
                    sessions.set(sessionId, data); // Also keep in memory as backup
                    await kv.set(`session:${sessionId}`, data, { ex: 86400 });
                } catch (error) {
                    console.error('KV setSession error:', error);
                    sessions.set(sessionId, data);
                }
            },
            async getLeaderboard() {
                try {
                    const data = await kv.get('leaderboard');
                    return data || leaderboardData || [];
                } catch (error) {
                    console.error('KV getLeaderboard error:', error);
                    return leaderboardData;
                }
            },
            async setLeaderboard(data) {
                try {
                    leaderboardData = data; // Also keep in memory as backup
                    await kv.set('leaderboard', data);
                } catch (error) {
                    console.error('KV setLeaderboard error:', error);
                    leaderboardData = data;
                }
            }
        };
        
        useKV = true;
        console.log('✓ Using Vercel KV for storage');
    } else {
        throw new Error('KV not configured');
    }
} catch (error) {
    // Fallback to in-memory storage
    storage = {
        async getSession(sessionId) {
            return sessions.get(sessionId) || null;
        },
        async setSession(sessionId, data) {
            sessions.set(sessionId, data);
        },
        async getLeaderboard() {
            return leaderboardData;
        },
        async setLeaderboard(data) {
            leaderboardData = data;
        }
    };
    
    console.log('✓ Using in-memory storage (not persistent across deploys)');
}

module.exports = storage;
