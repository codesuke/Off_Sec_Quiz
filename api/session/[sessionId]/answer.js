const storage = require('../../storage.js');
const { supabase } = storage; // Get supabase client from storage

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { sessionId } = req.params;
        const { questionIndex, answerIndex } = req.body;

        // Call the RPC function for atomic answer processing
        const result = await storage.submitAnswer(sessionId, questionIndex, answerIndex);

        if (result.error) {
             return res.status(400).json({ error: result.error });
        }

        // Map RPC result to frontend expectation
        const responseData = {
            isCorrect: result.correct,
            correctAnswerIndex: result.correctAnswer,
            session: {
                score: result.score,
                timeRemaining: result.timeRemaining,
                currentQuestion: result.currentQuestion,
                active: !result.gameOver,
                eliminated: result.gameOver && !result.grade,
                completed: !!result.grade,
                grade: result.grade
            }
        };
        
        return res.json(responseData);

    } catch (error) {
        console.error('Error processing answer:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
