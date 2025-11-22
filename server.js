require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// API handlers
const createSession = require('./api/session/create.js');
const getSession = require('./api/session/[sessionId].js');
const getQuestionHandler = require('./api/session/[sessionId]/question.js');
const answerHandler = require('./api/session/[sessionId]/answer.js');
const leaderboardHandler = require('./api/leaderboard.js');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.post('/api/session/create', createSession);
app.get('/api/session/:sessionId', getSession);
app.get('/api/session/:sessionId/question', getQuestionHandler);
app.post('/api/session/:sessionId/answer', answerHandler);
app.all('/api/leaderboard', leaderboardHandler);

// Fallback to index.html for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
