# 🎮 CYBERQUIZ: Offensive Security Challenge
## Complete Project Documentation

<div align="center">

**A cyberpunk-themed, multiplayer offensive security quiz platform with real-time scoring, persistent sessions, and competitive leaderboards.**

[![Live Demo](https://img.shields.io/badge/Live-Demo-00ff00?style=for-the-badge&logo=vercel)](https://cyberquiz-offsec.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

</div>

---

## 📑 Table of Contents
- [Project Overview](#-project-overview)
- [Key Features](#-key-features)
- [Technical Architecture](#-technical-architecture)
- [Gameplay Mechanics](#-gameplay-mechanics)
- [Theme & Design](#-theme--design)
- [Session Management](#-session-management)
- [Deployment](#-deployment)
- [API Reference](#-api-reference)
- [Question Bank](#-question-bank)
- [Security Considerations](#-security-considerations)

---

## 🎯 Project Overview

### Purpose
CYBERQUIZ is an educational web application designed to test and enhance knowledge in offensive security and ethical hacking. The platform gamifies cybersecurity learning through a competitive, time-constrained quiz experience with authentic hacker aesthetics.

### Target Audience
- Cybersecurity students and enthusiasts
- Penetration testing professionals
- Security certification candidates (CEH, OSCP, etc.)
- CTF competitors
- Anyone interested in offensive security concepts

### Core Philosophy
1. **No Second Chances**: Simulates real-world scenarios where mistakes have consequences
2. **Persistence**: Encourages completion despite challenges
3. **Competition**: Drives learning through leaderboard rankings
4. **Authenticity**: Cyberpunk theme immerses users in a hacker environment

---

## ✨ Key Features

### 🎲 Gameplay Features

#### Dynamic Scoring System
- **Starting Capital**: 1000 points (called "CREDITS" in-game)
- **Reward Mechanism**: +50 credits per correct answer
- **Penalty System**: -50 credits per wrong answer
- **Elimination Condition**: Reaching 0 credits ends the game immediately
- **Maximum Possible Score**: 4000 credits (1000 start + 60 questions × 50)

#### Time-Based Challenge
- **Absolute Timer**: 45 minutes (2700 seconds) from session start
- **Server-Side Calculation**: Timer based on `startTime` timestamp, immune to manipulation
- **Persistent Countdown**: Continues even if page is refreshed or closed
- **Visual Warnings**:
  - Green/Cyan: Normal (> 5 minutes remaining)
  - Yellow: Warning (3-5 minutes remaining)
  - Red + Pulsing: Critical (< 1 minute remaining)

#### Answer Progression System
- **Mandatory Correctness**: Cannot advance without selecting the correct answer
- **Unlimited Retries**: Can attempt wrong answers multiple times (with point penalties)
- **Instant Feedback**: Visual indicators show correct (green) or wrong (red) answers
- **Auto-Advance**: Automatically loads next question after correct answer (1.5s delay)

#### Competitive Grading
Composite scoring algorithm: **70% performance + 30% speed**

| Grade | Score Range | Title |
|-------|-------------|-------|
| S+ | 90-100% | ELITE HACKER |
| S | 80-89% | MASTER HACKER |
| A+ | 70-79% | EXPERT HACKER |
| A | 60-69% | ADVANCED HACKER |
| B+ | 50-59% | SKILLED HACKER |
| B | 40-49% | COMPETENT HACKER |
| C+ | 30-39% | NOVICE HACKER |
| C | 20-29% | SCRIPT KIDDIE |
| D | 0-19% | WANNABE |

**Grading Formula**:
```javascript
scorePercentage = (finalScore / 4000) * 100
timeScore = (timeRemaining / 2700) * 100
composite = (scorePercentage * 0.7) + (timeScore * 0.3)
```

### 🌐 Multiplayer Features

#### Concurrent Sessions
- **Unlimited Players**: Multiple users can play simultaneously
- **Isolated Sessions**: Each player has independent state and progress
- **Unique Session IDs**: UUID-based identification prevents conflicts
- **Session Duration**: 24-hour expiration for inactive sessions

#### Persistent State Management
- **Auto-Save**: Every answer submission updates server-side state
- **Refresh-Proof**: Reload page without losing progress or timer
- **Cross-Device Resume**: Continue on different devices using session ID
- **LocalStorage Integration**: Client-side session ID persistence

#### Global Leaderboard
- **Real-Time Updates**: Automatically updates when players complete quiz
- **Sorting Algorithm**: 
  1. Primary: Highest score
  2. Secondary: Fastest completion time
- **Displayed Data**:
  - Rank position
  - Username
  - Final score
  - Time used
  - Grade achieved
  - Completion timestamp

---

## 🏗️ Technical Architecture

### System Overview

```
┌──────────────────────────────────────────────────────────┐
│                    CLIENT SIDE                           │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐        │
│  │ index.html │  │  app.js    │  │  quiz.js   │        │
│  │  (View)    │  │ (Logic)    │  │ (Data)     │        │
│  └────────────┘  └────────────┘  └────────────┘        │
│         │               │               │                │
│         └───────────────┴───────────────┘                │
│                       │                                   │
│                  localStorage                             │
│              (sessionId: UUID)                            │
└───────────────────────│──────────────────────────────────┘
                        │
                   HTTPS/REST
                        │
┌───────────────────────┴──────────────────────────────────┐
│                    SERVER SIDE                           │
│  ┌─────────────────────────────────────────────────┐    │
│  │         API Routes (Vercel Serverless)          │    │
│  │  ┌──────────────────────────────────────────┐  │    │
│  │  │ POST /api/session/create                 │  │    │
│  │  │ GET  /api/session/:id                    │  │    │
│  │  │ POST /api/session/:id/answer             │  │    │
│  │  │ GET  /api/leaderboard                    │  │    │
│  │  └──────────────────────────────────────────┘  │    │
│  └─────────────────────────────────────────────────┘    │
│                       │                                   │
│  ┌─────────────────────────────────────────────────┐    │
│  │      Storage Layer (storage-enhanced.js)        │    │
│  │                                                  │    │
│  │  ┌──────────────┐      ┌──────────────┐       │    │
│  │  │  Vercel KV   │      │  In-Memory   │       │    │
│  │  │ (Optional)   │  OR  │     Map      │       │    │
│  │  │  Redis-like  │      │  (Fallback)  │       │    │
│  │  └──────────────┘      └──────────────┘       │    │
│  └─────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────┘
```

### Technology Stack

#### Frontend
| Technology | Purpose | Version |
|------------|---------|---------|
| **HTML5** | Structure and semantics | - |
| **CSS3** | Styling and animations | - |
| **Vanilla JavaScript** | Client-side logic | ES6+ |
| **Fetch API** | HTTP requests | Native |
| **LocalStorage** | Session ID persistence | Native |

#### Backend
| Technology | Purpose | Version |
|------------|---------|---------|
| **Node.js** | Runtime environment | v14+ |
| **Express.js** | Web framework (local dev) | ^4.18.2 |
| **Vercel Serverless** | Production deployment | - |
| **UUID** | Session ID generation | ^9.0.0 |

#### Storage
| Technology | Purpose | Type |
|------------|---------|------|
| **Vercel KV** | Primary (optional) | Redis-compatible |
| **In-Memory Map** | Fallback | Volatile |

### File Structure

```
Off_Sec_Quiz/
│
├── 📁 public/                      # Static frontend files
│   ├── index.html                  # Main UI structure
│   ├── app.js                      # Client-side logic
│   ├── quiz.js                     # 60 question database
│   └── styles.css                  # Cyberpunk theme styling
│
├── 📁 api/                         # Serverless backend functions
│   ├── storage-enhanced.js         # Storage abstraction layer
│   ├── leaderboard.js              # GET /api/leaderboard
│   │
│   └── 📁 session/
│       ├── create.js               # POST /api/session/create
│       ├── [sessionId].js          # GET /api/session/:id
│       │
│       └── 📁 [sessionId]/
│           └── answer.js           # POST /api/session/:id/answer
│
├── 📁 sessions/                    # Local development storage
│   └── *.json                      # Individual session files
│
├── server.js                       # Express dev server
├── vercel.json                     # Deployment configuration
├── package.json                    # Dependencies
├── leaderboard.json                # Local leaderboard storage
│
└── 📁 legacy/                      # Old structure (reference)
    ├── app.js
    ├── quiz.js
    ├── styles.css
    └── index.html
```

---

## 🎮 Gameplay Mechanics

### Session Lifecycle

```
┌─────────────────────────────────────────────────────────┐
│                    SESSION STATES                        │
└─────────────────────────────────────────────────────────┘

    [WELCOME SCREEN]
           │
           │ User enters username
           ▼
    POST /api/session/create
           │
           ├─ Generate UUID
           ├─ Create session object:
           │    {
           │      id: "uuid",
           │      username: "input",
           │      score: 1000,
           │      currentQuestion: 0,
           │      startTime: Date.now(),
           │      timeRemaining: 2700,
           │      active: true,
           │      completed: false,
           │      eliminated: false
           │    }
           │
           ▼
    [QUIZ SCREEN - ACTIVE]
           │
           ├─ Load question
           ├─ User selects answer
           ▼
    POST /api/session/:id/answer
           │
           ├─ Calculate time remaining
           ├─ Update score (±50)
           │
           ├─ If correct: currentQuestion++
           ├─ If score ≤ 0 ──────────┐
           ├─ If timeRemaining ≤ 0 ──┤
           ├─ If question 60 ─────────┤
           │                          │
           ▼                          ▼
    [CONTINUE]              [END CONDITIONS]
           │                          │
           │                          ├─ score ≤ 0
           │                          │    └─> GAME OVER SCREEN
           │                          │
           │                          ├─ timeRemaining ≤ 0
           │                          │    └─> TIMEOUT SCREEN
           │                          │
           │                          └─ question ≥ 60
           │                               ├─ Calculate grade
           │                               ├─ Update leaderboard
           │                               └─> COMPLETION SCREEN
           │
           ▼
    [NEXT QUESTION]
           │
           └─ Repeat until END
```

### Answer Processing Flow

```javascript
// Client submits answer
submitAnswer(selectedIndex) {
  1. Disable all option buttons
  2. Show visual feedback (green/red)
  3. POST to /api/session/:id/answer
     └─ Body: { questionIndex, isCorrect }
  
  4. Server processes:
     ├─ Calculate elapsed time
     ├─ Update timeRemaining
     ├─ Check timeout condition
     │
     ├─ If correct answer:
     │   ├─ score += 50
     │   ├─ currentQuestion++
     │   └─ Check if completed (question ≥ 60)
     │
     └─ If wrong answer:
         ├─ score -= 50
         └─ Check if eliminated (score ≤ 0)
  
  5. Client receives response:
     ├─ Update currentSession
     ├─ Update UI (score, progress, timer)
     │
     ├─ If eliminated → Show Game Over (2s delay)
     ├─ If completed → Show Completion (2s delay)
     ├─ If timeout → Show Timeout (2s delay)
     │
     ├─ If correct → Load next question (1.5s delay)
     └─ If wrong → Re-enable buttons (2s delay)
}
```

### Timer Synchronization

The timer uses a **server-authoritative** model:

```javascript
// Server-side calculation (always accurate)
const startTime = session.startTime;  // Timestamp when quiz started
const elapsed = Math.floor((Date.now() - startTime) / 1000);
const timeRemaining = Math.max(0, (45 * 60) - elapsed);

// Client-side display (optimistic countdown)
timerInterval = setInterval(() => {
  currentSession.timeRemaining--;
  updateTimerDisplay();
  
  // Verify with server every answer submission
}, 1000);
```

**Why this approach?**
- ✅ Immune to client-side manipulation
- ✅ Survives page refreshes
- ✅ Consistent across devices
- ⚠️ Client timer may drift slightly (re-synced on each answer)

---

## 🎨 Theme & Design

### Cyberpunk Aesthetic Philosophy

The interface channels the gritty, neon-soaked aesthetic of cyberpunk culture, creating an immersive hacker environment.

#### Visual Elements

##### Color Palette
```css
--neon-cyan:    #0ff    /* Primary accent, success states */
--neon-pink:    #f0f    /* Secondary accent, danger states */
--neon-purple:  #a0f    /* Tertiary accent, highlights */
--neon-green:   #0f0    /* Success feedback */
--dark-bg:      #0a0a0a /* Primary background */
--dark-panel:   #1a1a1a /* Panel backgrounds */
```

##### Typography
- **Primary Font**: 'Orbitron' (futuristic, geometric)
- **Monospace Font**: 'Courier New' (terminal-style)
- **Text Effects**:
  - Neon glow (text-shadow with cyan/pink)
  - Glitch animation on headers
  - Scanline overlay for CRT effect

##### Animations

**1. Glitch Effect**
```css
@keyframes glitch {
  0%, 100% { text-shadow: neon glow }
  25% { transform: translate(-2px, 2px) }
  50% { transform: translate(2px, -2px) }
  75% { transform: translate(-2px, -2px) }
}
```
- Applied to: Headers, titles, critical alerts
- Creates: Digital distortion effect

**2. Grid Background**
```css
/* Animated matrix-style grid */
background: linear-gradient(cyan lines) + moving scan effect
animation: grid-scroll (vertical movement)
```
- Creates: Tron-like environment
- Effect: Continuous vertical scrolling

**3. Pulse Effect**
```css
@keyframes pulse {
  0%, 100% { opacity: 1 }
  50% { opacity: 0.5 }
}
```
- Applied to: Timer (< 60s), critical warnings
- Creates: Urgency indicator

**4. Button Interactions**
```css
.option-btn:hover {
  transform: translateX(10px);
  box-shadow: 0 0 20px cyan;
  border-color: cyan;
}
```
- Effect: Slide and glow on hover
- Feedback: Tactile, responsive feel

##### Screen-Specific Design

**Welcome Screen**
- Large glitching logo
- Animated subtitle
- Input field with cyan border glow
- "JACK IN" button with hover animation

**Quiz Screen**
```
┌─────────────────────────────────────────────┐
│ OPERATIVE: [Username]    CREDITS: [Score]  │
│ PROGRESS: [X/60]         TIMER: [MM:SS]    │
├─────────────────────────────────────────────┤
│                                             │
│  QUESTION [X/60]                            │
│  [Question text in large font]              │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ A. Option 1                         │   │
│  └─────────────────────────────────────┘   │
│  ┌─────────────────────────────────────┐   │
│  │ B. Option 2                         │   │
│  └─────────────────────────────────────┘   │
│  ┌─────────────────────────────────────┐   │
│  │ C. Option 3                         │   │
│  └─────────────────────────────────────┘   │
│  ┌─────────────────────────────────────┐   │
│  │ D. Option 4                         │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  [Feedback message area]                    │
└─────────────────────────────────────────────┘
```

**Completion Screen**
- Large grade display (S+, A, etc.)
- Final statistics table
- Animated leaderboard
- Neon border glow

---

## 🔐 Session Management

### Session Object Structure

```javascript
{
  id: "550e8400-e29b-41d4-a716-446655440000",  // UUID v4
  username: "CyberNinja",                       // Max 20 chars
  score: 1000,                                  // Current credits
  currentQuestion: 0,                            // 0-59 index
  startTime: 1700000000000,                     // Timestamp (ms)
  timeRemaining: 2700,                          // Seconds left
  active: true,                                 // Is quiz ongoing?
  completed: false,                             // Finished 60 questions?
  eliminated: false,                            // Hit 0 credits or timeout?
  grade: "S+ ELITE HACKER"                     // Assigned on completion
}
```

### Storage Layer Architecture

#### Dual-Storage Strategy

**Primary: Vercel KV (Redis-compatible)**
```javascript
// Only activates if environment variables present
KV_REST_API_URL=https://...
KV_REST_API_TOKEN=...

// Benefits:
✅ Persistent across serverless cold starts
✅ Shared state between all function instances
✅ Automatic expiration (24h TTL)
✅ High performance (Redis protocol)
```

**Fallback: In-Memory Map**
```javascript
// Activates if KV unavailable
const sessions = new Map();
let leaderboardData = [];

// Limitations:
⚠️ Lost on cold start
⚠️ Separate instances have separate data
⚠️ Not suitable for production at scale

// Advantages:
✅ No configuration required
✅ Works immediately in development
✅ Zero external dependencies
```

#### Storage Operations

```javascript
// Abstracted API (same interface for both)
storage = {
  async getSession(sessionId) {
    // Returns session object or null
  },
  
  async setSession(sessionId, data) {
    // Stores session with 24h expiration
  },
  
  async getLeaderboard() {
    // Returns array of completed players
  },
  
  async setLeaderboard(data) {
    // Updates global leaderboard
  }
}
```

### Session Recovery Process

```javascript
// On page load (DOMContentLoaded)
1. Check localStorage for 'quizSessionId'
   └─ If not found: Show welcome screen
   └─ If found: Proceed to step 2

2. Hide welcome screen (prevent flash)

3. GET /api/session/:id
   ├─ If 404: Clear localStorage, show welcome
   ├─ If 200: Continue to step 4
   └─ If error: Clear localStorage, show welcome

4. Check session.active state
   ├─ If false:
   │   ├─ If completed: Show completion screen
   │   ├─ If eliminated (time=0): Show timeout screen
   │   └─ If eliminated (time>0): Show game over screen
   │
   └─ If true:
       ├─ Restore username, score, progress
       ├─ Load current question
       ├─ Start timer countdown
       └─ Show quiz screen
```

---

## 🚀 Deployment

### Local Development

#### Prerequisites
```bash
Node.js: v14.0.0+
npm: 6.0.0+
pnpm: 7.0.0+ (optional, faster)
```

#### Setup & Run
```powershell
# Clone repository
git clone <repo-url>
cd Off_Sec_Quiz

# Install dependencies
npm install
# or
pnpm install

# Start development server (auto-restart)
npm run dev

# Start production mode
npm start

# Access at http://localhost:3000
```

#### Local Server Features
- Express.js backend
- File-based session storage (`sessions/*.json`)
- Hot-reload with nodemon
- CORS enabled for local testing
- Leaderboard stored in `leaderboard.json`

### Vercel Production Deployment

#### Architecture Changes for Serverless

**Serverless Function Characteristics:**
- ⏱️ Stateless: No persistent memory between invocations
- ❄️ Cold starts: Functions may shut down when idle
- 🔄 Multiple instances: Requests distributed across servers
- ⚡ Fast: Auto-scaling, global CDN

**Adaptations Made:**
1. **API Routes**: Moved from Express routes to individual serverless functions
2. **Storage**: Implemented dual-layer with KV fallback
3. **Static Files**: Served from `/public` via Vercel CDN
4. **Rewrites**: Configured in `vercel.json` for routing

#### Deployment Methods

**Method 1: Vercel CLI (Recommended)**
```powershell
# Install Vercel CLI globally
npm install -g vercel

# Login (one-time setup)
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# Access deployment URL
# Preview: https://cyberquiz-offsec-xxx.vercel.app
# Production: https://cyberquiz-offsec.vercel.app
```

**Method 2: GitHub Integration**
```
1. Push code to GitHub repository
2. Go to vercel.com → New Project
3. Import GitHub repository
4. Configure:
   - Framework Preset: Other
   - Build Command: npm run build
   - Output Directory: (leave empty)
5. Click Deploy
6. Auto-deploys on every git push
```

#### Environment Variables (Optional)

For persistent storage with Vercel KV:

```bash
# Vercel Dashboard → Project → Settings → Environment Variables

KV_REST_API_URL=https://your-kv-instance.upstash.io
KV_REST_API_TOKEN=your_token_here
```

**How to Get Vercel KV:**
1. Open project in Vercel Dashboard
2. Go to Storage tab
3. Create Vercel KV Database
4. Environment variables auto-populate

---

## 📡 API Reference

### Base URL
- **Local**: `http://localhost:3000/api`
- **Production**: `https://cyberquiz-offsec.vercel.app/api`

---

### 1. Create Session

**Endpoint**: `POST /api/session/create`

**Purpose**: Initialize a new quiz session

**Request Body**:
```json
{
  "username": "CyberNinja"
}
```

**Validations**:
- Username required (non-empty)
- Max length: 20 characters
- Trimmed whitespace

**Success Response** (200):
```json
{
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "session": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "username": "CyberNinja",
    "score": 1000,
    "currentQuestion": 0,
    "startTime": 1700000000000,
    "timeRemaining": 2700,
    "active": true,
    "completed": false,
    "eliminated": false
  }
}
```

**Error Response** (400):
```json
{
  "error": "Username is required"
}
```

---

### 2. Get Session

**Endpoint**: `GET /api/session/:sessionId`

**Purpose**: Retrieve current session state

**URL Parameters**:
- `sessionId` (string, UUID): Session identifier

**Success Response** (200):
```json
{
  "id": "550e8400-...",
  "username": "CyberNinja",
  "score": 1200,
  "currentQuestion": 4,
  "startTime": 1700000000000,
  "timeRemaining": 2580,
  "active": true,
  "completed": false,
  "eliminated": false
}
```

**Error Response** (404):
```json
{
  "error": "Session not found"
}
```

**Notes**:
- Time remaining is calculated server-side: `Math.max(0, 2700 - elapsed)`
- Elapsed = `Math.floor((Date.now() - startTime) / 1000)`

---

### 3. Submit Answer

**Endpoint**: `POST /api/session/:sessionId/answer`

**Purpose**: Process answer and update session

**URL Parameters**:
- `sessionId` (string, UUID): Session identifier

**Request Body**:
```json
{
  "questionIndex": 5,
  "isCorrect": true
}
```

**Success Response** (200):

*Normal progression:*
```json
{
  "session": {
    "id": "550e8400-...",
    "score": 1250,
    "currentQuestion": 6,
    "timeRemaining": 2565,
    "active": true,
    "completed": false,
    "eliminated": false
  }
}
```

*Quiz completed:*
```json
{
  "session": {
    "score": 3500,
    "currentQuestion": 60,
    "active": false,
    "completed": true,
    "grade": "S+ ELITE HACKER"
  },
  "completed": true,
  "grade": "S+ ELITE HACKER"
}
```

*Player eliminated (score ≤ 0):*
```json
{
  "session": {
    "score": 0,
    "active": false,
    "eliminated": true
  },
  "eliminated": true
}
```

*Time expired:*
```json
{
  "session": {
    "timeRemaining": 0,
    "active": false,
    "eliminated": true
  },
  "timeout": true
}
```

**Error Responses**:

*Session not found (404):*
```json
{
  "error": "Session not found"
}
```

*Session already ended (400):*
```json
{
  "error": "Session is not active"
}
```

**Processing Logic**:
1. Calculate time remaining from `startTime`
2. If timeout: Mark eliminated, return with `timeout: true`
3. If correct answer:
   - Add 50 to score
   - Increment `currentQuestion`
   - If `currentQuestion >= 60`: Mark completed, calculate grade, update leaderboard
4. If wrong answer:
   - Subtract 50 from score
   - If `score <= 0`: Mark eliminated
5. Save updated session
6. Return session with status flags

---

### 4. Get Leaderboard

**Endpoint**: `GET /api/leaderboard`

**Purpose**: Retrieve sorted list of completed players

**Success Response** (200):
```json
{
  "leaderboard": [
    {
      "username": "EliteHacker",
      "score": 3800,
      "timeUsed": 1200,
      "timeRemaining": 1500,
      "grade": "S+ ELITE HACKER",
      "timestamp": 1700000000000
    },
    {
      "username": "ProGamer",
      "score": 3200,
      "timeUsed": 1800,
      "timeRemaining": 900,
      "grade": "S MASTER HACKER",
      "timestamp": 1700001000000
    }
  ]
}
```

**Sorting**:
1. **Primary**: Highest score first
2. **Secondary**: Lowest `timeUsed` first (faster completion)

**Notes**:
- Only includes players who completed all 60 questions
- Eliminated players not listed
- `timeUsed = 2700 - timeRemaining`

---

## 📚 Question Bank

### Content Overview

**Total Questions**: 60  
**Format**: Multiple Choice (4 options each)  
**Difficulty Range**: Beginner to Advanced

### Topics Covered

| Category | Question Count | Example Topics |
|----------|----------------|----------------|
| **OSINT & Reconnaissance** | 8 | Open-source intelligence, Shodan, Maltego, passive recon |
| **Network Scanning** | 10 | Nmap, port scanning, service enumeration, network mapping |
| **Web Application Security** | 15 | XSS, SQLi, CSRF, SSRF, XXE, directory traversal |
| **Exploitation Tools** | 12 | Metasploit, Burp Suite, SQLmap, exploitation frameworks |
| **Privilege Escalation** | 6 | Linux/Windows privesc, SUID, kernel exploits |
| **Password Cracking** | 4 | John the Ripper, Hashcat, hash types, wordlists |
| **Wireless Security** | 3 | WPA/WEP, deauth attacks, rogue APs |
| **Social Engineering** | 2 | Phishing, pretexting, manipulation techniques |

### Sample Questions

**Easy (Foundational Knowledge)**:
```
Q: What does the acronym 'OSINT' stand for in cybersecurity?
A) Open Source Intelligence ✓
B) Operating System Interface
C) Offensive Security Intelligence Network
D) Online Security Integration Tool
```

**Medium (Practical Application)**:
```
Q: Which Metasploit module type is used to verify if a system is vulnerable?
A) Exploit
B) Payload
C) Auxiliary ✓
D) Post
```

**Hard (Advanced Concepts)**:
```
Q: What is a 'Padding Oracle Attack' used for?
A) Attacking poorly padded databases
B) Exploiting cryptographic implementations to decrypt data ✓
C) Overflowing padding in memory
D) Attacking Oracle databases specifically
```

### Question Structure

```javascript
{
  question: "What is the primary purpose of a 'reverse shell'?",
  options: [
    "To encrypt network traffic",
    "To allow a remote attacker to execute commands on a target system", // Correct
    "To scan for vulnerabilities",
    "To monitor system logs"
  ],
  correct: 1  // Zero-indexed (0-3)
}
```

### Educational Value

**Learning Outcomes**:
- ✅ Understand core offensive security terminology
- ✅ Recognize common attack vectors and techniques
- ✅ Identify proper tools for specific tasks
- ✅ Comprehend ethical hacking methodologies
- ✅ Prepare for certifications (CEH, OSCP, etc.)

**Pedagogical Approach**:
- Questions based on real-world scenarios
- Covers both theoretical and practical aspects
- Includes common misconceptions as wrong answers
- Encourages critical thinking (can retry wrong answers)

---

## 🔒 Security Considerations

### Current Implementation

#### ✅ Security Features

**1. Server-Side Validation**
- All game logic processed on server
- Score calculations cannot be manipulated
- Timer based on server timestamp
- Answer correctness verified server-side

**2. Session Isolation**
- UUID-based session IDs (cryptographically random)
- No cross-session data access
- Independent state for each player

**3. Input Sanitization**
- Username length validation (max 20 chars)
- Trimmed whitespace
- JSON body parsing with validation

**4. CORS Configuration**
- Controlled in `vercel.json`
- Allows all origins (suitable for public quiz)
- Restricts methods to GET, POST, OPTIONS

#### ⚠️ Known Limitations (Educational Project)

**1. No Authentication**
- Anyone can create sessions
- No user accounts or passwords
- Username not verified for uniqueness

**2. No Rate Limiting**
- Could be abused to spam sessions
- No protection against rapid answer submissions

**3. Client-Side Question Data**
- All questions loaded in `quiz.js`
- Answers visible in browser source
- Not suitable for high-stakes testing

**4. Storage Vulnerabilities**
- In-memory fallback loses data on restart
- No encryption for session data
- Session IDs stored in localStorage (XSS risk)

### Recommended Enhancements (Production)

**For High-Stakes Deployment**:

```javascript
// 1. Server-Side Question Delivery
GET /api/session/:id/question/:index
// Return one question at a time
// Hide correct answer

// 2. Answer Obfuscation
POST /api/session/:id/answer
// Only send selected index, not isCorrect
// Server determines correctness

// 3. Rate Limiting
// Implement per-IP or per-session limits
// Example: Max 1 request per second

// 4. Authentication
// Add JWT or session-based auth
// Verify user identity

// 5. Answer Shuffling
// Randomize option order per user
// Prevents answer sharing

// 6. HTTPS Only
// Force secure connections
// Implement HSTS headers
```

---

## 🎓 Educational Context

### Use Cases

**1. Classroom Integration**
- Assign as homework or practice quiz
- Use leaderboard for friendly competition
- Track student progress (with auth added)

**2. Certification Preparation**
- CEH (Certified Ethical Hacker) practice
- OSCP (Offensive Security Certified Professional) prep
- CompTIA Security+ review

**3. CTF Training**
- Warm-up before Capture The Flag events
- Concept review between challenges
- Team training sessions

**4. Self-Assessment**
- Individual skill evaluation
- Identify knowledge gaps
- Track improvement over time

### Learning Methodology

**Spaced Repetition Compatible**:
- Can be taken multiple times (create new sessions)
- Different question order possible (with code modification)
- Immediate feedback reinforces learning

**Gamification Elements**:
- Points system creates engagement
- Leaderboard drives competition
- Grades provide achievement goals
- Timer adds challenge and urgency

---

## 🛠️ Customization Guide

### Modifying Questions

**Add/Edit in `public/quiz.js`**:
```javascript
const questions = [
  {
    question: "Your custom question here?",
    options: [
      "Option A",
      "Option B (correct)",
      "Option C",
      "Option D"
    ],
    correct: 1  // Index of correct answer (0-3)
  },
  // Add more...
];
```

**Tips**:
- Keep questions concise (< 150 characters)
- Ensure only one clearly correct answer
- Include plausible distractors
- Test on mobile devices (character limit)

### Adjusting Difficulty

**Scoring**:
```javascript
// In api/session/[sessionId]/answer.js

// Starting points
score: 1000  // Change initial credits

// Correct answer reward
session.score += 50  // Increase/decrease reward

// Wrong answer penalty
session.score -= 50  // Adjust penalty

// Elimination threshold
if (session.score <= 0)  // Change to negative for buffer
```

**Timer**:
```javascript
// In api/session/create.js
timeRemaining: 45 * 60  // Change minutes (e.g., 30 * 60)

// In api/session/[sessionId]/answer.js
const elapsed = Math.floor((Date.now() - session.startTime) / 1000);
session.timeRemaining = Math.max(0, (45 * 60) - elapsed);
// Update both instances to match
```

**Grading Thresholds**:
```javascript
// In api/session/[sessionId]/answer.js
function calculateGrade(score, timeRemaining) {
  const composite = (scorePercentage * 0.7) + (timeScore * 0.3);
  
  if (composite >= 90) return 'S+ ELITE HACKER';
  // Adjust percentages or labels
}
```

### Theme Customization

**Colors** (`public/styles.css`):
```css
:root {
  --neon-cyan: #0ff;      /* Change primary accent */
  --neon-pink: #f0f;      /* Change secondary accent */
  --neon-purple: #a0f;    /* Change highlights */
  --dark-bg: #0a0a0a;     /* Change background */
}
```

**Fonts**:
```css
@import url('https://fonts.googleapis.com/css2?family=YourFont&display=swap');

body {
  font-family: 'YourFont', sans-serif;
}
```

**Animation Speed**:
```css
.glitch {
  animation: glitch 0.5s infinite;  /* Adjust duration */
}

.grid-bg {
  animation: grid-scroll 20s linear infinite;  /* Slower/faster */
}
```

---

## 📊 Analytics & Monitoring

### Metrics to Track (Future Enhancement)

**Player Engagement**:
- Total sessions created
- Completion rate (completed / started)
- Average score
- Average time to complete

**Question Analytics**:
- Per-question difficulty (% wrong attempts)
- Most missed questions
- Average attempts per question

**Performance**:
- API response times
- Cold start frequency (serverless)
- Storage read/write latency

**Implementation Example**:
```javascript
// Add to api/session/[sessionId]/answer.js
await trackMetric('answer_submitted', {
  sessionId,
  questionIndex,
  isCorrect,
  responseTime: Date.now() - requestStart
});
```

---

## 🐛 Troubleshooting

### Common Issues

**1. Session Lost After Refresh**
- **Cause**: localStorage disabled or cleared
- **Check**: Browser console → Application tab → Local Storage
- **Fix**: Enable cookies/storage, don't use incognito mode

**2. Timer Desync**
- **Cause**: Client-side countdown drifts from server
- **Expected**: Small drift (< 5 seconds) is normal
- **Re-syncs**: On every answer submission

**3. Questions Not Loading**
- **Cause**: `quiz.js` not loaded or syntax error
- **Check**: Browser console for JavaScript errors
- **Fix**: Verify `<script src="quiz.js">` in `index.html`

**4. Leaderboard Empty**
- **Cause**: Using in-memory storage (resets on cold start)
- **Fix**: Configure Vercel KV for persistence
- **Note**: Complete a full quiz to test

**5. Buttons Stay Disabled**
- **Cause**: JavaScript error during answer processing
- **Check**: Browser console for red error messages
- **Workaround**: Refresh page to resume session

### Debug Mode

**Enable Console Logging**:
All critical functions now log to console (already implemented):
```javascript
// Check browser console (F12) for:
Attempting to resume session: <id>
Submitting answer: { questionIndex, isCorrect, ... }
Answer response: { ok, status, data }
Loading question: <index>
```

**Manual Testing**:
```javascript
// In browser console
console.log('Session ID:', localStorage.getItem('quizSessionId'));
console.log('Current State:', currentSession);

// Force next question (dev only)
currentSession.currentQuestion = 59;
loadQuestion();
```

---

## 📜 License & Credits

### License
**MIT License** - Free to use, modify, and distribute with attribution.

### Technologies Used
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js, Express.js, Vercel Serverless
- **Storage**: Vercel KV (Redis), In-Memory Map
- **Fonts**: Google Fonts (Orbitron)
- **Hosting**: Vercel Edge Network

### Credits
- Cyberpunk aesthetic inspired by cyberpunk culture and sci-fi
- Question content based on industry-standard ethical hacking knowledge
- Built for educational purposes

---

## 🚧 Future Roadmap

### Planned Features

**Phase 1: Core Enhancements**
- [ ] User authentication and accounts
- [ ] Personal statistics dashboard
- [ ] Question shuffle and randomization
- [ ] Difficulty levels (Easy/Medium/Hard modes)

**Phase 2: Social Features**
- [ ] Friends list and challenges
- [ ] Team competitions
- [ ] Share results on social media
- [ ] Custom quiz creation by users

**Phase 3: Advanced Features**
- [ ] Question explanations after completion
- [ ] Hint system (with point penalty)
- [ ] Achievements and badges
- [ ] Weekly/monthly leaderboards

**Phase 4: Analytics**
- [ ] Player progress tracking
- [ ] Weak area identification
- [ ] Recommended study topics
- [ ] Question difficulty ratings

---

## 📞 Support & Contact

### Getting Help

**Documentation**:
- This file (PROJECT_DOCUMENTATION.md)
- [VERCEL_COMPLETE_GUIDE.md](VERCEL_COMPLETE_GUIDE.md) - Deployment details
- [BUG_FIXES.md](BUG_FIXES.md) - Recent bug fixes and debugging

**Common Resources**:
- [GitHub Repository](https://github.com/shadow-dragon-2002/Off_Sec_Quiz)
- [Live Demo](https://cyberquiz-offsec.vercel.app)
- Browser Console (F12) for debug logs

---

## 🎯 Quick Start Checklist

### For Players
- [ ] Visit https://cyberquiz-offsec.vercel.app
- [ ] Enter a unique username
- [ ] Click "JACK IN"
- [ ] Answer 60 questions before time runs out
- [ ] Keep score above 0
- [ ] Check leaderboard for ranking

### For Developers
- [ ] Clone repository
- [ ] Run `npm install`
- [ ] Run `npm run dev`
- [ ] Open http://localhost:3000
- [ ] Modify `public/quiz.js` to add questions
- [ ] Deploy with `vercel --prod`

---

<div align="center">

## ⚡ HACK THE SYSTEM. BEAT THE CLOCK. DOMINATE THE LEADERBOARD. ⚡

**Built with 💻 for the cybersecurity community**

[Live Demo](https://cyberquiz-offsec.vercel.app) • [GitHub](https://github.com/shadow-dragon-2002/Off_Sec_Quiz) • [Report Bug](https://github.com/shadow-dragon-2002/Off_Sec_Quiz/issues)

</div>
