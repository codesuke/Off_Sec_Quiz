# Pre-Deployment Checklist

## ✅ Files Verified

- [x] `public/` directory with all static files
- [x] `api/` directory with serverless functions
- [x] `vercel.json` configuration
- [x] `package.json` with correct dependencies
- [x] API routes using async storage

## 🧪 Test Locally Before Deploying

```powershell
# Install Vercel CLI
npm install -g vercel

# Test with Vercel dev server
vercel dev
```

This will simulate the Vercel environment locally.

## 🚀 Deploy Steps

1. **Push to Git** (if using Git integration)
```powershell
git add .
git commit -m "Prepare for Vercel deployment"
git push
```

2. **Deploy via CLI**
```powershell
vercel --prod
```

Or connect your Git repository in the Vercel dashboard for automatic deployments.

## ⚠️ Known Limitations (In-Memory Storage)

Without Vercel KV or external database:
- Sessions reset when serverless functions restart
- Leaderboard data is not persistent across deployments
- Multiple serverless instances don't share data

## 🔧 Enable Persistent Storage (Optional)

### Option 1: Add Vercel KV

1. In Vercel Dashboard, go to Storage tab
2. Create a new KV database
3. Vercel will automatically add environment variables
4. Redeploy - the app will auto-detect KV and use it

### Option 2: Use External Database

Install a database client and update `api/storage-enhanced.js`:
```powershell
npm install mongodb
# or
npm install @upstash/redis
```

## 📝 Post-Deployment Verification

Test these endpoints:
1. `https://your-app.vercel.app/` - Should load quiz
2. `https://your-app.vercel.app/api/leaderboard` - Should return empty array
3. Start a quiz and verify session persistence

## 🐛 Troubleshooting

### API routes return 404
- Check `vercel.json` rewrites configuration
- Ensure API files are in `/api` directory with correct structure

### CORS errors
- CORS headers are configured in each API route
- Check browser console for specific errors

### Sessions not working
- Verify API URL in `public/app.js` is set to `/api`
- Check Vercel function logs in dashboard

### Static files not loading
- Ensure all files are in `/public` directory
- Check browser network tab for 404 errors

## 🎉 Success Indicators

- ✅ Quiz loads with cyberpunk theme
- ✅ Can create username and start quiz
- ✅ Questions load and answers are validated
- ✅ Timer counts down correctly
- ✅ Score updates on correct/wrong answers
- ✅ Leaderboard displays after completion
- ✅ Page refresh maintains session (timer continues)
