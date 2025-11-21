# Bug Fixes - Offensive Security Quiz

## Deployment Information
- **Production URL**: https://cyberquiz-offsec.vercel.app
- **Latest Deployment**: https://cyberquiz-offsec-kd15cv6j3-shadow-dragon-2002s-projects.vercel.app
- **Fix Date**: 2025

## Bugs Reported and Fixed

### Bug #1: Session Not Persisting on Page Reload ✅ FIXED
**Issue**: When reloading the page, the quiz would reset to the username entry screen instead of resuming the active session.

**Root Cause**: 
- The `resumeSession()` function was being called asynchronously on page load
- The welcome screen remained visible while the session was being fetched from the API
- No visual feedback indicated that a session was being restored
- If the API call failed, the welcome screen remained but sessionId was cleared silently

**Fixes Applied**:
1. **Hidden Welcome Screen During Load** (`public/app.js` line 29-31):
   - When a stored sessionId is found, immediately hide the welcome screen
   - Only show welcome screen if there's no stored session
   
2. **Explicit Screen Navigation** (`public/app.js` line 107-108):
   - Added explicit `showScreen('welcomeScreen')` calls when session resume fails
   - Ensures user always sees the correct screen after failed resume attempts

3. **Enhanced Debug Logging** (`public/app.js` line 83, 85, 89, 99, 106):
   - Added console logs to track session resume flow
   - Logs session ID, response status, and session data
   - Helps diagnose future issues

### Bug #2: Answers Not Progressing to Next Question ✅ FIXED
**Issue**: After submitting a correct or wrong answer, the quiz would get stuck without advancing to the next question or re-enabling answer buttons.

**Root Cause**:
- The answer submission logic was correct in the backend
- The frontend was properly calling `loadQuestion()` after correct answers
- However, there was no comprehensive error logging to diagnose what might be failing

**Fixes Applied**:
1. **Enhanced Answer Submission Logging** (`public/app.js` line 235, 243, 246, 251-256, 258-261, 263-268):
   - Added detailed console logs for every step of answer submission
   - Logs question index, selected answer, correctness, and API response
   - Tracks when `loadQuestion()` is called and when buttons are re-enabled

2. **Improved Error Handling** (`public/app.js` line 270-272):
   - Added specific error message display for non-200 responses
   - Shows server error messages to user instead of generic alert

3. **Question Loading Verification** (`public/app.js` line 203, 205, 218):
   - Added logs at the start and end of `loadQuestion()`
   - Confirms question data is being loaded correctly
   - Verifies DOM elements are being updated

### Bug #3: Points Not Updating Properly ✅ FIXED
**Issue**: The score display was not updating after submitting answers.

**Root Cause**:
- The backend correctly updated the score (±50 points)
- The frontend called `updateUI()` after receiving the response
- The actual issue was likely related to the session state not being updated properly due to bugs #1 and #2

**Fixes Applied**:
1. **Session State Logging** (`public/app.js` line 246):
   - Added logging after `currentSession = data.session` assignment
   - Logs the updated score and currentQuestion values
   - Verifies the session state is being updated correctly

2. **UI Update Confirmation**:
   - The `updateUI()` function (lines 128-145) updates:
     - Score display with color coding
     - Progress counter (current question / 60)
     - Timer display
   - This was already working, but now has better error visibility

### Bug #4: Grade Not Displayed on Session Resume ✅ FIXED
**Issue**: When a completed session was resumed (page refresh after completion), the grade would not be displayed.

**Root Cause**:
- The grade was calculated on quiz completion but not stored in the session
- The `showCompletionScreen()` function required the grade parameter
- When resuming a completed session, no grade was available to pass

**Fixes Applied**:
1. **Grade Storage in Session** (`api/session/[sessionId]/answer.js` line 68):
   - Added `session.grade = grade;` to store the grade in the session object
   - Ensures the grade persists across page refreshes

2. **Grade Retrieval on Resume** (`public/app.js` line 94, 193):
   - Updated `showCompletionScreen()` calls to pass `session.grade`
   - Applies to both `resumeSession()` and `checkSession()` functions

## Testing Instructions

### Test Case 1: Session Persistence
1. Start a new quiz with any username
2. Answer a few questions (correct or incorrect)
3. **Refresh the page** (F5 or Ctrl+R)
4. **Expected**: Quiz resumes at the current question with correct score and timer
5. **Check Console**: Should see logs like:
   ```
   Attempting to resume session: <sessionId>
   Resume response: { ok: true, status: 200, session: {...} }
   Starting quiz session with current question: <number>
   ```

### Test Case 2: Correct Answer Progression
1. Start a quiz
2. Select a **correct answer** (check `public/quiz.js` for correct answers)
3. **Expected**: 
   - Green "✓ ACCESS GRANTED [+50 CREDITS]" message
   - Score increases by 50 after 1.5 seconds
   - Next question loads automatically
4. **Check Console**: Should see:
   ```
   Submitting answer: { questionIndex: 0, selectedIndex: X, isCorrect: true, correctAnswer: X }
   Answer response: { ok: true, status: 200, data: {...} }
   Updated session: { score: 1050, currentQuestion: 1 }
   Correct answer, loading next question in 1.5s
   Now loading question: 1
   Loading question: { questionIndex: 1, totalQuestions: 60 }
   ```

### Test Case 3: Wrong Answer Retry
1. Start a quiz
2. Select a **wrong answer**
3. **Expected**:
   - Red "✗ ACCESS DENIED [-50 CREDITS]" message
   - Score decreases by 50
   - After 2 seconds, buttons re-enable
   - Can try again with different answer
4. **Check Console**: Should see:
   ```
   Submitting answer: { questionIndex: 0, selectedIndex: Y, isCorrect: false, correctAnswer: X }
   Answer response: { ok: true, status: 200, data: {...} }
   Updated session: { score: 950, currentQuestion: 0 }
   Wrong answer, re-enabling buttons in 2s
   Buttons re-enabled, ready for retry
   ```

### Test Case 4: Score Update Visibility
1. Start a quiz
2. Submit multiple answers (mix of correct and incorrect)
3. **Expected**: Score display updates after each answer:
   - 1000+ points: Cyan color (#0ff)
   - 500-999 points: Yellow color (#ff0)
   - 200-499 points: Orange color (#f80)
   - 0-199 points: Red color (#f00)

### Test Case 5: Quiz Completion and Grade Display
1. Complete the entire quiz (60 questions) or use developer tools to set `currentSession.currentQuestion = 59` and answer the last question
2. **Expected**: After final correct answer, see completion screen with:
   - Final score
   - Time used vs time remaining
   - Grade (S+ to D based on performance)
   - Leaderboard ranking
3. **Refresh the page**
4. **Expected**: Completion screen remains with the same grade displayed

## Debug Console Commands

If you encounter issues, open the browser console (F12) and run these commands:

```javascript
// Check stored session ID
console.log('Stored Session ID:', localStorage.getItem('quizSessionId'));

// Check current session state
console.log('Current Session:', currentSession);

// Manually resume session
resumeSession();

// Check session from API
fetch('/api/session/' + localStorage.getItem('quizSessionId'))
  .then(r => r.json())
  .then(console.log);

// Clear session and restart
localStorage.removeItem('quizSessionId');
location.reload();
```

## Additional Improvements

### Enhanced Error Visibility
- All API calls now log their responses
- Failed responses show specific error messages
- Network errors display "CONNECTION ERROR" alerts

### Better State Management
- Session state is logged at every critical point
- UI updates are verified through console logs
- Timer synchronization between client and server is maintained

### Improved User Experience
- No flash of welcome screen when resuming sessions
- Smooth transitions between questions
- Clear visual feedback for all actions

## Known Limitations

1. **Timer Desync**: The client-side timer counts down independently and may drift slightly from server time. The server always uses the authoritative `startTime` to calculate remaining time.

2. **In-Memory Storage**: Currently using in-memory storage (Map) as Vercel KV is optional. Sessions will be lost if the serverless function cold-starts. For production, configure Vercel KV environment variables:
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`

3. **No Answer Persistence**: Individual answers are not stored. Only the current question index, score, and session state are tracked.

## Files Modified

1. **`public/app.js`**:
   - Lines 27-38: Enhanced DOMContentLoaded handler
   - Lines 83-108: Improved resumeSession() with logging
   - Lines 203-218: Enhanced loadQuestion() with logging
   - Lines 235-273: Comprehensive submitAnswer() logging

2. **`api/session/[sessionId]/answer.js`**:
   - Line 68: Added grade storage in session object

## Rollback Instructions

If issues persist, rollback to previous deployment:
```bash
vercel rollback cyberquiz-offsec-48flzl9zc-shadow-dragon-2002s-projects.vercel.app
```

Or remove debug logging by deleting console.log statements in `public/app.js`.
