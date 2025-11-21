const { sessions, leaderboard } = require('./storage');
const { v4: uuidv4 } = require('uuid');

// Calculate grade based on score and time
function calculateGrade(score, timeRemaining) {
    const totalTime = 45 * 60;
    const timeUsed = totalTime - timeRemaining;
    
    const scorePercentage = (score / 4000) * 100;
    const timeScore = (timeRemaining / totalTime) * 100;
    const composite = (scorePercentage * 0.7) + (timeScore * 0.3);
    
    if (composite >= 90) return 'S+ ELITE HACKER';
    if (composite >= 80) return 'S MASTER HACKER';
    if (composite >= 70) return 'A+ EXPERT HACKER';
    if (composite >= 60) return 'A ADVANCED HACKER';
    if (composite >= 50) return 'B+ SKILLED HACKER';
    if (composite >= 40) return 'B COMPETENT HACKER';
    if (composite >= 30) return 'C+ NOVICE HACKER';
    if (composite >= 20) return 'C SCRIPT KIDDIE';
    return 'D WANNABE';
}

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { method } = req;
    const pathParts = req.url.split('/').filter(Boolean);

    try {
        // POST /api/session/create
        if (method === 'POST' && pathParts[1] === 'session' && pathParts[2] === 'create') {
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
            
            sessions.set(sessionId, sessionData);
            return res.json({ sessionId, sessionData });
        }

        // GET /api/session/:sessionId
        if (method === 'GET' && pathParts[1] === 'session' && pathParts[2]) {
            const sessionId = pathParts[2];
            const session = sessions.get(sessionId);
            
            if (!session) {
                return res.status(404).json({ error: 'Session not found' });
            }
            
            const elapsed = Math.floor((Date.now() - session.startTime) / 1000);
            session.timeRemaining = Math.max(0, (45 * 60) - elapsed);
            
            if (session.timeRemaining === 0 && session.active) {
                session.active = false;
                session.eliminated = true;
                sessions.set(sessionId, session);
            }
            
            return res.json(session);
        }

        // POST /api/session/:sessionId/answer
        if (method === 'POST' && pathParts[1] === 'session' && pathParts[3] === 'answer') {
            const sessionId = pathParts[2];
            const { questionIndex, isCorrect } = req.body;
            
            const session = sessions.get(sessionId);
            
            if (!session) {
                return res.status(404).json({ error: 'Session not found' });
            }
            
            if (!session.active) {
                return res.status(400).json({ error: 'Session is not active' });
            }
            
            const elapsed = Math.floor((Date.now() - session.startTime) / 1000);
            session.timeRemaining = Math.max(0, (45 * 60) - elapsed);
            
            if (session.timeRemaining === 0) {
                session.active = false;
                session.eliminated = true;
                sessions.set(sessionId, session);
                return res.json({ session, timeout: true });
            }
            
            if (isCorrect) {
                session.score += 50;
                session.currentQuestion = questionIndex + 1;
                
                if (session.currentQuestion >= 60) {
                    session.active = false;
                    session.completed = true;
                    
                    const grade = calculateGrade(session.score, session.timeRemaining);
                    const leaderboardEntry = {
                        username: session.username,
                        score: session.score,
                        timeUsed: (45 * 60) - session.timeRemaining,
                        timeRemaining: session.timeRemaining,
                        grade,
                        timestamp: Date.now()
                    };
                    
                    leaderboard.push(leaderboardEntry);
                    leaderboard.sort((a, b) => {
                        if (b.score !== a.score) return b.score - a.score;
                        return a.timeUsed - b.timeUsed;
                    });
                    
                    sessions.set(sessionId, session);
                    return res.json({ session, completed: true, grade });
                }
            } else {
                session.score -= 50;
                
                if (session.score <= 0) {
                    session.active = false;
                    session.eliminated = true;
                    session.score = 0;
                    sessions.set(sessionId, session);
                    return res.json({ session, eliminated: true });
                }
            }
            
            sessions.set(sessionId, session);
            return res.json({ session });
        }

        // GET /api/leaderboard
        if (method === 'GET' && pathParts[1] === 'leaderboard') {
            return res.json(leaderboard);
        }

        return res.status(404).json({ error: 'Not found' });
    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
