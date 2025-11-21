# 🎮 CYBERQUIZ: Offensive Security Challenge

A cyberpunk-themed, multiplayer offensive security quiz application with persistent sessions, real-time scoring, and competitive leaderboards.

## 🌟 Features

### Core Gameplay
- **60 Challenging Questions** covering comprehensive offensive security topics
- **Dynamic Scoring System**: Start with 1000 points
  - ✅ Correct answer: +50 points
  - ❌ Wrong answer: -50 points
  - 🚨 Reach 0 points: Game Over
- **45-Minute Time Limit** with absolute timer (continues even after page refresh)
- **No Restarts**: One shot to complete the entire quiz
- **Must Answer Correctly**: Can't proceed until the correct answer is selected

### Multiplayer Support
- ✨ **Concurrent Players**: Multiple users can play simultaneously
- 💾 **Persistent Sessions**: Sessions saved server-side using unique IDs
- 🔄 **Resume Capability**: Refresh the page without losing progress or resetting timer
- 🏆 **Global Leaderboard**: All completed players ranked by score and time

### Grading System
Players receive grades based on a composite score (70% points, 30% speed):
- **S+ ELITE HACKER** (90%+)
- **S MASTER HACKER** (80-89%)
- **A+ EXPERT HACKER** (70-79%)
- **A ADVANCED HACKER** (60-69%)
- **B+ SKILLED HACKER** (50-59%)
- **B COMPETENT HACKER** (40-49%)
- **C+ NOVICE HACKER** (30-39%)
- **C SCRIPT KIDDIE** (20-29%)
- **D WANNABE** (<20%)

### Cyberpunk Theme
- 🎨 Neon glitch effects and animations
- 🌐 Animated grid background
- 📺 CRT scan-line effects
- 💻 Terminal-style interface
- ⚡ Real-time visual feedback

## 📋 Prerequisites

- **Node.js** (v14 or higher)
- **npm** (comes with Node.js)

## 🚀 Installation

1. **Install Dependencies**
```powershell
npm install
```

This installs:
- `express` - Web server framework
- `uuid` - Unique session ID generation
- `cors` - Cross-origin resource sharing
- `nodemon` (dev) - Auto-restart during development

## 🎯 Running the Application

### Production Mode
```powershell
npm start
```

### Development Mode (with auto-restart)
```powershell
npm run dev
```

The server will start on **http://localhost:3000**

## 🎮 How to Play

1. **Enter Your Hacker Alias**
   - Choose a unique username (max 20 characters)
   - Click "JACK IN" to start

2. **Answer Questions**
   - Read each security question carefully
   - Select your answer from 4 options
   - Correct answers add 50 points and advance to next question
   - Wrong answers deduct 50 points - try again until correct

3. **Monitor Your Status**
   - **OPERATIVE**: Your username
   - **CREDITS**: Current score
   - **TIME REMAINING**: Countdown timer
   - **PROGRESS**: Questions completed / 60

4. **Complete the Challenge**
   - Answer all 60 questions before time expires
   - Don't let your credits reach zero!
   - See your final grade and leaderboard position

## 🔒 Game Rules

- ⏰ **Absolute Timer**: 45 minutes from start, no resets
- 🔄 **Session Persistence**: Refreshing the page won't reset progress or timer
- 🚫 **No Restarts**: Once started, you must complete or fail
- ✅ **Correct to Continue**: Must select the right answer to proceed
- 💀 **Elimination**: Reaching 0 points ends the game
- ⏱️ **Time Out**: Running out of time terminates the session

## 📁 Project Structure

```
Off_Sec_Quiz/
├── index.html          # Main HTML structure
├── styles.css          # Cyberpunk theme styling
├── app.js              # Frontend logic & API integration
├── quiz.js             # 60 offensive security questions
├── server.js           # Express backend server
├── package.json        # Dependencies & scripts
├── sessions/           # Player session storage (auto-created)
├── leaderboard.json    # Global leaderboard data (auto-created)
└── Readme.md           # This file
```

## 🛠️ Technical Details

### Backend (server.js)
- **Express.js** REST API
- **File-based persistence** for sessions and leaderboard
- **UUID** for unique session tracking
- **Automatic cleanup** of old sessions (24h+)
- **Concurrent player support**

### Frontend (app.js)
- **Fetch API** for server communication
- **LocalStorage** for session ID persistence
- **Real-time timer** with visual warnings
- **Automatic session recovery** on page load
- **Prevention of accidental navigation**

### Session Management
- Each player gets a unique session ID stored server-side
- Sessions track: username, score, current question, time remaining, status
- Session ID stored in browser's localStorage
- Timer calculated server-side based on start time (immune to refresh)

## 🎨 Customization

### Modify Questions
Edit `quiz.js` to add/change questions:
```javascript
{
    question: "Your question here?",
    options: ["Option A", "Option B", "Option C", "Option D"],
    correct: 0  // Index of correct answer (0-3)
}
```

### Adjust Game Settings
In `server.js`, modify:
- Time limit: Change `45 * 60` (in seconds)
- Starting points: Change initial `score: 1000`
- Point values: Modify `+50` and `-50` in answer handling

### Change Theme Colors
In `styles.css`, modify CSS variables:
```css
:root {
    --neon-cyan: #0ff;
    --neon-pink: #f0f;
    --neon-purple: #a0f;
    --neon-green: #0f0;
}
```

## 🌐 Deployment

### Local Network Access
Change the API URL in `app.js`:
```javascript
const API_URL = 'http://YOUR_IP:3000/api';
```

Then access from other devices on the same network.

### Cloud Deployment
Deploy to services like:
- **Heroku**
- **Railway**
- **Render**
- **DigitalOcean**

Set the PORT environment variable and update API_URL to your domain.

## 🐛 Troubleshooting

### Port Already in Use
Change port in `server.js`:
```javascript
const PORT = 3001;  // or any available port
```

### Sessions Not Persisting
- Check that `sessions/` directory exists
- Verify write permissions
- Check browser localStorage is enabled

### Timer Not Working
- Ensure server time is accurate
- Check browser console for errors
- Verify API connectivity

## 📊 Leaderboard Data

Leaderboard data is stored in `leaderboard.json` with:
- Username
- Final score
- Time used
- Time remaining
- Grade
- Timestamp

## 🔐 Security Topics Covered

The quiz includes questions on:
- OSINT & Reconnaissance
- Network Scanning (Nmap)
- Web Application Security (XSS, SQLi, CSRF)
- Exploitation Tools (Metasploit, Burp Suite)
- Privilege Escalation
- Password Cracking
- Wireless Security
- Social Engineering
- Common Vulnerabilities
- Penetration Testing Methodology

## 📝 License

MIT License - Feel free to modify and use for educational purposes.

## 🤝 Contributing

To add more questions or improve features:
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 🎓 Educational Use

This quiz is designed for educational purposes to test knowledge of offensive security concepts. All content relates to ethical hacking and penetration testing fundamentals.

---

**⚡ HACK THE SYSTEM. BEAT THE CLOCK. DOMINATE THE LEADERBOARD. ⚡**
