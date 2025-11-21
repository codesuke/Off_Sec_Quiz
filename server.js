const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Directories
const SESSIONS_DIR = path.join(__dirname, 'sessions');
const LEADERBOARD_FILE = path.join(__dirname, 'leaderboard.json');

// Initialize directories and files
if (!fs.existsSync(SESSIONS_DIR)) {
    fs.mkdirSync(SESSIONS_DIR);
}

if (!fs.existsSync(LEADERBOARD_FILE)) {
    fs.writeFileSync(LEADERBOARD_FILE, JSON.stringify([]));
}

// Helper function to read session
function readSession(sessionId) {
    const sessionFile = path.join(SESSIONS_DIR, `${sessionId}.json`);
    if (fs.existsSync(sessionFile)) {
        return JSON.parse(fs.readFileSync(sessionFile, 'utf8'));
    }
    return null;
}

// Helper function to write session
function writeSession(sessionId, data) {
    const sessionFile = path.join(SESSIONS_DIR, `${sessionId}.json`);
    fs.writeFileSync(sessionFile, JSON.stringify(data, null, 2));
}

// Helper function to delete session
function deleteSession(sessionId) {
    const sessionFile = path.join(SESSIONS_DIR, `${sessionId}.json`);
    if (fs.existsSync(sessionFile)) {
        fs.unlinkSync(sessionFile);
    }
}

// Calculate grade based on score and time
function calculateGrade(score, timeRemaining) {
    const totalTime = 45 * 60; // 45 minutes in seconds
    const timeUsed = totalTime - timeRemaining;
    
    // Composite score: 70% based on points, 30% based on speed
    const scorePercentage = (score / 4000) * 100; // Max possible score is 1000 + (60 * 50) = 4000
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

// API: Create new session
app.post('/api/session/create', (req, res) => {
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
        timeRemaining: 45 * 60, // 45 minutes in seconds
        active: true,
        completed: false,
        eliminated: false
    };
    
    writeSession(sessionId, sessionData);
    res.json({ sessionId, sessionData });
});

// API: Get session
app.get('/api/session/:sessionId', (req, res) => {
    const { sessionId } = req.params;
    const session = readSession(sessionId);
    
    if (!session) {
        return res.status(404).json({ error: 'Session not found' });
    }
    
    // Update time remaining
    const elapsed = Math.floor((Date.now() - session.startTime) / 1000);
    session.timeRemaining = Math.max(0, (45 * 60) - elapsed);
    
    // Check if time expired
    if (session.timeRemaining === 0 && session.active) {
        session.active = false;
        session.eliminated = true;
        writeSession(sessionId, session);
    }
    
    res.json(session);
});

// API: Submit answer
app.post('/api/session/:sessionId/answer', (req, res) => {
    const { sessionId } = req.params;
    const { questionIndex, isCorrect } = req.body;
    
    const session = readSession(sessionId);
    
    if (!session) {
        return res.status(404).json({ error: 'Session not found' });
    }
    
    if (!session.active) {
        return res.status(400).json({ error: 'Session is not active' });
    }
    
    // Update time
    const elapsed = Math.floor((Date.now() - session.startTime) / 1000);
    session.timeRemaining = Math.max(0, (45 * 60) - elapsed);
    
    if (session.timeRemaining === 0) {
        session.active = false;
        session.eliminated = true;
        writeSession(sessionId, session);
        return res.json({ session, timeout: true });
    }
    
    // Update score
    if (isCorrect) {
        session.score += 50;
        session.currentQuestion = questionIndex + 1;
        
        // Check if quiz completed
        if (session.currentQuestion >= 60) {
            session.active = false;
            session.completed = true;
            
            // Add to leaderboard
            const grade = calculateGrade(session.score, session.timeRemaining);
            const leaderboardEntry = {
                username: session.username,
                score: session.score,
                timeUsed: (45 * 60) - session.timeRemaining,
                timeRemaining: session.timeRemaining,
                grade,
                timestamp: Date.now()
            };
            
            const leaderboard = JSON.parse(fs.readFileSync(LEADERBOARD_FILE, 'utf8'));
            leaderboard.push(leaderboardEntry);
            
            // Sort by score descending, then by time used ascending
            leaderboard.sort((a, b) => {
                if (b.score !== a.score) return b.score - a.score;
                return a.timeUsed - b.timeUsed;
            });
            
            fs.writeFileSync(LEADERBOARD_FILE, JSON.stringify(leaderboard, null, 2));
            
            writeSession(sessionId, session);
            return res.json({ session, completed: true, grade });
        }
    } else {
        session.score -= 50;
        
        // Check if eliminated
        if (session.score <= 0) {
            session.active = false;
            session.eliminated = true;
            session.score = 0;
            writeSession(sessionId, session);
            return res.json({ session, eliminated: true });
        }
    }
    
    writeSession(sessionId, session);
    res.json({ session });
});

// API: Get leaderboard
app.get('/api/leaderboard', (req, res) => {
    const leaderboard = JSON.parse(fs.readFileSync(LEADERBOARD_FILE, 'utf8'));
    res.json(leaderboard);
});

// Cleanup old sessions (older than 24 hours)
setInterval(() => {
    const files = fs.readdirSync(SESSIONS_DIR);
    const now = Date.now();
    
    files.forEach(file => {
        const filePath = path.join(SESSIONS_DIR, file);
        const stats = fs.statSync(filePath);
        const age = now - stats.mtimeMs;
        
        // Delete if older than 24 hours
        if (age > 24 * 60 * 60 * 1000) {
            fs.unlinkSync(filePath);
        }
    });
}, 60 * 60 * 1000); // Run every hour

app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════╗
║   CYBERQUIZ SERVER ONLINE                 ║
║   Port: ${PORT}                              ║
║   Status: ACTIVE                          ║
║   Access: http://localhost:${PORT}          ║
╚═══════════════════════════════════════════╝
    `);
});
