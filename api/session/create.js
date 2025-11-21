const storage = require('../storage-enhanced.js');
const { v4: uuidv4 } = require('uuid');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { username } = req.body;
        
        if (!username || username.trim().length === 0) {
            return res.status(400).json({ error: 'Username required' });
        }
        
        const sessionId = uuidv4();
        const sessionData = {
            sessionId,
            username: username.trim(),
            score: 1000,
            currentQuestion: 0,
            startTime: Date.now(),
            timeRemaining: 45 * 60,
            active: true,
            completed: false,
            eliminated: false
        };
        
        await storage.setSession(sessionId, sessionData);
        return res.json({ sessionId, sessionData });
    } catch (error) {
        console.error('Error creating session:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
