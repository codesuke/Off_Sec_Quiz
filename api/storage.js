// In-memory storage for sessions (since Vercel is serverless)
// In production, you'd want to use Vercel KV, Redis, or a database
const sessions = new Map();
const leaderboard = [];

module.exports = { sessions, leaderboard };
