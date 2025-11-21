const storage = require('../../storage-enhanced.js');

function calculateGrade(score, timeRemaining) {
    const totalTime = 45 * 60;
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
        const { sessionId } = req.query;
        const { questionIndex, isCorrect } = req.body;
        
        const session = await storage.getSession(sessionId);
        
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
            await storage.setSession(sessionId, session);
            return res.json({ session, timeout: true });
        }
        
        if (isCorrect) {
            session.score += 50;
            session.currentQuestion = questionIndex + 1;
            
            if (session.currentQuestion >= 60) {
                session.active = false;
                session.completed = true;
                
                const grade = calculateGrade(session.score, session.timeRemaining);
                session.grade = grade; // Store grade in session for later retrieval
                
                const leaderboardEntry = {
                    username: session.username,
                    score: session.score,
                    timeUsed: (45 * 60) - session.timeRemaining,
                    timeRemaining: session.timeRemaining,
                    grade,
                    timestamp: Date.now()
                };
                
                const leaderboard = await storage.getLeaderboard();
                leaderboard.push(leaderboardEntry);
                leaderboard.sort((a, b) => {
                    if (b.score !== a.score) return b.score - a.score;
                    return a.timeUsed - b.timeUsed;
                });
                await storage.setLeaderboard(leaderboard);
                
                await storage.setSession(sessionId, session);
                return res.json({ session, completed: true, grade });
            }
        } else {
            session.score -= 50;
            
            if (session.score <= 0) {
                session.active = false;
                session.eliminated = true;
                session.score = 0;
                await storage.setSession(sessionId, session);
                return res.json({ session, eliminated: true });
            }
        }
        
        await storage.setSession(sessionId, session);
        return res.json({ session });
    } catch (error) {
        console.error('Error submitting answer:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
