# 🚀 Vercel Deployment - Complete Guide

## Project Structure for Vercel

```
Off_Sec_Quiz/
├── api/                          # Serverless Functions
│   ├── storage.js               # In-memory storage (basic)
│   ├── storage-enhanced.js      # Auto-detects Vercel KV
│   ├── leaderboard.js          # GET /api/leaderboard
│   └── session/
│       ├── create.js           # POST /api/session/create
│       ├── [sessionId].js      # GET /api/session/:id
│       └── [sessionId]/
│           └── answer.js       # POST /api/session/:id/answer
├── public/                      # Static Files
│   ├── index.html              # Main HTML
│   ├── styles.css              # Cyberpunk styles
│   ├── app.js                  # Frontend logic
│   └── quiz.js                 # Questions data
├── server.js                    # Local Express server
├── vercel.json                 # Vercel configuration
├── package.json                # Dependencies
└── README.md                   # Documentation
```

## 🎯 Deployment Methods

### Method 1: Vercel CLI (Fastest)

```powershell
# Install Vercel CLI globally
npm install -g vercel

# Login to your Vercel account
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Method 2: Git Integration (Recommended for Teams)

1. **Push to GitHub/GitLab/Bitbucket**
   ```powershell
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin YOUR_GIT_URL
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click "Import Project"
   - Select your Git repository
   - Click "Deploy"

3. **Automatic Deployments**
   - Every push to `main` → Production deploy
   - Every pull request → Preview deploy

### Method 3: Vercel Dashboard (Manual Upload)

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Drag and drop your project folder
4. Click "Deploy"

## ⚙️ Configuration

The `vercel.json` file handles:

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "framework": null,
  "rewrites": [
    { "source": "/", "destination": "/public/index.html" },
    { "source": "/api/session/create", "destination": "/api/session/create.js" },
    { "source": "/api/session/:sessionId", "destination": "/api/session/[sessionId].js" },
    { "source": "/api/session/:sessionId/answer", "destination": "/api/session/[sessionId]/answer.js" },
    { "source": "/api/leaderboard", "destination": "/api/leaderboard.js" }
  ]
}
```

## 🧪 Testing Before Deployment

### Test Locally with Vercel Dev Server

```powershell
# Install dependencies
npm install

# Run Vercel dev environment
npm run vercel-dev
# or
vercel dev
```

Visit `http://localhost:3000` and test:
- Creating a session
- Answering questions
- Viewing leaderboard
- Page refresh (session should persist)

### Run API Tests

```powershell
npm test
```

## 🔐 Adding Persistent Storage (Optional but Recommended)

### Option 1: Vercel KV (Easiest)

1. **Create KV Database in Vercel Dashboard**
   - Go to your project → Storage tab
   - Click "Create Database" → "KV"
   - Name it (e.g., "cyberquiz-storage")

2. **Environment Variables Auto-Added**
   - `KV_URL`
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
   - `KV_REST_API_READ_ONLY_TOKEN`

3. **Redeploy**
   ```powershell
   vercel --prod
   ```

4. **Verification**
   - The app will auto-detect Vercel KV
   - Check logs: "Using Vercel KV for storage"
   - Sessions now persist across deploys!

### Option 2: Upstash Redis

```powershell
npm install @upstash/redis
```

Add environment variables in Vercel:
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

### Option 3: MongoDB/PostgreSQL

Install database client and update storage implementation.

## 📊 Post-Deployment

### Your Live URLs

After deployment, you'll get:
```
Production: https://your-project.vercel.app
Preview:    https://your-project-git-branch.vercel.app
```

### Test Your Deployment

1. **Homepage**: `https://your-project.vercel.app/`
   - Should load cyberpunk quiz interface

2. **API Health**: `https://your-project.vercel.app/api/leaderboard`
   - Should return `[]` or leaderboard data

3. **Full Quiz Flow**:
   - Enter username
   - Start quiz
   - Answer questions
   - Refresh page (session should persist)
   - Complete quiz
   - View leaderboard

## 🎨 Custom Domain

1. Go to Project Settings → Domains
2. Add your domain (e.g., `cyberquiz.yourdomain.com`)
3. Configure DNS:
   - Type: `CNAME`
   - Name: `cyberquiz` (or `@` for root)
   - Value: `cname.vercel-dns.com`
4. Wait for DNS propagation (5-30 minutes)

## 📈 Monitoring

### View Logs
```powershell
vercel logs YOUR_DEPLOYMENT_URL
```

Or in Vercel Dashboard:
- Go to Deployments → Select deployment → View Logs

### Analytics
- Go to your project → Analytics tab
- See visitor counts, page views, performance

## 🔄 Updates and Redeployment

### Update Your App

```powershell
# Make changes
# Test locally
npm run vercel-dev

# Deploy updates
vercel --prod
```

### Rollback

In Vercel Dashboard:
1. Go to Deployments
2. Find previous working deployment
3. Click "..." → "Promote to Production"

## ⚠️ Important Notes

### Cold Starts
- Serverless functions may have ~1-2 second cold start
- After first request, they stay warm for a while

### Timeout Limits
- Free tier: 10 second function timeout
- Hobby tier: 10 seconds
- Pro tier: 60 seconds
- This app's functions execute in < 1 second ✅

### Data Persistence
- **Without Vercel KV**: Data resets on deploy or function restart
- **With Vercel KV**: Data persists indefinitely
- Recommended to add KV for production use

## 🐛 Troubleshooting

### API Returns 404
- Check `vercel.json` rewrites
- Ensure API files are named correctly with brackets: `[sessionId].js`
- Check function logs in dashboard

### CORS Errors
- CORS headers are pre-configured
- If issues persist, check browser console
- Verify API_URL in `public/app.js` is `/api` (relative)

### Session Not Working
- Check browser localStorage (should have `quizSessionId`)
- Verify API endpoints in Network tab
- Check Vercel function logs for errors

### Static Files Not Loading
- All static files must be in `/public` directory
- Check Network tab for 404s
- Verify paths in HTML/CSS

## 💡 Best Practices

1. **Use Git Integration** for automatic deployments
2. **Add Vercel KV** for data persistence
3. **Test with `vercel dev`** before deploying
4. **Monitor function logs** after deployment
5. **Set up custom domain** for professional look
6. **Enable Vercel Analytics** for insights

## 🎉 Success Checklist

- [ ] Project deploys without errors
- [ ] Homepage loads with cyberpunk theme
- [ ] Can create username and start quiz
- [ ] Questions display and answers validate
- [ ] Timer counts down correctly
- [ ] Score updates properly
- [ ] Page refresh maintains session
- [ ] Leaderboard displays after completion
- [ ] Multiple users can play simultaneously
- [ ] API endpoints respond quickly

## 📞 Support

If you encounter issues:
1. Check Vercel function logs
2. Review `DEPLOYMENT_CHECKLIST.md`
3. Test API with `npm test`
4. Check Vercel documentation: [vercel.com/docs](https://vercel.com/docs)

---

**Ready to deploy? Run: `vercel --prod`** 🚀
