// API Configuration
const API_URL = '/api';

// Global state
let sessionId = null;
let currentSession = null;
let timerInterval = null;

// Screen management
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

// Format time (seconds to MM:SS)
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    // Check for existing session
    const storedSessionId = localStorage.getItem('quizSessionId');
    if (storedSessionId) {
        sessionId = storedSessionId;
        // Hide welcome screen while loading session
        document.getElementById('welcomeScreen').classList.remove('active');
        resumeSession();
    } else {
        // No stored session, ensure welcome screen is shown
        showScreen('welcomeScreen');
    }
    
    // Start button
    document.getElementById('startBtn').addEventListener('click', startQuiz);
    
    // Username input enter key
    document.getElementById('usernameInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            startQuiz();
        }
    });
});

// Start new quiz
async function startQuiz() {
    const username = document.getElementById('usernameInput').value.trim();
    
    if (!username) {
        alert('⚠ ERROR: HACKER ALIAS REQUIRED');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/session/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            sessionId = data.sessionId;
            currentSession = data.sessionData;
            localStorage.setItem('quizSessionId', sessionId);
            startQuizSession();
        } else {
            alert('ERROR: ' + data.error);
        }
    } catch (error) {
        alert('CONNECTION ERROR: Unable to establish link to server');
        console.error(error);
    }
}

// Resume existing session
async function resumeSession() {
    try {
        console.log('Attempting to resume session:', sessionId);
        const response = await fetch(`${API_URL}/session/${sessionId}`);
        const session = await response.json();
        
        console.log('Resume response:', { ok: response.ok, status: response.status, session });
        
        if (response.ok) {
            currentSession = session;
            
            if (!session.active) {
                if (session.completed) {
                    showCompletionScreen(session.grade);
                } else if (session.eliminated) {
                    if (session.timeRemaining === 0) {
                        showTimeoutScreen();
                    } else {
                        showGameOverScreen();
                    }
                }
            } else {
                console.log('Starting quiz session with current question:', session.currentQuestion);
                startQuizSession();
            }
        } else {
            // Session not found, start fresh
            console.log('Session not found, clearing localStorage');
            localStorage.removeItem('quizSessionId');
            sessionId = null;
            showScreen('welcomeScreen');
        }
    } catch (error) {
        console.error('Error resuming session:', error);
        localStorage.removeItem('quizSessionId');
        sessionId = null;
        showScreen('welcomeScreen');
    }
}

// Start quiz session
function startQuizSession() {
    document.getElementById('playerName').textContent = currentSession.username;
    updateUI();
    loadQuestion();
    startTimer();
    showScreen('quizScreen');
}

// Update UI elements
function updateUI() {
    document.getElementById('score').textContent = currentSession.score;
    document.getElementById('progress').textContent = `${currentSession.currentQuestion}/60`;
    document.getElementById('timer').textContent = formatTime(currentSession.timeRemaining);
    
    // Color code score
    const scoreElement = document.getElementById('score');
    if (currentSession.score >= 1000) {
        scoreElement.style.color = '#0ff';
    } else if (currentSession.score >= 500) {
        scoreElement.style.color = '#ff0';
    } else if (currentSession.score >= 200) {
        scoreElement.style.color = '#f80';
    } else {
        scoreElement.style.color = '#f00';
    }
}

// Timer
function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    
    timerInterval = setInterval(async () => {
        if (currentSession.timeRemaining > 0) {
            currentSession.timeRemaining--;
            document.getElementById('timer').textContent = formatTime(currentSession.timeRemaining);
            
            // Warning colors
            const timerElement = document.getElementById('timer');
            if (currentSession.timeRemaining <= 60) {
                timerElement.style.color = '#f00';
                timerElement.style.animation = 'pulse 0.5s infinite';
            } else if (currentSession.timeRemaining <= 300) {
                timerElement.style.color = '#ff0';
            }
            
            if (currentSession.timeRemaining === 0) {
                clearInterval(timerInterval);
                await checkSession();
            }
        }
    }, 1000);
}

// Check session status
async function checkSession() {
    try {
        const response = await fetch(`${API_URL}/session/${sessionId}`);
        const session = await response.json();
        
        if (response.ok) {
            currentSession = session;
            
            if (!session.active) {
                clearInterval(timerInterval);
                
                if (session.timeRemaining === 0) {
                    showTimeoutScreen();
                } else if (session.eliminated) {
                    showGameOverScreen();
                } else if (session.completed) {
                    showCompletionScreen(session.grade);
                }
            }
        }
    } catch (error) {
        console.error('Error checking session:', error);
    }
}

// Load question
function loadQuestion() {
    const questionIndex = currentSession.currentQuestion;
    
    console.log('Loading question:', { questionIndex, totalQuestions: questions.length });
    
    if (questionIndex >= questions.length) {
        console.log('No more questions available');
        return;
    }
    
    const q = questions[questionIndex];
    
    document.getElementById('questionNum').textContent = questionIndex + 1;
    document.getElementById('question').textContent = q.question;
    document.getElementById('feedback').textContent = '';
    
    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = '';
    
    q.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.textContent = `${String.fromCharCode(65 + index)}. ${option}`;
        button.onclick = () => submitAnswer(index);
        optionsContainer.appendChild(button);
    });
    
    console.log('Question loaded successfully:', q.question.substring(0, 50) + '...');
}

// Submit answer
async function submitAnswer(selectedIndex) {
    const questionIndex = currentSession.currentQuestion;
    const q = questions[questionIndex];
    const isCorrect = selectedIndex === q.correct;
    
    console.log('Submitting answer:', { questionIndex, selectedIndex, isCorrect, correctAnswer: q.correct });
    
    // Disable all buttons
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.disabled = true;
    });
    
    // Visual feedback
    const buttons = document.querySelectorAll('.option-btn');
    if (isCorrect) {
        buttons[selectedIndex].classList.add('correct');
        document.getElementById('feedback').innerHTML = '<span class="success">✓ ACCESS GRANTED [+50 CREDITS]</span>';
    } else {
        buttons[selectedIndex].classList.add('wrong');
        document.getElementById('feedback').innerHTML = '<span class="danger">✗ ACCESS DENIED [-50 CREDITS]</span>';
    }
    
    // Submit to server
    try {
        const response = await fetch(`${API_URL}/session/${sessionId}/answer`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ questionIndex, isCorrect })
        });
        
        const data = await response.json();
        
        console.log('Answer response:', { ok: response.ok, status: response.status, data });
        
        if (response.ok) {
            currentSession = data.session;
            console.log('Updated session:', { score: currentSession.score, currentQuestion: currentSession.currentQuestion });
            updateUI();
            
            if (data.eliminated) {
                console.log('Player eliminated');
                clearInterval(timerInterval);
                setTimeout(() => showGameOverScreen(), 2000);
            } else if (data.completed) {
                console.log('Quiz completed with grade:', data.grade);
                clearInterval(timerInterval);
                setTimeout(() => showCompletionScreen(data.grade), 2000);
            } else if (data.timeout) {
                console.log('Time ran out');
                clearInterval(timerInterval);
                setTimeout(() => showTimeoutScreen(), 2000);
            } else if (isCorrect) {
                console.log('Correct answer, loading next question in 1.5s');
                setTimeout(() => {
                    console.log('Now loading question:', currentSession.currentQuestion);
                    loadQuestion();
                }, 1500);
            } else {
                console.log('Wrong answer, re-enabling buttons in 2s');
                // Re-enable buttons for another attempt
                setTimeout(() => {
                    document.querySelectorAll('.option-btn').forEach(btn => {
                        btn.disabled = false;
                        btn.classList.remove('wrong', 'correct');
                    });
                    document.getElementById('feedback').textContent = '';
                    console.log('Buttons re-enabled, ready for retry');
                }, 2000);
            }
        } else {
            console.error('Server returned error:', data);
            alert('ERROR: ' + (data.error || 'Unable to submit answer'));
        }
    } catch (error) {
        console.error('Error submitting answer:', error);
        alert('CONNECTION ERROR: Unable to submit answer');
    }
}

// Show game over screen
function showGameOverScreen() {
    document.getElementById('goPlayerName').textContent = currentSession.username;
    document.getElementById('goProgress').textContent = currentSession.currentQuestion;
    const timeUsed = (45 * 60) - currentSession.timeRemaining;
    document.getElementById('goTime').textContent = formatTime(timeUsed);
    showScreen('gameOverScreen');
    localStorage.removeItem('quizSessionId');
}

// Show timeout screen
function showTimeoutScreen() {
    document.getElementById('toPlayerName').textContent = currentSession.username;
    document.getElementById('toProgress').textContent = currentSession.currentQuestion;
    document.getElementById('toScore').textContent = currentSession.score;
    showScreen('timeoutScreen');
    localStorage.removeItem('quizSessionId');
}

// Show completion screen
async function showCompletionScreen(grade) {
    const timeUsed = (45 * 60) - currentSession.timeRemaining;
    
    document.getElementById('compPlayerName').textContent = currentSession.username;
    document.getElementById('finalScore').textContent = currentSession.score;
    document.getElementById('timeTaken').textContent = formatTime(timeUsed);
    document.getElementById('finalGrade').textContent = grade || 'CALCULATING...';
    
    // Load leaderboard
    try {
        const response = await fetch(`${API_URL}/leaderboard`);
        const leaderboard = await response.json();
        
        const leaderboardContainer = document.getElementById('leaderboard');
        leaderboardContainer.innerHTML = '';
        
        if (leaderboard.length === 0) {
            leaderboardContainer.innerHTML = '<p class="terminal-text">NO RECORDS FOUND</p>';
        } else {
            const table = document.createElement('table');
            table.className = 'leaderboard-table';
            table.innerHTML = `
                <thead>
                    <tr>
                        <th>RANK</th>
                        <th>OPERATIVE</th>
                        <th>CREDITS</th>
                        <th>TIME</th>
                        <th>GRADE</th>
                    </tr>
                </thead>
                <tbody>
                    ${leaderboard.map((entry, index) => `
                        <tr class="${entry.username === currentSession.username ? 'highlight' : ''}">
                            <td>${index + 1}</td>
                            <td>${entry.username}</td>
                            <td>${entry.score}</td>
                            <td>${formatTime(entry.timeUsed)}</td>
                            <td><span class="grade-badge">${entry.grade}</span></td>
                        </tr>
                    `).join('')}
                </tbody>
            `;
            leaderboardContainer.appendChild(table);
        }
    } catch (error) {
        console.error('Error loading leaderboard:', error);
    }
    
    showScreen('completionScreen');
    localStorage.removeItem('quizSessionId');
}

// Prevent accidental navigation
window.addEventListener('beforeunload', (e) => {
    if (sessionId && currentSession && currentSession.active) {
        e.preventDefault();
        e.returnValue = 'Your quiz progress will be saved but the timer continues. Are you sure?';
    }
});
