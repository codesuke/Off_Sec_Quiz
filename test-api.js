// Quick test script for API endpoints
const API_URL = process.env.API_URL || 'http://localhost:3000/api';

async function testAPI() {
    console.log('🧪 Testing CyberQuiz API...\n');
    
    try {
        // Test 1: Create session
        console.log('1️⃣ Testing session creation...');
        const createResponse = await fetch(`${API_URL}/session/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'TestHacker' })
        });
        
        if (!createResponse.ok) {
            throw new Error(`Session creation failed: ${createResponse.status}`);
        }
        
        const { sessionId, sessionData } = await createResponse.json();
        console.log('✅ Session created:', sessionId);
        console.log('   Username:', sessionData.username);
        console.log('   Initial Score:', sessionData.score);
        
        // Test 2: Get session
        console.log('\n2️⃣ Testing session retrieval...');
        const getResponse = await fetch(`${API_URL}/session/${sessionId}`);
        
        if (!getResponse.ok) {
            throw new Error(`Session retrieval failed: ${getResponse.status}`);
        }
        
        const session = await getResponse.json();
        console.log('✅ Session retrieved');
        console.log('   Active:', session.active);
        console.log('   Time Remaining:', session.timeRemaining, 'seconds');
        
        // Test 3: Submit correct answer
        console.log('\n3️⃣ Testing correct answer submission...');
        const answerResponse = await fetch(`${API_URL}/session/${sessionId}/answer`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ questionIndex: 0, isCorrect: true })
        });
        
        if (!answerResponse.ok) {
            throw new Error(`Answer submission failed: ${answerResponse.status}`);
        }
        
        const answerResult = await answerResponse.json();
        console.log('✅ Answer submitted');
        console.log('   New Score:', answerResult.session.score);
        console.log('   Current Question:', answerResult.session.currentQuestion);
        
        // Test 4: Get leaderboard
        console.log('\n4️⃣ Testing leaderboard...');
        const leaderboardResponse = await fetch(`${API_URL}/leaderboard`);
        
        if (!leaderboardResponse.ok) {
            throw new Error(`Leaderboard retrieval failed: ${leaderboardResponse.status}`);
        }
        
        const leaderboard = await leaderboardResponse.json();
        console.log('✅ Leaderboard retrieved');
        console.log('   Total Entries:', leaderboard.length);
        
        console.log('\n✨ All tests passed! API is working correctly.\n');
        
    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
        console.error('\nMake sure the server is running:\n  npm start\n  or\n  vercel dev\n');
        process.exit(1);
    }
}

// Run tests
testAPI();
